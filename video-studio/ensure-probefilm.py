"""
Stellt sicher, dass Root.jsx die Probefilm-Compositions kennt und render.mjs die
inputProps durchreicht.

Warum das nötig ist: Beide Dateien wurden auf diesem Rechner mehrfach extern auf einen
älteren Stand zurückgesetzt. Der Ausfall ist STILL — der Render nimmt dann die
defaultProps, und es entsteht der Film eines anderen Objekts (einmal passiert: Montblau
bekam den Film von Chalet Astra). Deshalb: vor JEDEM Render einmal laufen lassen.

Aufruf: python3 ensure-probefilm.py
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))

# ---- Root.jsx: Compositions registrieren -----------------------------------
root = os.path.join(HERE, "src", "Root.jsx")
s = open(root, encoding="utf-8").read()
changed = False

if "ProbefilmAI" not in s:
    s = s.replace(
        "import {Composition} from 'remotion';",
        "import {Composition} from 'remotion';\n"
        "import {Probefilm} from './comps/Probefilm.jsx';\n"
        "import {ProbefilmAI} from './comps/ProbefilmAI.jsx';",
        1,
    )
    changed = True

if 'id="Probefilm"' not in s:
    entry = (
        '      <Composition id="Probefilm" component={Probefilm} durationInFrames={700} fps={30}\n'
        "        width={1080} height={1920} defaultProps={{slug:'',name:'',location:'',photos:[]}} />\n"
        '      <Composition id="ProbefilmAI" component={ProbefilmAI} durationInFrames={740} fps={30}\n'
        "        width={1080} height={1920} defaultProps={{slug:'',name:'',location:'',clips:[]}} />\n"
    )
    i = s.index("      <Composition")
    s = s[:i] + entry + s[i:]
    changed = True

if changed:
    open(root, "w", encoding="utf-8").write(s)

# ---- render.mjs: inputProps durchreichen ------------------------------------
rend = os.path.join(HERE, "render.mjs")
r = open(rend, encoding="utf-8").read()
before = r

if "const inputProps" not in r:
    r = r.replace(
        "const log = (m) =>",
        "// Objektdaten als JSON-Argument. Ohne das rendert Remotion still die defaultProps.\n"
        "const inputProps = process.argv[4] ? JSON.parse(process.argv[4]) : {};\n"
        "const log = (m) =>",
        1,
    )

r = r.replace(
    "selectComposition({serveUrl, id: compId, browserExecutable})",
    "selectComposition({serveUrl, id: compId, browserExecutable, inputProps})",
)
if "kamen nicht an" not in r:
    r = r.replace(
        "log(`Render ${composition.width}",
        "if (inputProps.slug && composition.props?.slug !== inputProps.slug) {\n"
        "  throw new Error(`inputProps kamen nicht an (slug=${composition.props?.slug}) — abgebrochen`);\n"
        "}\n"
        "log(`Render ${composition.width}",
        1,
    )
if re.search(r"outputLocation: out, browserExecutable,(?!\s*inputProps)", r):
    r = r.replace(
        "outputLocation: out, browserExecutable,",
        "outputLocation: out, browserExecutable, inputProps,",
    )

if r != before:
    open(rend, "w", encoding="utf-8").write(r)

# ---- make-probefilm-page.mjs: Pakete + Überleitung --------------------------
# Auch dieser Generator wurde zurückgesetzt und hat einmal eine Seite mit dem alten
# 490-€-Preis veröffentlicht. Deshalb hier mitgeprüft.
gen = os.path.join(HERE, "make-probefilm-page.mjs")
g = open(gen, encoding="utf-8").read()
g_before = g

g = g.replace(
    """// ~19 MB roh sind für eine Webseite zu schwer; crf 26 landet bei ~4 MB ohne sichtbaren Verlust.
