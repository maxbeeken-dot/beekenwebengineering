// Rendert die gestalteten Vorschaubilder für ein Video (ersetzt den schwarzen Auto-Frame).
//
// Aufruf:
//   node make-cover.mjs <slug> "<Headline>" [kicker] [accent] [badge]
//   z.B. node make-cover.mjs dergarten "Eine Website ist wie ein Garten" "Pflege" green "🌱"
//
// Ausgabe:  covers/<slug>-916.jpg  (1080×1920 → TikTok/Instagram/Pinterest)
//           covers/<slug>-169.jpg  (1280×720  → YouTube-Thumbnail)
// JPEG statt PNG, weil YouTube/Pinterest bei Thumbnails ein 2-MB-Limit haben.
import {bundle} from '@remotion/bundler';
import {selectComposition, renderStill} from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [slug, headline, kicker = '', accent = 'violet', badge = ''] = process.argv.slice(2);
if (!slug || !headline) {
  console.log('Aufruf: node make-cover.mjs <slug> "<Headline>" [kicker] [accent] [badge]');
  process.exit(2);
}

const browserExecutable = process.env.REMOTION_BROWSER
  || '/Users/maxbeeken/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell';

const outDir = path.join(__dirname, 'covers');
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.join(__dirname, 'src', 'index.jsx')});
const inputProps = {headline, kicker, accent, badge};

for (const [id, suffix] of [['Cover916', '916'], ['Cover169', '169']]) {
  const composition = await selectComposition({serveUrl, id, browserExecutable, inputProps});
  const output = path.join(outDir, `${slug}-${suffix}.jpg`);
  await renderStill({
    composition, serveUrl, output, frame: 0, browserExecutable, inputProps,
    imageFormat: 'jpeg', jpegQuality: 92, overwrite: true,
  });
  const kb = (fs.statSync(output).size / 1024).toFixed(0);
  console.log(`✓ ${suffix}: ${output} (${kb} kB)`);
}
console.log('Fertig — Cover liegen in video-studio/covers/');
