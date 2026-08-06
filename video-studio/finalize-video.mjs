// Setzt ein gestaltetes Cover als ERSTEN Frame ins Video.
//
// Warum: Alle Plattformen ziehen ihr Vorschaubild automatisch aus dem Anfang des Videos.
// Unsere Compositions starten dunkel (Luminanz ~14/255) → überall schwarze Vorschau.
// YouTube erlaubt eigene Shorts-Thumbnails nur in der Handy-App, TikTok/IG/Pinterest
// nur Frame-Auswahl. Der einzige Hebel, der ÜBERALL greift: Frame 0 selbst gestalten.
//
// Aufruf: node finalize-video.mjs <CompId> [dauerSek]
//   erwartet covers/<slug>-916.jpg (via make-cover.mjs) und out/<CompId>.mp4
//   schreibt out/<CompId>-final.mp4
//
// Technik: Cover als Standbild (Dauer D) vor das Video schneiden, Audio um D mit Stille
// vorpuffern, damit Bild/Ton synchron bleiben. Ein Re-Encode ist nötig (Concat zweier
// unterschiedlicher Quellen), Parameter sind auf Plattform-Uploads ausgelegt:
// H.264 High, yuv420p (sonst zeigen manche Player nur Schwarz), +faststart (moov nach vorn,
// sonst kann die Vorschau beim Upload gar nicht erst gelesen werden).
import {execFileSync} from 'child_process';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FFMPEG = path.join(__dirname, '..', 'node_modules', 'ffmpeg-static', 'ffmpeg');

const comp = process.argv[2];
const holdSec = Number(process.argv[3] || 0.5); // kurz genug, um den Hook nicht auszubremsen
if (!comp) { console.log('Aufruf: node finalize-video.mjs <CompId> [dauerSek]'); process.exit(2); }

const slug = comp.toLowerCase();
const video = path.join(__dirname, 'out', `${comp}.mp4`);
const cover = path.join(__dirname, 'covers', `${slug}-916.jpg`);
const out = path.join(__dirname, 'out', `${comp}-final.mp4`);

for (const [f, what] of [[video, 'Video'], [cover, 'Cover (erst make-cover.mjs laufen lassen)']]) {
  if (!fs.existsSync(f)) { console.log(`⚠️ ${what} fehlt: ${f}`); process.exit(2); }
}
if (!fs.existsSync(FFMPEG)) { console.log('⚠️ ffmpeg-static nicht gefunden: ' + FFMPEG); process.exit(2); }

const args = [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-loop', '1', '-t', String(holdSec), '-i', cover,          // 0: Coverbild
  '-f', 'lavfi', '-t', String(holdSec), '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000', // 1: Stille
  '-i', video,                                               // 2: Originalvideo
  '-filter_complex',
  // Cover auf exakt 1080×1920 bringen (padden statt beschneiden) und auf 30 fps setzen
  `[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,` +
  `pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=#08080b,fps=30,setsar=1[cv];` +
  `[2:v]scale=1080:1920,fps=30,setsar=1[mv];` +
  `[2:a]aresample=48000[ma];` +
  `[cv][1:a][mv][ma]concat=n=2:v=1:a=1[v][a]`,
  '-map', '[v]', '-map', '[a]',
  '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
  '-preset', 'medium', '-crf', '19',
  '-c:a', 'aac', '-b:a', '192k',
  '-movflags', '+faststart',
  out,
];

console.log(`Cover (${holdSec}s) wird vor ${comp}.mp4 gesetzt …`);
try {
  execFileSync(FFMPEG, args, {stdio: ['ignore', 'inherit', 'inherit']});
} catch (e) {
  console.log('⚠️ ffmpeg fehlgeschlagen: ' + e.message);
  process.exit(1);
}

// Prüfen, dass Frame 0 wirklich hell ist (sonst war die Mühe umsonst)
const probe = execFileSync(FFMPEG, ['-hide_banner', '-i', out, '-frames:v', '1', '-vf', 'signalstats,metadata=print', '-f', 'null', '-'],
  {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']}).toString();
const yavg = (probe.match(/YAVG=([0-9.]+)/) || [])[1];
const mb = (fs.statSync(out).size / 1048576).toFixed(1);
console.log(`✓ ${out} (${mb} MB)`);
console.log(yavg ? `  Frame-0-Helligkeit: ${Number(yavg).toFixed(1)}/255 ${Number(yavg) > 25 ? '✅ sichtbar' : '⚠️ immer noch dunkel'}` : '  (Helligkeit nicht messbar)');
