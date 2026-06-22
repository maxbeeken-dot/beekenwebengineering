import {bundle} from '@remotion/bundler';
import {selectComposition, renderMedia} from '@remotion/renderer';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compId = process.argv[2] || 'WebsiteGlowUp';
const out = process.argv[3] || path.join(__dirname, 'out', `${compId}.mp4`);
const log = (m) => console.log(`[render ${new Date().toTimeString().slice(0,8)}] ${m}`);

// Remotions gebündelter Browser-Download schlägt hier fehl ("No browser found").
// Stattdessen das bereits installierte Playwright-chrome-headless-shell verwenden.
const browserExecutable = process.env.REMOTION_BROWSER
  || '/Users/maxbeeken/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell';

log('Bundle...');
const serveUrl = await bundle({entryPoint: path.join(__dirname, 'src', 'index.jsx')});
log('Composition: ' + compId);
const composition = await selectComposition({serveUrl, id: compId, browserExecutable});
log(`Render ${composition.width}x${composition.height}, ${composition.durationInFrames}f @ ${composition.fps}fps`);
await renderMedia({
  composition, serveUrl, codec: 'h264', outputLocation: out, browserExecutable,
  onProgress: ({progress}) => { const pc = Math.round(progress*100); if (pc % 10 === 0) log('render ' + pc + '%'); },
});
log('✓ FERTIG: ' + out);
