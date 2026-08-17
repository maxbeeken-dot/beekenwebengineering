/**
 * Macht aus einem gerenderten Probefilm die auslieferbare Seite:
 * komprimiert das Video, zieht ein Poster und schreibt die HTML-Seite.
 *
 * Aufruf: node make-probefilm-page.mjs <slug> <mp4> "<Name>" "<Ort>"
 * Ergebnis: ../probefilm/<slug>/{film.mp4,poster.jpg,index.html}
 *
 * Die Seite ist bewusst unlisted (noindex) — sie zeigt das Bildmaterial des Hosts,
 * das ihm gehört. robots.txt sperrt /probefilm/ zusätzlich.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [slug, mp4, name, location] = process.argv.slice(2);
if (!slug || !mp4 || !name) {
  console.error('Aufruf: node make-probefilm-page.mjs <slug> <mp4> "<Name>" "<Ort>"');
  process.exit(1);
}

const FF = path.join(__dirname, 'node_modules/@remotion/compositor-darwin-arm64/ffmpeg');
const dir = path.join(__dirname, '..', 'probefilm', slug);
mkdirSync(dir, { recursive: true });

// ~19 MB roh sind für eine Webseite zu schwer; crf 26 landet bei ~4 MB ohne sichtbaren Verlust.
execFileSync(FF, ['-y', '-loglevel', 'error', '-i', mp4, '-vcodec', 'libx264', '-crf', '26',
  '-preset', 'slow', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  '-acodec', 'aac', '-b:a', '96k', path.join(dir, 'film.mp4')]);
execFileSync(FF, ['-y', '-loglevel', 'error', '-i', path.join(dir, 'film.mp4'),
  '-ss', '1.6', '-frames:v', '1', '-q:v', '4', path.join(dir, 'poster.jpg')]);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

writeFileSync(path.join(dir, 'index.html'), `<!doctype html>
<html lang="de" data-page="probefilm">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>Probefilm — ${esc(name)}</title>
<link rel="icon" href="/logo-96.png">
<style>
  :root{
    --bg:oklch(0.08 0 0); --surface:oklch(0.13 0.010 280);
    --ink:oklch(0.96 0.004 280); --ink-muted:oklch(0.56 0.010 280);
    --primary:oklch(0.60 0.200 280); --primary-hi:oklch(0.66 0.188 280);
    --accent:oklch(0.74 0.148 195); --border:oklch(0.22 0.012 280);
    --ease-expo:cubic-bezier(0.16,1,0.3,1); --pad:clamp(1.25rem,5vw,3rem);
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
    font-family:'Epilogue',system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1080px;margin:0 auto;padding:var(--pad)}
  header{display:flex;align-items:center;gap:.75rem;padding-block:1.5rem 2.5rem;flex-wrap:wrap}
  .chip{font-size:.72rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;
    color:var(--accent);border:1.5px solid var(--accent);border-radius:999px;padding:.4rem .8rem}
  h1{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:clamp(2rem,6vw,3.4rem);
    line-height:1.05;margin:0 0 .5rem;letter-spacing:-.02em}
  .sub{color:var(--ink-muted);margin:0 0 2.5rem;font-size:clamp(1rem,2.4vw,1.15rem)}
  .stage{display:grid;grid-template-columns:minmax(0,340px) minmax(0,1fr);gap:clamp(1.5rem,4vw,3rem);align-items:start}
  @media(max-width:760px){.stage{grid-template-columns:1fr}}
  video{width:100%;aspect-ratio:9/16;border-radius:18px;display:block;background:#000;
    border:1px solid var(--border);box-shadow:0 24px 60px -20px rgb(0 0 0/.8)}
  .panel{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:clamp(1.25rem,3vw,2rem)}
  .panel h2{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:1.35rem;margin:0 0 .75rem}
  .panel p{margin:0 0 1rem;color:var(--ink-muted)}
  .panel p strong{color:var(--ink);font-weight:600}
  .price{display:flex;align-items:baseline;gap:.6rem;margin:1.5rem 0 .35rem;
    font-family:'Bricolage Grotesque',system-ui,sans-serif}
  .price b{font-size:2.4rem;line-height:1;letter-spacing:-.02em}
  .price span{color:var(--ink-muted);font-size:.95rem}
  .cta{display:inline-block;margin-top:1.25rem;background:var(--primary);color:#fff;text-decoration:none;
    font-weight:600;padding:.85rem 1.5rem;border-radius:12px;
    transition:background .2s var(--ease-expo),transform .2s var(--ease-expo)}
  .cta:hover{background:var(--primary-hi);transform:translateY(-2px)}
  .cta:focus-visible{outline:2px solid var(--primary);outline-offset:3px}
  .note{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid var(--border);color:var(--ink-muted);font-size:.88rem}
  footer{padding:3rem 0 2rem;color:var(--ink-muted);font-size:.85rem}
  footer a{color:var(--accent)}
  @media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>
</head>
<body>
<main class="wrap">
  <header>
    <span class="chip">Probefilm</span>
    <span style="color:var(--ink-muted);font-size:.85rem">unverbindlich · nicht veröffentlicht</span>
  </header>

  <h1>${esc(name)}</h1>
  <p class="sub">${esc(location || '')} — aus den Fotos Ihres eigenen Inserats.</p>

  <div class="stage">
    <video controls playsinline preload="metadata" poster="poster.jpg">
      <source src="film.mp4" type="video/mp4">
      Ihr Browser kann dieses Video nicht abspielen.
    </video>

    <div class="panel">
      <h2>Was Sie hier sehen</h2>
      <p>Diesen Film habe ich aus den Bildern gebaut, die ohnehin in Ihrem Inserat stehen —
        <strong>ohne neues Shooting, ohne Anreise</strong>. Kamerafahrten, Licht, Ton.
        Er ist als <strong>Probefilm</strong> gekennzeichnet und nirgends veröffentlicht.</p>
      <p>Gedacht ist er für Instagram und TikTok, als Kopfbereich Ihrer eigenen Seite und
        als Antwort an Gäste, die noch zwischen zwei Häusern schwanken.</p>

      <div class="price"><b>490 €</b><span>einmalig, fertiger Film</span></div>
      <p style="font-size:.92rem">Sie zahlen erst, wenn Sie ihn einsetzen wollen. Gefällt er Ihnen nicht,
        ist die Sache damit erledigt — und der Film wird gelöscht.</p>

      <a class="cta" href="mailto:maxbeeken@beekenwebengineering.com?subject=Probefilm%20${encodeURIComponent(name)}">Antworten</a>
    </div>
  </div>

  <p class="note">Die Bildrechte liegen bei Ihnen. Ich habe die Fotos ausschließlich verwendet, um Ihnen
    diesen Vorschlag zu Ihrem eigenen Objekt zu zeigen. Die Seite ist nicht verlinkt und für
    Suchmaschinen gesperrt. Ein Wort von Ihnen, und Film und Seite sind sofort gelöscht.</p>

  <footer>Beeken Web Engineering · Max Beeken ·
    <a href="https://beekenwebengineering.com">beekenwebengineering.com</a></footer>
</main>
</body>
</html>
`);

console.log(`✓ ${slug} → probefilm/${slug}/`);