execFileSync(FF, ['-y', '-loglevel', 'error', '-i', mp4,""",
    """// mp4 = "-" schreibt nur die HTML-Seite neu, ohne das Video erneut zu encoden.
if (mp4 !== '-') {
execFileSync(FF, ['-y', '-loglevel', 'error', '-i', mp4,""",
)
g = g.replace(
    "  '-ss', '1.6', '-frames:v', '1', '-q:v', '4', path.join(dir, 'poster.jpg')]);",
    "  '-ss', '1.6', '-frames:v', '1', '-q:v', '4', path.join(dir, 'poster.jpg')]);\n}",
)

g = g.replace(
    """  .price{display:flex;align-items:baseline;gap:.6rem;margin:1.5rem 0 .35rem;
    font-family:'Bricolage Grotesque',system-ui,sans-serif}
  .price b{font-size:2.4rem;line-height:1;letter-spacing:-.02em}
  .price span{color:var(--ink-muted);font-size:.95rem}""",
    """  .pakete{list-style:none;margin:1.5rem 0 .5rem;padding:0;display:grid;gap:.75rem}
  .pakete li{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;
    padding:.85rem 1rem;border:1px solid var(--border);border-radius:12px;background:rgb(255 255 255/.02)}
  .pakete .was{color:var(--ink);font-weight:600}
  .pakete .was small{display:block;color:var(--ink-muted);font-weight:400;font-size:.85rem;margin-top:.15rem}
  .pakete .preis{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:1.5rem;
    font-weight:700;letter-spacing:-.02em;white-space:nowrap}
  .weiter{margin-top:1.75rem;padding-top:1.5rem;border-top:1px solid var(--border)}
  .weiter h3{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:1.1rem;margin:0 0 .6rem;color:var(--ink)}
  .weiter p{margin:0 0 .85rem;color:var(--ink-muted);font-size:.95rem}""",
)

g = g.replace(
    """      <div class="price"><b>490 €</b><span>einmalig, fertiger Film</span></div>
      <p style="font-size:.92rem">Sie zahlen erst, wenn Sie ihn einsetzen wollen. Gefällt er Ihnen nicht,
        ist die Sache damit erledigt — und der Film wird gelöscht.</p>

      <a class="cta" href="mailto:maxbeeken@beekenwebengineering.com?subject=Probefilm%20${encodeURIComponent(name)}">Antworten</a>""",
    """      <ul class="pakete">
        <li><span class="was">Kurzfilm für Social Media<small>ca. 20 Sekunden, hochkant für Reels und TikTok</small></span><span class="preis">125&nbsp;€</span></li>
        <li><span class="was">Ganze Raumtour<small>Rundgang durchs Haus, für Website und Anfragen</small></span><span class="preis">300&nbsp;€</span></li>
      </ul>
      <p style="font-size:.92rem">Einmalig, kein Abo. Sie zahlen erst, wenn Sie den Film einsetzen wollen —
        gefällt er Ihnen nicht, ist die Sache damit erledigt und der Film wird gelöscht.</p>
      <p style="font-size:.92rem">Es geht auch ausführlicher: <strong>längere Touren</strong> über mehrere
        Räume, Aussenanlagen und Jahreszeiten — oder mehrere Objekte in einer Reihe. Was sinnvoll ist,
        hängt vom Haus ab; das bespreche ich gerne mit Ihnen.</p>

      <div class="weiter">
        <h3>Wie es weitergeht</h3>
        <p>Das hier ist ein erster Durchgang aus dem, was Ihr Inserat hergibt — noch nicht das
          fertige Ergebnis. Schreiben Sie mir, was Ihnen auffällt: eine Reihenfolge, die nicht
          stimmt, ein Tempo, das zu schnell ist, ein Raum, der fehlt.</p>
        <p>Daraus wird dann ein Film, der zu Ihrem Haus passt — Bildauswahl, Schnitt und Musik
          abgestimmt, auf Wunsch mit Aufnahmen, die gar nicht im Inserat stehen. Erst wenn das
          Ergebnis für Sie überzeugend ist, wird daraus ein Auftrag.</p>
        <a class="cta" href="mailto:maxbeeken@beekenwebengineering.com?subject=Probefilm%20${encodeURIComponent(name)}">Antworten</a>
      </div>""",
)

if g != g_before:
    open(gen, "w", encoding="utf-8").write(g)

print(
    "ensure: Root.jsx %s | render.mjs %s | Generator %s"
    % (
        "ergänzt" if changed else "ok",
        "ergänzt" if r != before else "ok",
        "ergänzt" if g != g_before else "ok",
    )
)
