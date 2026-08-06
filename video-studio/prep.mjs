// Ein Befehl für die komplette Upload-Vorbereitung eines Videos.
//
//   node prep.mjs <CompId> "<Headline>" [kicker] [accent] [badge] [holdSec]
//
// Ablauf:  1) Cover rendern (916 für Feeds + 169 als YouTube-Reserve)
//          2) Cover als Frame 0 ins Video backen  →  out/<CompId>-final.mp4
// Danach:  cd lead-automation && node upload-all.mjs <CompId> <slug>
//          (upload-all nimmt automatisch die -final.mp4, wenn sie existiert)
//
// accent: violet | teal | red | gold | green
import {execFileSync} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [comp, headline, kicker = '', accent = 'violet', badge = '', hold = '0.5'] = process.argv.slice(2);
if (!comp || !headline) {
  console.log('Aufruf: node prep.mjs <CompId> "<Headline>" [kicker] [accent] [badge] [holdSec]');
  process.exit(2);
}
const slug = comp.toLowerCase();
const run = (script, args) => execFileSync(process.execPath, [path.join(__dirname, script), ...args], {stdio: 'inherit'});

console.log(`\n▸ 1/2 Cover für ${comp} …`);
run('make-cover.mjs', [slug, headline, kicker, accent, badge]);

console.log(`\n▸ 2/2 Cover als Frame 0 einbacken …`);
run('finalize-video.mjs', [comp, hold]);

console.log(`\n✅ Fertig. Rollout mit:\n   cd ../../lead-automation && caffeinate -dis node upload-all.mjs ${comp} ${slug}\n`);
