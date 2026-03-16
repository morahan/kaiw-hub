#!/usr/bin/env node
/**
 * kaiw-hub screenshot tool
 * Usage: node scripts/screenshot.js [agent|all] [--label before|after|sprint1]
 * Saves to: scripts/screenshots/<label>/<agent>-<timestamp>.png
 */
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.SCREENSHOT_URL || 'http://127.0.0.1:5173';

const AGENTS = [
  'hub',      // homepage
  'freq',
  'badger',
  'aria',
  'greta',
  'marty',
  'renzo',
  'kaia',
  'thea',
  'reno',
  'quanta',
  'maverick',
  'buddy',
];

const args = process.argv.slice(2);
const targetArg = args.find(a => !a.startsWith('--')) || 'all';
const labelIdx = args.indexOf('--label');
const labelArg = labelIdx >= 0 ? args[labelIdx + 1] : (args.find(a => a.startsWith('--label='))?.split('=')[1] || 'snapshot');

const targets = targetArg === 'all' ? AGENTS : targetArg.split(',');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = path.join(__dirname, 'screenshots', labelArg);

async function run() {
  await mkdir(outDir, { recursive: true });
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const results = [];

  for (const agent of targets) {
    const url = agent === 'hub' ? BASE_URL + '/' : `${BASE_URL}/${agent}`;
    console.log(`📸 Screenshotting ${agent} → ${url}`);
    
    try {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      // Wait for animations/charts to render
      await page.waitForTimeout(2500);
      
      const filePath = path.join(outDir, `${agent}-${timestamp}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`  ✅ Saved: ${filePath}`);
      results.push({ agent, status: 'ok', path: filePath });
      await page.close();
    } catch (err) {
      console.error(`  ❌ Failed ${agent}: ${err.message}`);
      results.push({ agent, status: 'error', error: err.message });
    }
  }

  await browser.close();
  const ok = results.filter(r => r.status === 'ok').length;
  console.log(`\n✨ Done: ${ok}/${targets.length} screenshots → ${outDir}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
