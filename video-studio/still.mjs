import {bundle} from '@remotion/bundler';
import {selectComposition, renderStill} from '@remotion/renderer';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compId = process.argv[2] || 'ChatDeal';
const frames = (process.argv[3] || '150,280,480,640,700,760').split(',').map(Number);
const browserExecutable = process.env.REMOTION_BROWSER
  || '/Users/maxbeeken/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell';

const serveUrl = await bundle({entryPoint: path.join(__dirname, 'src', 'index.jsx')});
const composition = await selectComposition({serveUrl, id: compId, browserExecutable});
for (const fr of frames) {
  const out = `/tmp/${compId}-f${fr}.png`;
  await renderStill({composition, serveUrl, output: out, frame: fr, browserExecutable});
  console.log('still', fr, '->', out);
}
