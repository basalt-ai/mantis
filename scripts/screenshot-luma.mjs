import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, 'public/luma-visual.html');
const outPath = path.resolve(__dirname, 'public/luma-visual.png');

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  defaultViewport: { width: 1200, height: 1200, deviceScaleFactor: 2 },
});

try {
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  const card = await page.$('.card');
  await card.screenshot({ path: outPath, omitBackground: false, type: 'png' });
  console.log('saved ->', outPath);
} finally {
  await browser.close();
}
