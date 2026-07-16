import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, rng} from './Cine.jsx';

// Cinematic: Sanduhr. Beim langsamen Laden rinnt jeder Sand = Kunde weg. Umgedreht
// & schnell = sie bleiben. Kernbotschaft: Speed / verlorene Kunden.
// 30fps → 60 + 180 + 180 + 75 + 75 = 570 = 19,0 s
const HOOK = 60, DRAIN = 180, FLIP = 180, LINE = 75, CTA = 75;

const CX = 540, TOP = 600, NECK = 960, BOT = 1320, HALF = 200;

const wTop = (y) => (HALF * 2) * (NECK - y) / (NECK - TOP); // Breite oberes Dreieck
const wBot = (y) => (HALF * 2) * (y - NECK) / (BOT - NECK); // Breite unteres Dreieck

// SVG-Sanduhr. fill ∈ [0,1] Sand oben. rot = Rotation (Flip).
const Hourglass = ({fill, f, rot = 0, col = C.gold}) => {
  const topLevel = TOP + (1 - fill) * (NECK - TOP);
  const wT = wTop(topLevel);
  const botLevel = BOT - (1 - fill) * (BOT - NECK);
  const wB = wBot(botLevel);
  // fallender Strom
  const dashes = [];
  for (let i = 0; i < 8; i++) {
    const y = NECK + ((f * 12 + i * 30) % (botLevel - NECK));
    dashes.push(<circle key={i} cx={CX} cy={y} r="4" fill={col} opacity="0.9" />);
  }
  return (
    <svg viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, transform: `rotate(${rot}deg)`, transformOrigin: '540px 960px'}}>
      {/* Rahmen */}
      <line x1={300} y1={TOP - 24} x2={780} y2={TOP - 24} stroke="#3a3946" strokeWidth="16" strokeLinecap="round" />
      <line x1={300} y1={BOT + 24} x2={780} y2={BOT + 24} stroke="#3a3946" strokeWidth="16" strokeLinecap="round" />
      {/* Glas */}
      <polygon points={`${CX - HALF},${TOP} ${CX + HALF},${TOP} ${CX},${NECK}`} fill="rgba(120,140,160,0.06)" stroke="#4a5566" strokeWidth="4" />
      <polygon points={`${CX},${NECK} ${CX + HALF},${BOT} ${CX - HALF},${BOT}`} fill="rgba(120,140,160,0.06)" stroke="#4a5566" strokeWidth="4" />
      {/* Sand oben */}
      {fill > 0.01 && <polygon points={`${CX - wT / 2},${topLevel} ${CX + wT / 2},${topLevel} ${CX},${NECK}`} fill={col} opacity="0.92" />}
      {/* Sandstrom */}
      {fill > 0.02 && fill < 0.99 && dashes}
      {/* Sand unten */}
      {fill < 0.99 && <polygon points={`${CX - wB / 2},${botLevel} ${CX + wB / 2},${botLevel} ${CX + HALF},${BOT} ${CX - HALF},${BOT}`} fill={col} opacity="0.92" />}
    </svg>
  );
};

// Kunden-Körnchen: fallen aus dem Hals. kept → landen & leuchten, sonst → verblassen.
const Grains = ({f, kept}) => {
  const g = [];
  for (let i = 0; i < 12; i++) {
    const cyc = ((f + i * 14) % 90) / 90;
    const x = CX + (rng(i) - 0.5) * 180;
    const y = NECK + cyc * 520;
    const op = kept ? Math.min(1, cyc * 3) : Math.max(0, 1 - cyc * 1.3);
    const col = kept ? C.teal : C.gold;
    g.push(<div key={i} style={{position: 'absolute', left: x, top: y, width: 20, height: 20, borderRadius: '50%', background: col, boxShadow: `0 0 14px 3px ${col}`, opacity: op, fontSize: 12}}>{''}</div>);
  }
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{g}</AbsoluteFill>;
};

