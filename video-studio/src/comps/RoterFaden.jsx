import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, rng} from './Cine.jsx';

// Cinematic: ein roter (teal) Faden führt den Besucher von der Landung bis zur
// Anfrage. Chaos-Seite = verirren. Kernbotschaft: UX / Conversion-Reise.
// 30fps → 60 + 180 + 180 + 75 + 75 = 570 = 19,0 s
const HOOK = 60, LOST = 180, THREAD = 180, GOAL = 75, CTA = 75;

// Wegpunkte des geführten Fadens (Landung → Anfrage).
const WP = [[540, 320], [300, 620], [780, 900], [300, 1180], [780, 1440], [540, 1660]];
const STEPS = [[540, 320, 'ANKOMMEN'], [300, 620, 'VERSTEHEN'], [780, 900, 'VERTRAUEN'], [300, 1180, 'ÜBERZEUGEN'], [780, 1440, 'ANFRAGEN']];

const along = (p) => {
  const seg = Math.min(WP.length - 2, Math.floor(p * (WP.length - 1)));
  const t = p * (WP.length - 1) - seg;
  const a = WP[seg], b = WP[seg + 1];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
};

const ChaosLines = () => {
  const lines = [];
  for (let i = 0; i < 16; i++) {
    const x1 = rng(i) * 1000 + 40, y1 = rng(i * 3 + 1) * 1400 + 300;
    const x2 = rng(i * 5 + 2) * 1000 + 40, y2 = rng(i * 7 + 3) * 1400 + 300;
    lines.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#33313c" strokeWidth="6" strokeLinecap="round" />);
  }
  return <svg viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>{lines}</svg>;
};

const Dot = ({x, y, col = C.gold, r = 18}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: col, boxShadow: `0 0 26px 6px ${col}`, zIndex: 20}} />
);

const Thread = ({p}) => {
  const pts = WP.map((w) => w.join(',')).join(' ');
  return (
    <svg viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <polyline points={pts} fill="none" stroke={C.dim} strokeWidth="6" opacity="0.4" strokeLinejoin="round" />
      <polyline points={pts} fill="none" stroke={C.teal} strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - p} style={{filter: `drop-shadow(0 0 10px ${C.teal})`}} />
    </svg>
  );
};

const Steps = ({p}) => (
  <>
    {STEPS.map((s, i) => {
      const th = (i + 0.5) / WP.length;
      const on = p >= th - 0.02;
      const side = s[0] < 540 ? 1 : -1;
      return (
        <div key={i} style={{position: 'absolute', left: s[0] + side * 40, top: s[1] - 26, transform: side < 0 ? 'translateX(-100%)' : 'none'}}>
          <div style={{padding: '8px 16px', borderRadius: 10, background: on ? 'rgba(10,20,20,0.85)' : 'transparent', border: `2px solid ${on ? C.teal : '#26242f'}`, color: on ? C.ink : C.dim, fontSize: 24, fontWeight: 900, letterSpacing: 1, opacity: on ? 1 : 0.5, boxShadow: on ? `0 0 20px ${C.teal}44` : 'none'}}>{s[2]} {on && i < 4 ? '✓' : ''}</div>
        </div>
      );
    })}
  </>
);

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.teal}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 62px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 25, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 10}}>{kicker}</div>}
    <div style={{fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em', textShadow: '0 2px 16px rgba(0,0,0,0.7)'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  const wx = 540 + Math.sin(f * 0.14) * 320;
  const wy = 1050 + Math.cos(f * 0.19) * 380;
  return (
    <AbsoluteFill>
      <ChaosLines />
      <Dot x={wx} y={wy} col={C.muted} />
      <Caption top={110} main={<>Auf den meisten Seiten<br /><span style={{color: C.red}}>verirren sich</span> Kunden.</>} o={a} ty={(1 - a) * 20} kcol={C.red} />
    </AbsoluteFill>
  );
};

const LostScene = () => {
  const f = useCurrentFrame();
  const wx = 540 + Math.sin(f * 0.13) * 340;
  const wy = 1050 + Math.cos(f * 0.17) * 400;
  const bounce = f > 130 ? interpolate(f, [130, 175], [0, -600], {extrapolateRight: 'clamp'}) : 0;
  const lab = spring({frame: f - 16, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <ChaosLines />
      <Dot x={wx} y={wy + bounce} col={f > 130 ? C.red : C.muted} />
      <Caption top={110} kicker="ZU VIELE WEGE" main={<>Zu viele Wege<br /><span style={{color: C.red}}>= kein Weg.</span></>} o={lab} ty={(1 - lab) * 16} kcol={C.red} />
    </AbsoluteFill>
  );
};

const ThreadScene = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [20, 165], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const [dx, dy] = along(p);
  const lab = spring({frame: f - 8, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Thread p={p} />
      <Steps p={p} />
      <Dot x={dx} y={dy} col={C.gold} />
      <Caption top={110} kicker="EIN ROTER FADEN" main={<>Ein klarer Weg<br /><span style={{color: C.teal}}>führt zum Ziel.</span></>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const GoalScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <Thread p={1} />
      <Steps p={1} />
      <div style={{position: 'absolute', left: 540 - 150, top: 1660 - 46, width: 300, height: 92, borderRadius: 18, background: C.violet, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 34, fontWeight: 900, transform: `scale(${0.8 + a * 0.2})`, boxShadow: `0 0 40px ${C.violet}`}}>ANFRAGE ✓</div>
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, opacity: a, padding: '0 62px'}}>
        <div style={{fontSize: 54, fontWeight: 900, color: C.ink, lineHeight: 1.14}}>Jeder Klick führt näher<br />zum <span style={{color: C.teal}}>Kontakt</span>.</div>
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
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Ein Weg, der führt <span style={{color: C.teal}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 30, fontWeight: 800, color: C.gold, maxWidth: 880, lineHeight: 1.3}}>Findet man bei DIR den Kontakt-Button in 5 Sek? ⏱ ↓</div>
    </AbsoluteFill>
  );
};

export const RoterFaden = () => (
  <AbsoluteFill style={{background: '#0a0810', fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={LOST}><LostScene /></Sequence>
    <Sequence from={HOOK + LOST} durationInFrames={THREAD}><ThreadScene /></Sequence>
    <Sequence from={HOOK + LOST + THREAD} durationInFrames={GOAL}><GoalScene /></Sequence>
    <Sequence from={HOOK + LOST + THREAD + GOAL} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.075} vignette={0.82} gradeProps={{a: 'rgba(52,227,208,0.10)', b: 'rgba(124,92,255,0.09)'}} />
  </AbsoluteFill>
);
