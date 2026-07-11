import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Szenen (30 fps) → 570 = 19,0 s
const SETUP = 60, SUCHE = 120, FREEZE = 60, REVEAL = 180, POINTE = 60, CTA = 90;

const GREY = '#2c2b37';
const GREY2 = '#3a3947';

// Geteiltes Website-Wireframe (feste Koordinaten → Marker landen exakt)
const Wire = ({f, building, children}) => {
  const rev = (delay) => building ? spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}}) : 1;
  const el = (r) => ({opacity: r, transform: `translateY(${(1 - r) * 18}px)`});
  const spin = f * 6;
  return (
    <div style={{
      position: 'relative', width: 660, height: 780, background: C.card,
      border: `2px solid ${C.border}`, borderRadius: 22, overflow: 'visible',
      boxShadow: '0 30px 90px rgba(0,0,0,0.55)',
    }}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 40, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 18}}>
        {[C.red, C.gold, C.green].map((c, i) => <div key={i} style={{width: 12, height: 12, borderRadius: 12, background: c, opacity: 0.7}} />)}
      </div>
      <div style={{position: 'absolute', left: 32, top: 60, width: 48, height: 48, borderRadius: 12, background: GREY2, ...el(rev(0))}} />
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', top: 78, left: 400 + i * 78, width: 58, height: 12, borderRadius: 6, background: GREY, ...el(rev(2 + i))}} />)}
      <div style={{position: 'absolute', left: 32, top: 132, width: 596, height: 260, borderRadius: 16, background: GREY, ...el(rev(6))}} />
      <div style={{position: 'absolute', left: 330 - 28, top: 262 - 28, width: 56, height: 56, ...el(rev(9))}}>
        <div style={{width: 56, height: 56, borderRadius: 56, border: `5px solid ${GREY2}`, borderTopColor: C.muted, transform: `rotate(${spin}deg)`}} />
      </div>
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 32, top: 420 + i * 26, width: [520, 470, 360][i], height: 12, borderRadius: 6, background: GREY, ...el(rev(11 + i))}} />)}
      <div style={{position: 'absolute', left: 430, top: 428, width: 196, height: 156, borderRadius: 14, background: GREY, ...el(rev(12))}} />
      <div style={{position: 'absolute', left: 32, top: 506, width: 84, height: 32, borderRadius: 8, background: GREY2, ...el(rev(14))}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 44, background: GREY, borderRadius: '0 0 20px 20px', ...el(rev(15))}} />
      {children}
    </div>
  );
};

// Countdown-Ring 5→1 (SVG stroke-dashoffset)
const Countdown = ({f, dur}) => {
  const frac = interpolate(f, [0, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const num = Math.max(1, Math.ceil(interpolate(f, [0, dur], [5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
  const r = 46, circ = 2 * Math.PI * r;
  return (
    <div style={{position: 'absolute', top: 66, right: 66, width: 116, height: 116}}>
      <svg width={116} height={116}>
        <circle cx={58} cy={58} r={r} stroke={C.border} strokeWidth={8} fill="none" />
        <circle cx={58} cy={58} r={r} stroke={C.teal} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - frac)} transform="rotate(-90 58 58)" />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46, fontWeight: 900, color: frac < 0.35 ? C.red : C.ink, fontVariantNumeric: 'tabular-nums'}}>{num}</div>
    </div>
  );
};

// Roter Fehler-Marker (Kreis + nummeriertes Label), popt per spring
const Marker = ({f, at, n, cx, cy, side, label}) => {
  const s = spring({frame: f - at, fps: 30, config: {damping: 11, mass: 0.6}});
  if (s <= 0.001) return null;
  const pop = spring({frame: f - at, fps: 30, config: {damping: 7, mass: 0.5}});
  const ring = 46;
  const anchor = side === 'r' ? {left: cx + 32} : {right: (660 - cx) + 32};
  const slide = side === 'r' ? (1 - s) * -14 : (1 - s) * 14;
  return (
    <>
      <div style={{position: 'absolute', left: cx - ring / 2, top: cy - ring / 2, width: ring, height: ring, borderRadius: ring, border: `3px solid ${C.red}`, background: 'rgba(255,84,104,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.4 + pop * 0.6})`, opacity: s, boxShadow: `0 0 22px ${C.red}66`}}>
        <span style={{fontSize: 23, fontWeight: 900, color: C.red}}>{n}</span>
      </div>
      <div style={{position: 'absolute', top: cy - 21, ...anchor, opacity: s, transform: `translateX(${slide}px)`, background: C.cardHi, border: `2px solid ${C.red}66`, borderRadius: 12, padding: '8px 14px', whiteSpace: 'nowrap', fontSize: 22, fontWeight: 800, color: C.ink, display: 'flex', gap: 9, alignItems: 'center'}}>
        <span style={{color: C.red, fontWeight: 900}}>{n}</span>{label}
      </div>
    </>
  );
};

const MARKERS = [
  {n: '1', cx: 74, cy: 522, side: 'r', label: 'Button zu klein fürs Handy'},
  {n: '2', cx: 558, cy: 84, side: 'l', label: 'Keine Telefonnummer'},
  {n: '3', cx: 330, cy: 262, side: 'r', label: '8 Sek. Ladezeit'},
  {n: '4', cx: 590, cy: 460, side: 'l', label: 'Nicht fürs Handy gebaut'},
  {n: '5', cx: 330, cy: 736, side: 'r', label: 'Kein Impressum (abmahnbar)'},
];

// 1 — SETUP: Wireframe baut sich auf
const SetupScene = () => {
  const f = useCurrentFrame();
  const h = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 70}}>
      <div style={{height: 230, display: 'flex', alignItems: 'center', textAlign: 'center', padding: '0 56px'}}>
        <div style={{fontSize: 52, fontWeight: 900, color: C.ink, opacity: h, transform: `translateY(${(1 - h) * -20}px)`, lineHeight: 1.16}}>
          Auf dieser Seite verstecken sich<br /><span style={{color: C.red}}>5 Kunden-Killer.</span> 🔍
        </div>
      </div>
      <Wire f={f} building={true} />
    </AbsoluteFill>
  );
};

// 2 — SUCHE: Countdown + wandernder Such-Cursor
const SucheScene = () => {
  const f = useCurrentFrame();
  const t = spring({frame: f, fps: 30, config: {damping: 14}});
  const cx = 330 + Math.sin(f * 0.09) * 232;
  const cy = 300 + Math.cos(f * 0.07) * 194;
  const ping = 0.55 + Math.sin(f * 0.3) * 0.35;
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 70}}>
      <div style={{height: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 56px', gap: 12}}>
        <div style={{fontSize: 48, fontWeight: 900, color: C.ink, opacity: t}}>Du hast <span style={{color: C.teal}}>5 Sekunden.</span></div>
        <div style={{fontSize: 34, fontWeight: 800, color: C.muted, opacity: t}}>Zähl mit. 🔍</div>
      </div>
      <Wire f={f} building={false}>
        <div style={{position: 'absolute', left: cx - 22, top: cy - 22, width: 44, height: 44, borderRadius: 44, border: `2px solid ${C.teal}`, opacity: ping, transform: `scale(${0.7 + ping * 0.5})`}} />
        <div style={{position: 'absolute', left: cx - 7, top: cy - 7, width: 14, height: 14, borderRadius: 14, background: C.teal, boxShadow: `0 0 16px ${C.teal}`}} />
      </Wire>
      <Countdown f={f} dur={SUCHE} />
    </AbsoluteFill>
  );
};

