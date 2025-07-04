// Simple script to capture theme store image with device mockups
import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureThemeStore() {
  console.log('Starting theme store image capture with device mockups...');

  // Launch a browser
  const browser = await chromium.launch();

  // Create a new page
  const context = await browser.newContext({
    viewport: { width: 640, height: 480 }
  });
  const page = await context.newPage();

  try {
    // Navigate to the HTML file
    const htmlPath = path.join(__dirname, 'theme-store-catch.html');
    await page.goto(`file://${htmlPath}`);

    console.log('Page loaded, waiting for rendering...');

    // Wait a moment for any animations or rendering to complete
    await page.waitForTimeout(1000);    // コンテナ要素を見つけてその位置に基づいてスクリーンショットを撮る
    const containerBox = await page.locator('.container').boundingBox();

    if (!containerBox) {
      console.error('コンテナ要素が見つかりませんでした');
      return;
    }

    console.log('Container element found at:', containerBox);

    // Take screenshot of the container element
    await page.screenshot({
      path: path.join(__dirname, 'theme-store-catch.png'),
      clip: {
        x: containerBox.x,
        y: containerBox.y,
        width: 620,
        height: 460
      }
    });

    console.log('Screenshot saved to theme-store-catch.png');
  } catch (error) {
    console.error('Error capturing screenshot:', error);
  } finally {
    await browser.close();
  }
}

captureThemeStore().catch(console.error);
