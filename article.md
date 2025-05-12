あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

[:contents]

# 段落

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

#  画像（はてなフォトライフ）

[f:id:hatenablog:20101106100658j:image]

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

# 脚注

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。[^1]

# 続きを読む

※トップページでのみ表示されます。記事ページでは表示されません。

<!-- more -->

# 罫線

---

# asin

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

[asin:4798110523:detail]

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

# 引用

> 本日（11月12日）から11月27日まで、はてなダイアリーの公開デザインコンテスト「公開デザイン祭2007秋」を開催します。
>
> <cite>[「公開デザイン祭2007秋」を開始しました - はてなダイアリー日記](http://d.hatena.ne.jp/hatenadiary/20071112/1194858362)</cite>

# リスト（ul,ol,dl）

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

- 大賞1名：Amazonギフト券5万円分
- 入選9名：Amazonギフト券1万円分
    - 大賞1名：Amazonギフト券5万円分
    - 入選9名：Amazonギフト券1万円分

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

1. 大賞1名：Amazonギフト券5万円分
1. 入選9名：Amazonギフト券1万円分
    1. 大賞1名：Amazonギフト券5万円分
    1. 入選9名：Amazonギフト券1万円分

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

<dl>
<dt>大賞1名</dt>
<dd>Amazonギフト券5万円分</dd>
<dt>入選9名</dt>
<dd>Amazonギフト券1万円分</dd>
</dl>

# テーブル

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

|名前|色|個数|
|-|-|-|
|りんご|赤|1|
|みかん|だいだい|2|

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。

# コードブロック

文章中のコードブロック`dict`。

```css
.XXX {
width: 999px;
height: 999px;
}

.propA, .propB, .propC {
width: 999px;
height: 999px;
}

#YYY {
width: 9px;
height: 999px;
}
```

```terraform
terraform {
  required_version = ">= 1.0.0, < 2.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# S3
resource "aws_s3_bucket" "example" {
  bucket = "terraform-example-s3-cloudfront"
}
```

```python
class SimpleTokenizerV1:
    def __init__(self, vocab):
        self.str_to_int = vocab
        self.int_to_str = {i: s for s, i in vocab.items()}

    def encode(self, text):
        # 正規表現でトークン分割
        preprocessed = re.split(r'([,.:;?_!"()\']|--|\s)', text)
        preprocessed = [item.strip() for item in preprocessed if item.strip()]
        # トークン→ID
        ids = [self.str_to_int[s] for s in preprocessed]
        return ids

    def decode(self, ids):
        # ID→トークン
        text = " ".join([self.int_to_str[i] for i in ids])
        # 句読点の前の余計なスペースを除去
        text = re.sub(r'\s+([,.?!"()\'])', r'\1', text)
        return text
```

```cs
using System;
using System.Diagnostics;
using Amazon;
using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.S3;

var profile = "YOUR_PROFILE_NAME";
var credentials = LoadSsoCredentials(profile);

// any operation you want to do with sso credentials.
var s3client = new AmazonS3Client(credentials, RegionEndpoint.APNortheast1);
var buckets = await s3client.ListBucketsAsync();
foreach (var bucket in buckets.Buckets)
{
    Console.WriteLine(bucket.BucketName);
}

static AWSCredentials LoadSsoCredentials(string profileName)
{
    var chain = new CredentialProfileStoreChain();
    if (!chain.TryGetAWSCredentials(profileName, out var credentials))
        throw new Exception($"Failed to find the {profileName} profile");
    if (credentials is not SSOAWSCredentials ssoCredentials)
        throw new Exception($"Credential found but it was not {nameof(SSOAWSCredentials)}");

    ssoCredentials.Options.ClientName = "LinqPad";
    ssoCredentials.Options.SsoVerificationCallback = args =>
    {
        // Launch a browser window that prompts the SSO user to complete an SSO sign-in.
        // This method is only invoked if the session doesn't already have a valid SSO token.
        // NOTE: Process.Start might not support launching a browser on macOS or Linux. If not,
        //       use an appropriate mechanism on those systems instead.
        Process.Start(new ProcessStartInfo
        {
            FileName = args.VerificationUriComplete,
            UseShellExecute = true
        });
    };

    return ssoCredentials;
}
```

# h1見出し

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890

## h2見出し

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890

### h3見出し

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890

#### h4見出し

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890

##### h5見出し

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890

###### h6見出し

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890

# 長いセクションの名前を出してみましょう

あのイーハトヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモーリオ市、郊外のぎらぎら光る草の波。
ABCDEFGHIJKLMabcdefghijklm1234567890


[^1]: ここに脚注を書きます
