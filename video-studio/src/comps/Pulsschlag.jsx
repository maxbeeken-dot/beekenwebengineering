import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere} from './Cine.jsx';

// Cinematic: Deine Website am Herzmonitor. Langsam = Puls bricht ein = Flatline.
// Defibrillator bringt sie zurück (Speed). Kernbotschaft: Ladezeit = Umsatz.
// 30fps → 75 + 180 + 105 + 165 + 75 = 600 = 20,0 s
const HOOK = 75, SLOW = 180, FLAT = 105, REVIVE = 165, CTA = 75;

const CENTER = 940; // vertikale Mitte des Monitors

// EKG-Wellenform-Wert an x (SVG-y, negativ = hoch).
const ekgY = (x, cw, amp) => {
  const p = ((x % cw) + cw) % cw / cw;
  if (p > 0.30 && p < 0.34) return -amp * 0.16;
  if (p >= 0.40 && p < 0.435) return amp * 0.28;
  if (p >= 0.435 && p < 0.47) return -amp;
  if (p >= 0.47 && p < 0.50) return amp * 0.42;
  if (p > 0.58 && p < 0.66) return -amp * 0.20;
  return 0;
};

const Waveform = ({f, speed, cw, amp, color, flat = false}) => {
  const scroll = f * speed;
  const pts = [];
  for (let x = 0; x <= 1080; x += 4) {
    const y = flat ? Math.sin((x + scroll) * 0.5) * 1.2 : ekgY(x + scroll, cw, amp);
    pts.push(`${x},${(220 + y).toFixed(1)}`);
  }
  // Scan-Kopf: heller Punkt, wo die Linie „geschrieben" wird (rechts)
  const headX = 1040;
  const headY = 220 + (flat ? 0 : ekgY(headX + scroll, cw, amp));
  return (
    <svg viewBox="0 0 1080 440" style={{position: 'absolute', left: 0, top: CENTER - 220, width: 1080, height: 440}}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" style={{filter: `drop-shadow(0 0 10px ${color})`}} />
      <circle cx={headX} cy={headY} r="10" fill="#fff" style={{filter: `drop-shadow(0 0 14px ${color})`}} />
    </svg>
  );
};

const MonitorGrid = () => (
  <AbsoluteFill style={{opacity: 0.16}}>
    <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#1c3a36 1px,transparent 1px),linear-gradient(90deg,#1c3a36 1px,transparent 1px)', backgroundSize: '54px 54px'}} />
  </AbsoluteFill>
);

const Readout = ({top, label, value, col = C.teal, o = 1}) => (
  <div style={{position: 'absolute', top, left: 60, opacity: o}}>
    <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.muted}}>{label}</div>
    <div style={{fontSize: 62, fontWeight: 900, color: col, fontVariantNumeric: 'tabular-nums', lineHeight: 1, textShadow: `0 0 22px ${col}66`}}>{value}</div>
  </div>
);

const Caption = ({top, main, o = 1, ty = 0}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 66px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    <div style={{fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <MonitorGrid />
      <Waveform f={f} speed={9} cw={300} amp={150} color={C.green} />
      <Readout top={520} label="STATUS" value="LIVE" col={C.green} o={a} />
      <Caption top={330} main={<>Das ist deine Website.<br /><span style={{color: C.green}}>Im Livebetrieb.</span></>} o={a} ty={(1 - a) * 22} />
    </AbsoluteFill>
  );
};

const SlowScene = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 170], [0, 1], {extrapolateRight: 'clamp'});
  const speed = 9 - t * 7;          // Puls wird langsamer
  const amp = 150 - t * 90;         // schwächer
  const col = interpolate(t, [0, 1], [0, 1]) > 0.5 ? C.gold : C.green;
  const load = (0.9 + t * 5.5).toFixed(1).replace('.', ',');
  const bounce = Math.round(32 + t * 26);
  const lab = spring({frame: f - 12, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <MonitorGrid />
      <Waveform f={f} speed={speed} cw={300 + t * 240} amp={amp} color={t > 0.5 ? C.gold : C.green} />
      <Readout top={470} label="LADEZEIT" value={load + 's'} col={t > 0.6 ? C.red : C.gold} />
      <Readout top={1280} label="ABSPRUNG" value={bounce + '%'} col={C.red} o={interpolate(f, [30, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      <Caption top={300} main={<>Jede Sekunde Ladezeit<br /><span style={{color: C.gold}}>drückt den Puls.</span></>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const FlatScene = () => {
  const f = useCurrentFrame();
  const alarm = Math.floor(f / 8) % 2 === 0;
  const shake = f < 30 ? Math.sin(f * 1.8) * (30 - f) * 0.4 : 0;
  const a = spring({frame: f - 6, fps: 30, config: {damping: 13}});
  return (
    <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
      <AbsoluteFill style={{background: `radial-gradient(80% 60% at 50% 50%, ${C.red}${alarm ? '22' : '11'}, transparent 70%)`}} />
      <MonitorGrid />
      <Waveform f={f} speed={9} cw={300} amp={0} color={C.red} flat />
      <Readout top={470} label="LADEZEIT" value="6,4s" col={C.red} />
      <Readout top={1280} label="STATUS" value={alarm ? 'FLATLINE' : ''} col={C.red} />
      <Caption top={300} main={<>Zu langsam?<br /><span style={{color: C.red}}>Kunde weg. Klinisch tot.</span></>} o={a} ty={(1 - a) * 16} />
    </AbsoluteFill>
  );
};

const ReviveScene = () => {
  const f = useCurrentFrame();
  const jolt = f > 24 && f < 30;
  const alive = f >= 30;
  const flash = jolt ? 1 : 0;
  const a = spring({frame: f - 36, fps: 30, config: {damping: 15}});
  const load = alive ? '0,8s' : '6,4s';
  return (
    <AbsoluteFill>
      {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: 0.85}} />}
      <MonitorGrid />
      {f < 24 && <div style={{position: 'absolute', top: 780, left: 0, right: 0, textAlign: 'center', fontSize: 60, fontWeight: 900, letterSpacing: 8, color: C.gold}}>CLEAR ⚡</div>}
      {alive && <Waveform f={f - 30} speed={10.5} cw={260} amp={165} color={C.teal} />}
      {alive && <Readout top={470} label="LADEZEIT" value={load} col={C.teal} o={a} />}
      {alive && <Readout top={1280} label="STATUS" value="STABIL" col={C.green} o={a} />}
      {alive && <Caption top={300} main={<>Wir bringen sie zurück<br /><span style={{color: C.teal}}>ins Leben.</span></>} o={a} ty={(1 - a) * 16} />}
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
      <MonitorGrid />
      <Waveform f={f} speed={10.5} cw={260} amp={70} color={C.teal} />
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Bring deine Seite auf Tempo <span style={{color: C.teal}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 840, lineHeight: 1.3}}>Wie schnell lädt DEINE Seite? Rate in Sekunden ↓</div>
    </AbsoluteFill>
  );
};

export const Pulsschlag = () => (
  <AbsoluteFill style={{background: '#050908', fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={SLOW}><SlowScene /></Sequence>
    <Sequence from={HOOK + SLOW} durationInFrames={FLAT}><FlatScene /></Sequence>
    <Sequence from={HOOK + SLOW + FLAT} durationInFrames={REVIVE}><ReviveScene /></Sequence>
    <Sequence from={HOOK + SLOW + FLAT + REVIVE} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.07} vignette={0.78} gradeProps={{a: 'rgba(52,227,208,0.10)', b: 'rgba(61,220,132,0.08)'}} />
  </AbsoluteFill>
);
