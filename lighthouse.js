/**
 * 開発用ブログに対してLighthouseを実行する。
 *
 * --mode=prod (既定): 本番相当の状態を再現して計測する。
 *   ブログとデザインCSSのホストをローカルのHTTPSプロキシに向け、実際のはてなブログからの応答を次のように書き換える。
 *   - head内の http://localhost:5173 のタグ(@vite/client, style.scss, js/*.js)を取り除く
 *   - デザインCSS(usercss.blog.st-hatena.com)の中身を build/style.css に差し替える
 *   - customize-*.html を「ブログタイトル下」(#blog-title の直後)に挿入する
 *   書き換えた応答は本番と同じくgzipで返し、それ以外の通信はそのまま中継する。はてなブログの設定は変更しない。
 *   事前に `npm run build` で build/style.css を最新にしておくこと。
 * --mode=dev: 開発サーバー(npm start)から読み込まれる状態をそのまま計測する。
 *
 * 使い方:
 *   node lighthouse.js [URL] [--mode=prod|dev] [--form=mobile|desktop] [--runs=N]
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import https from "node:https";
import path from "node:path";
import zlib from "node:zlib";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const DEFAULT_URL = "https://guitarrapc-theme.hatenablog.com/entry/2025/05/17/015533";
const DEV_SERVER = "http://localhost:5173";
const USERCSS_HOST = "usercss.blog.st-hatena.com";
const CUSTOMIZE_FILES = [
    "customize-codeblock.html",
    "customize-dark-mode.html",
    "customize-tag-cloud.html",
    "customize-toc-toggle.html",
    "customize-toc-button.html",
    "customize-alert.html",
];
const OUT_DIR = "lighthouse-report";
const CERT_DIR = path.join(OUT_DIR, ".cert");

const args = process.argv.slice(2);
const option = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const url = new URL(args.find((a) => !a.startsWith("--")) ?? DEFAULT_URL);
const mode = option("mode", "prod");
const form = option("form", "mobile");
const runs = Number(option("runs", "1"));
if (!["prod", "dev"].includes(mode)) throw new Error(`--mode は prod か dev を指定してください: ${mode}`);
if (!["mobile", "desktop"].includes(form)) throw new Error(`--form は mobile か desktop を指定してください: ${form}`);

const DEV_TAG = new RegExp(`<(script|link)\\b[^>]*${DEV_SERVER.replace(/[.:/]/g, "\\$&")}[^>]*>(\\s*</script>)?\\s*`, "g");
const BLOG_TITLE_END = /(<header id="blog-title"[\s\S]*?<\/header>)/;

async function loadProdAssets() {
    const css = await fs.readFile("build/style.css", "utf8").catch(() => {
        throw new Error("build/style.css がありません。先に `npm run build` を実行してください");
    });
    const customize = (await Promise.all(CUSTOMIZE_FILES.map((f) => fs.readFile(f, "utf8")))).join("\n");
    return { css, customize };
}

function toProdHtml(html, customize) {
    const stripped = html.replace(DEV_TAG, "");
    if (stripped === html) throw new Error(`${DEV_SERVER} のタグが見つかりません。開発用ブログのhead設定を確認してください`);
    if (!html.includes(USERCSS_HOST)) throw new Error("デザインCSSのlinkが見つかりません。デザインCSSを空にしていないか確認してください");
    if (!BLOG_TITLE_END.test(stripped)) throw new Error("#blog-title が見つかりません");
    return stripped.replace(BLOG_TITLE_END, `$1\n${customize}\n`);
}

// Chromeは --ignore-certificate-errors で起動するので自己署名証明書で足りる
async function loadCert() {
    const key = path.join(CERT_DIR, "key.pem");
    const cert = path.join(CERT_DIR, "cert.pem");
    await fs.mkdir(CERT_DIR, { recursive: true });
    if (!(await fs.stat(cert).catch(() => null))) {
        // 環境のopenssl.cnfに左右されないよう最小の設定ファイルを渡す
        const config = path.join(CERT_DIR, "openssl.cnf");
        await fs.writeFile(config, "[req]\ndistinguished_name = dn\n[dn]\n");
        execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "3650", "-config", config, "-subj", "/CN=lighthouse-proxy", "-keyout", key, "-out", cert], { stdio: "pipe" });
    }
    return { key: await fs.readFile(key), cert: await fs.readFile(cert) };
}

// Node.jsの名前解決はChromeのhost-resolver-rulesの影響を受けないので、実際のはてなブログに届く
function upstream(req) {
    return new Promise((resolve, reject) => {
        const up = https.request({ host: req.headers.host, path: req.url, method: req.method, headers: req.headers }, resolve);
        up.on("error", reject);
        req.pipe(up);
    });
}

async function readBody(res) {
    const chunks = [];
    for await (const c of res) chunks.push(c);
    const buf = Buffer.concat(chunks);
    const decode = { gzip: zlib.gunzipSync, br: zlib.brotliDecompressSync, deflate: zlib.inflateSync }[res.headers["content-encoding"]];
    return (decode ? decode(buf) : buf).toString("utf8");
}

// 本文を差し替えて、本番と同じくgzipで返す
function sendRewritten(res, upRes, body) {
    const headers = { ...upRes.headers, "content-encoding": "gzip" };
    delete headers["content-length"];
    delete headers["transfer-encoding"];
    res.writeHead(upRes.statusCode, headers);
    res.end(zlib.gzipSync(body));
}

// ブログとデザインCSSへの通信を中継し、計測対象の文書とデザインCSSだけ書き換えるプロキシ
async function startProxy({ css, customize }) {
    const server = https.createServer(await loadCert(), async (req, res) => {
        try {
            const upRes = await upstream(req);
            const ok = upRes.statusCode === 200;
            if (ok && req.headers.host === url.host && req.url === url.pathname + url.search) {
                sendRewritten(res, upRes, toProdHtml(await readBody(upRes), customize));
            } else if (ok && req.headers.host === USERCSS_HOST) {
                upRes.resume();
                sendRewritten(res, upRes, css);
            } else {
                res.writeHead(upRes.statusCode, upRes.headers);
                upRes.pipe(res);
            }
        } catch (err) {
            console.error(`中継に失敗しました: https://${req.headers.host}${req.url}\n${err.message}`);
            res.writeHead(502).end();
        }
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    return server;
}

async function runOnce(proxy) {
    const chromeFlags = ["--headless=new"];
    if (proxy) {
        const target = `127.0.0.1:${proxy.address().port}`;
        chromeFlags.push(`--host-resolver-rules=MAP ${url.host}:443 ${target}, MAP ${USERCSS_HOST}:443 ${target}`, "--ignore-certificate-errors");
    } else {
        // 公開サイトからlocalhostへのアクセスはLocal Network Accessの許可が必要になるため無効化する
        chromeFlags.push("--disable-features=LocalNetworkAccessChecks,BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessSendPreflights");
    }
    const chrome = await chromeLauncher.launch({ chromeFlags });
    try {
        return await lighthouse(url.href, { port: chrome.port, output: ["html", "json"], logLevel: "error" }, form === "desktop" ? desktopConfig : undefined);
    } finally {
        // WindowsではChromeの一時プロファイル削除がEPERMで失敗することがあるが計測結果には影響しない
        try {
            await chrome.kill();
        } catch {}
    }
}

function summarize(lhr) {
    const score = (id) => Math.round(lhr.categories[id].score * 100);
    const audit = (id) => lhr.audits[id].displayValue;
    return {
        Performance: score("performance"),
        Accessibility: score("accessibility"),
        "Best Practices": score("best-practices"),
        SEO: score("seo"),
        FCP: audit("first-contentful-paint"),
        LCP: audit("largest-contentful-paint"),
        TBT: audit("total-blocking-time"),
        CLS: audit("cumulative-layout-shift"),
        SI: audit("speed-index"),
    };
}

await fs.mkdir(OUT_DIR, { recursive: true });
const proxy = mode === "prod" ? await startProxy(await loadProdAssets()) : undefined;
const results = [];
try {
    for (let i = 1; i <= runs; i++) {
        console.log(`[${i}/${runs}] ${mode} / ${form}: ${url.href}`);
        const { lhr, report } = await runOnce(proxy);
        if (lhr.runtimeError) throw new Error(`Lighthouseの実行に失敗しました: ${lhr.runtimeError.code} ${lhr.runtimeError.message}`);
        const failed = lhr.audits["network-requests"].details.items.filter((r) => r.statusCode >= 400 || r.statusCode === -1);
        for (const r of failed) console.warn(`  読み込み失敗: ${r.statusCode} ${r.url}`);
        results.push({ lhr, report });
    }
} finally {
    proxy?.close();
}

// 複数回実行した場合はPerformanceスコアの中央値の回を採用する
results.sort((a, b) => a.lhr.categories.performance.score - b.lhr.categories.performance.score);
const median = results[Math.floor((results.length - 1) / 2)];
const base = path.join(OUT_DIR, `${mode}-${form}`);
await fs.writeFile(`${base}.report.html`, median.report[0]);
await fs.writeFile(`${base}.report.json`, median.report[1]);

if (runs > 1) console.table(results.map((r) => summarize(r.lhr)));
console.log("採用した回 (Performance中央値):");
console.table(summarize(median.lhr));
console.log(`レポート: ${base}.report.html`);