const Counter = ({top, label, value, col}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center'}}>
    <div style={{fontSize: 24, fontWeight: 800, letterSpacing: 4, color: C.muted}}>{label}</div>
    <div style={{fontSize: 96, fontWeight: 900, color: col, fontVariantNumeric: 'tabular-nums', lineHeight: 1, textShadow: `0 0 26px ${col}55`}}>{value}</div>
  </div>
);

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.teal}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 62px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 25, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 10}}>{kicker}</div>}
    <div style={{fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CX - 360, top: 500, width: 720, height: 920, background: `radial-gradient(closest-side, ${C.gold}18, transparent 70%)`}} />
      <Hourglass fill={0.72} f={f} />
      <Caption top={200} main={<>Jede Sekunde Ladezeit<br /><span style={{color: C.gold}}>kostet dich Kunden.</span></>} o={a} ty={(1 - a) * 20} kcol={C.gold} />
    </AbsoluteFill>
  );
};

const DrainScene = () => {
  const f = useCurrentFrame();
  const fill = interpolate(f, [0, 175], [0.72, 0.14], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lost = Math.round(interpolate(f, [0, 175], [0, 53], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const lab = spring({frame: f - 16, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Hourglass fill={fill} f={f} col={C.gold} />
      <Grains f={f} kept={false} />
      <Counter top={1460} label="VERLORENE KUNDEN" value={lost + '%'} col={C.red} />
      <Caption top={150} kicker="7 SEKUNDEN LADEN" main={<>Jedes Korn ist<br /><span style={{color: C.red}}>ein Kunde, der geht.</span></>} o={lab} ty={(1 - lab) * 16} kcol={C.red} />
    </AbsoluteFill>
  );
};

const FlipScene = () => {
  const f = useCurrentFrame();
  const rot = interpolate(f, [0, 26], [0, 180], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fill = f < 30 ? 0.86 : interpolate(f, [30, 150], [0.86, 0.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const kept = Math.round(interpolate(f, [30, 150], [0, 48], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const lab = spring({frame: f - 34, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Hourglass fill={fill} f={f * 2} rot={rot} col={C.teal} />
      {f > 30 && <Grains f={f} kept />}
      {f > 30 && <Counter top={1460} label="GEHALTEN" value={kept + '%'} col={C.teal} />}
      <Caption top={150} kicker="0,8 SEKUNDEN" main={<>Schnell geladen?<br /><span style={{color: C.teal}}>Sie bleiben.</span></>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const LineScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <div style={{opacity: a, transform: `scale(${0.92 + a * 0.08})`}}>
        <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 4, color: C.gold, marginBottom: 16}}>TEMPO IST KEIN DETAIL</div>
        <div style={{fontSize: 62, fontWeight: 900, color: C.ink, lineHeight: 1.14}}>Es ist <span style={{color: C.teal}}>Umsatz</span>.</div>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 14, fps: 30, config: {damping: 15}});
  const bait = spring({frame: f - 26, fps: 30, config: {damping: 16}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 20}}>
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Keine Sekunde verlieren <span style={{color: C.teal}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 860, lineHeight: 1.3}}>Wie lange wartest DU auf eine Seite? Sekunden ↓</div>
    </AbsoluteFill>
  );
};

export const Sanduhr = () => (
  <AbsoluteFill style={{background: '#0a0806', fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={DRAIN}><DrainScene /></Sequence>
    <Sequence from={HOOK + DRAIN} durationInFrames={FLIP}><FlipScene /></Sequence>
    <Sequence from={HOOK + DRAIN + FLIP} durationInFrames={LINE}><LineScene /></Sequence>
    <Sequence from={HOOK + DRAIN + FLIP + LINE} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.075} vignette={0.82} gradeProps={{a: 'rgba(245,185,69,0.10)', b: 'rgba(52,227,208,0.09)'}} />
  </AbsoluteFill>
);
