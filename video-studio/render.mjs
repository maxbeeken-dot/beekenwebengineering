import {bundle} from '@remotion/bundler';
import {selectComposition, renderMedia} from '@remotion/renderer';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compId = process.argv[2] || 'WebsiteGlowUp';
const out = process.argv[3] || path.join(__dirname, 'out', `${compId}.mp4`);
const log = (m) => console.log(`[render ${new Date().toTimeString().slice(0,8)}] ${m}`);

log('Bundle...');
const serveUrl = await bundle({entryPoint: path.join(__dirname, 'src', 'index.jsx')});
log('Composition: ' + compId);
const composition = await selectComposition({serveUrl, id: compId});
log(`Render ${composition.width}x${composition.height}, ${composition.durationInFrames}f @ ${composition.fps}fps`);
await renderMedia({
  composition, serveUrl, codec: 'h264', outputLocation: out,
  onProgress: ({progress}) => { const pc = Math.round(progress*100); if (pc % 10 === 0) log('render ' + pc + '%'); },
});
log('✓ FERTIG: ' + out);
