import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

// ── Gemeinsame cinematische Toolkit-Bibliothek ────────────────────────────────
// Alle "cinematic"-Videos (Batch 3) teilen sich diese Bausteine, damit sie EINE
// filmische Sprache sprechen: Korn, Vignette, Farbgrading, Lichtstrahlen,
// Staubpartikel, Kamera-Fahrt (Push-in/Pan). Alles deterministisch (kein
// Math.random / Date.now — würde den Remotion-Render zerbrechen).

export const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
export const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Deterministischer Pseudo-Zufall in [0,1) aus einem Integer-Seed.
export const rng = (i) => {
  const x = Math.sin((i + 1) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// ── Filmkorn ──────────────────────────────────────────────────────────────────
// SVG-feTurbulence wird EINMAL als Data-URI-Hintergrund gerastert (nicht pro
// Frame gefiltert → performant) und pro Frame minimal verschoben = Korn-Flackern.
const GRAIN_SVG = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">' +
  '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>' +
  '<feColorMatrix type="saturate" values="0"/></filter>' +
  '<rect width="100%" height="100%" filter="url(#n)"/></svg>'
);
export const FilmGrain = ({opacity = 0.075}) => {
  const f = useCurrentFrame();
  const x = Math.round(Math.sin(f * 1.3) * 6);
  const y = Math.round(Math.cos(f * 1.1) * 6);
  return (
    <AbsoluteFill style={{
      backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`,
      backgroundRepeat: 'repeat',
      opacity, mixBlendMode: 'overlay', pointerEvents: 'none',
      transform: `translate(${x}px,${y}px)`,
    }} />
  );
};

// ── Vignette ────────────────────────────────────────────────────────────────
export const Vignette = ({strength = 0.72, cx = '50%', cy = '42%'}) => (
  <AbsoluteFill style={{
    background: `radial-gradient(125% 95% at ${cx} ${cy}, transparent 38%, rgba(0,0,0,${strength}) 100%)`,
    pointerEvents: 'none',
  }} />
);

// ── Duotone-Farbgrading (zwei weiche Screen-Wash-Verläufe) ────────────────────
export const Grade = ({
  a = 'rgba(124,92,255,0.16)', b = 'rgba(52,227,208,0.11)',
  ax = '28%', ay = '18%', bx = '76%', by = '92%',
}) => (
  <>
    <AbsoluteFill style={{background: `radial-gradient(85% 65% at ${ax} ${ay}, ${a}, transparent 62%)`, mixBlendMode: 'screen', pointerEvents: 'none'}} />
    <AbsoluteFill style={{background: `radial-gradient(85% 65% at ${bx} ${by}, ${b}, transparent 62%)`, mixBlendMode: 'screen', pointerEvents: 'none'}} />
  </>
);

// ── Cinematische Letterbox-Balken (optional, animierbar) ──────────────────────
export const Letterbox = ({h = 92, color = '#000', p = 1}) => {
  if (h <= 0) return null;
  const off = (1 - p) * h;
  return (
    <>
      <div style={{position: 'absolute', top: -off, left: 0, right: 0, height: h, background: color, zIndex: 70, pointerEvents: 'none'}} />
      <div style={{position: 'absolute', bottom: -off, left: 0, right: 0, height: h, background: color, zIndex: 70, pointerEvents: 'none'}} />
    </>
  );
};

// ── Gottesstrahlen / Lichtkegel aus einem Punkt ───────────────────────────────
export const LightRays = ({
  x = '50%', y = '-8%', color = 'rgba(245,185,69,0.09)', count = 7, spread = 74, drift = 0, blur = 10,
}) => {
  const f = useCurrentFrame();
  const rays = [];
  for (let i = 0; i < count; i++) {
    const base = count > 1 ? -spread / 2 + (spread / (count - 1)) * i : 0;
    const ang = base + Math.sin((f + i * 30) * 0.012) * 2.4 + drift;
    rays.push(
      <div key={i} style={{
        position: 'absolute', left: x, top: y, width: 46, height: '170%',
        transformOrigin: 'top center', transform: `translateX(-50%) rotate(${ang}deg)`,
        background: `linear-gradient(${color}, transparent 68%)`,
        filter: `blur(${blur}px)`,
      }} />
    );
  }
  return <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>{rays}</AbsoluteFill>;
};

// ── Staub- / Bokeh-Partikel, langsam aufsteigend ──────────────────────────────
export const DustMotes = ({count = 24, color = 'rgba(255,255,255,0.55)', rise = 22, maxR = 7}) => {
  const f = useCurrentFrame();
  const {height, width} = useVideoConfig();
  const motes = [];
  for (let i = 0; i < count; i++) {
    const r = rng(i) * (maxR - 2) + 2;
    const sx = rng(i * 3 + 1) * width;
    const drift = f * (0.15 + rng(i * 7) * 0.5);
    const sy = ((rng(i * 5 + 2) * height + drift * rise) % (height + 60)) - 30;
    const tw = 0.28 + 0.72 * Math.abs(Math.sin((f + i * 20) * 0.03));
    motes.push(
      <div key={i} style={{
        position: 'absolute', left: sx, top: height - sy, width: r, height: r,
        borderRadius: '50%', background: color, opacity: tw * 0.5, filter: 'blur(1.2px)',
      }} />
    );
  }
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{motes}</AbsoluteFill>;
};

// ── Kamera-Fahrt: langsamer Push-in + optionaler Pan (Ken-Burns) ──────────────
// Umschließt den Szenen-Inhalt; NICHT die Overlays (Korn/Vignette bleiben fix).
export const CameraRig = ({children, push = 0.08, panX = 0, panY = 0, from = 0, dur, origin = '50% 50%'}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const D = dur || durationInFrames;
  const p = interpolate(f, [from, from + D], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{transform: `scale(${1 + push * p}) translate(${panX * p}px,${panY * p}px)`, transformOrigin: origin}}>
      {children}
    </AbsoluteFill>
  );
};

// ── Ein-Zeilen-Atmosphäre: Grade + (Strahlen) + (Partikel) + Vignette + Korn ──
// IMMER als letztes/oberstes Element der Composition rendern (liegt über allem).
export const Atmosphere = ({grain = 0.075, vignette = 0.72, motes = 0, rays = null, grade = true, gradeProps = {}, letterbox = 0, letterboxP = 1}) => (
  <>
    {grade && <Grade {...gradeProps} />}
    {rays && <LightRays {...rays} />}
    {motes > 0 && <DustMotes count={motes} />}
    <Vignette strength={vignette} />
    <FilmGrain opacity={grain} />
    {letterbox > 0 && <Letterbox h={letterbox} p={letterboxP} />}
  </>
);