// 3 — FREEZE: eingefroren, kurzer Blitz
const FreezeScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 12, mass: 0.5}});
  const flash = interpolate(f, [0, 5, 14], [0.5, 0.14, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 70}}>
      <div style={{height: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 56px', gap: 10}}>
        <div style={{fontSize: 40, fontWeight: 900, color: C.red, opacity: a, transform: `scale(${0.9 + a * 0.1})`, letterSpacing: 3}}>ZEIT UM!</div>
        <div style={{fontSize: 46, fontWeight: 900, color: C.ink, opacity: a}}>Wie viele hast du?</div>
      </div>
      <Wire f={0} building={false} />
      <AbsoluteFill style={{background: `rgba(255,255,255,${flash})`, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

// 4 — AUFDECKEN: Marker ploppen nacheinander
const RevealScene = () => {
  const f = useCurrentFrame();
  const h = spring({frame: f, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 70}}>
      <div style={{height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 56px'}}>
        <div style={{fontSize: 48, fontWeight: 900, color: C.ink, opacity: h}}>
          Hier sind sie 👇 <span style={{color: C.red}}>alle 5.</span>
        </div>
      </div>
      <Wire f={f + 300} building={false}>
        {MARKERS.map((m, i) => <Marker key={i} f={f} at={12 + i * 30} {...m} />)}
      </Wire>
    </AbsoluteFill>
  );
};

// 5 — POINTE
const PointeScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.6}});
  const b = spring({frame: f - 18, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, gap: 20}}>
      <div style={{fontSize: 56, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.9 + a * 0.1})`, lineHeight: 1.16, maxWidth: 900}}>
        Deine Kunden finden sie in <span style={{color: C.teal}}>2 Sekunden</span> —
      </div>
      <div style={{fontSize: 58, fontWeight: 900, color: C.red, opacity: b, transform: `translateY(${(1 - b) * 22}px)`}}>und klicken weg.</div>
    </AbsoluteFill>
  );
};

// 6 — CTA
const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 24, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 18}}>
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -18}px)`, fontSize: 32, fontWeight: 800, color: C.gold, maxWidth: 880, lineHeight: 1.3}}>
        Wie viele hast du gefunden?<br />
        <span style={{fontSize: 26, color: C.muted}}>Schreib deine Zahl 👇 (5 = Adlerauge)</span>
      </div>
      <div style={{opacity: line, transform: `scale(${0.9 + line * 0.1})`, marginTop: 12}}>
        <div style={{fontSize: 26, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 50, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 8}}>
          Wir finden die Fehler —<br /><span style={{color: C.teal}}>bevor Kunden es tun.</span>
        </div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`, marginTop: 22}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FehlerSuchbild = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(760px 760px at 540px 560px, rgba(124,92,255,0.10), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={SETUP}><SetupScene /></Sequence>
      <Sequence from={SETUP} durationInFrames={SUCHE}><SucheScene /></Sequence>
      <Sequence from={SETUP + SUCHE} durationInFrames={FREEZE}><FreezeScene /></Sequence>
      <Sequence from={SETUP + SUCHE + FREEZE} durationInFrames={REVEAL}><RevealScene /></Sequence>
      <Sequence from={SETUP + SUCHE + FREEZE + REVEAL} durationInFrames={POINTE}><PointeScene /></Sequence>
      <Sequence from={SETUP + SUCHE + FREEZE + REVEAL + POINTE} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
