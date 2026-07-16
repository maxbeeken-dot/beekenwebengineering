import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, rng} from './Cine.jsx';

// Cinematic: Radio-Rauschen → klare Frequenz. Zwischen 100 Anbietern ist deine
// Website dein klares Signal. Kernbotschaft: aus der Masse herausstechen / gefunden.
// 30fps → 75 + 180 + 195 + 75 + 75 = 600 = 20,0 s
const HOOK = 75, SCAN = 180, LOCK = 195, LINE = 75, CTA = 75;

const STATIC_SVG = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><filter id="s">' +
  '<feTurbulence type="turbulence" baseFrequency="0.42" numOctaves="2" stitchTiles="stitch"/>' +
  '<feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#s)"/></svg>'
);

// Retro-Screen. lock ∈ [0,1]: 0 = Rauschen/Chaos, 1 = klares Signal.
const Screen = ({f, lock}) => {
  const noiseOp = (1 - lock) * 0.9;
  const roll = (f * 26) % 720;
  // klare Sinuswelle
  const pts = [];
  for (let x = 0; x <= 760; x += 6) {
    const jitter = (1 - lock) * (rng(Math.floor(x / 6) + Math.floor(f / 2) * 7) - 0.5) * 90;
    const y = 190 + Math.sin(x * 0.03 + f * 0.14) * 70 * (0.4 + lock * 0.6) + jitter;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  // konkurrierende Chaos-Linien
  const chaos = [];
  for (let c = 0; c < 4; c++) {
    const cp = [];
    for (let x = 0; x <= 760; x += 10) {
      const y = 190 + Math.sin(x * (0.02 + c * 0.015) + f * (0.2 + c * 0.1) + c) * (60 - c * 8);
      cp.push(`${x},${y.toFixed(1)}`);
    }
    chaos.push(<polyline key={c} points={cp.join(' ')} fill="none" stroke={['#ff5468', '#f5b945', '#8b8a99', '#7c5cff'][c]} strokeWidth="2.5" opacity={(1 - lock) * 0.4} />);
  }
  return (
    <div style={{position: 'absolute', left: 160, top: 620, width: 760, height: 380, borderRadius: 24, overflow: 'hidden', background: '#070b0a', border: '4px solid #1c2a28', boxShadow: `0 0 60px ${C.teal}${lock > 0.5 ? '44' : '11'}, inset 0 0 60px #000`}}>
      {/* Rauschen */}
      <div style={{position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,${STATIC_SVG}")`, backgroundSize: '180px', opacity: noiseOp, transform: `translate(${Math.round(Math.sin(f) * 8)}px,${Math.round(Math.cos(f * 1.3) * 8)}px)`, mixBlendMode: 'screen'}} />
      {/* Scanlines */}
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(180deg,rgba(0,0,0,0.35) 0 2px,transparent 2px 4px)', opacity: 0.4}} />
      {/* Roll-Bar */}
      <div style={{position: 'absolute', left: 0, right: 0, top: roll - 60, height: 60, background: 'linear-gradient(180deg,transparent,rgba(255,255,255,0.06),transparent)', opacity: (1 - lock)}} />
      <svg viewBox="0 0 760 380" style={{position: 'absolute', inset: 0}}>
        {chaos}
        <polyline points={pts.join(' ')} fill="none" stroke={C.teal} strokeWidth="4" opacity={0.35 + lock * 0.65} style={{filter: `drop-shadow(0 0 8px ${C.teal})`}} />
      </svg>
      {/* LOCK-Badge */}
      {lock > 0.6 && <div style={{position: 'absolute', right: 20, top: 16, fontSize: 22, fontWeight: 900, letterSpacing: 3, color: C.green, border: `2px solid ${C.green}`, borderRadius: 8, padding: '4px 12px'}}>● LOCK</div>}
    </div>
  );
};

// Tuner-Skala + Nadel. pos ∈ [0,1] Position, target center bei lock.
const Dial = ({pos}) => {
  const x = 80 + pos * 920;
  const ticks = [];
  for (let i = 0; i <= 20; i++) ticks.push(<div key={i} style={{position: 'absolute', left: 80 + i * 46, top: i % 5 === 0 ? 0 : 10, width: 2, height: i % 5 === 0 ? 30 : 18, background: '#3a4a48'}} />);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1080, height: 60}}>
      {ticks}
      <div style={{position: 'absolute', left: x, top: -6, width: 4, height: 50, background: C.red, boxShadow: `0 0 14px ${C.red}`, borderRadius: 2}} />
    </div>
  );
};

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.teal}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 62px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 25, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 10}}>{kicker}</div>}
    <div style={{fontSize: 53, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  const pos = 0.2 + Math.abs(Math.sin(f * 0.06)) * 0.6;
  return (
    <AbsoluteFill>
      <Screen f={f} lock={0} />
      <Dial pos={pos} />
      <Caption top={260} main={<>Deine Kunden hören<br />nur <span style={{color: C.red}}>Rauschen</span>.</>} o={a} ty={(1 - a) * 22} kcol={C.red} />
    </AbsoluteFill>
  );
};

const ScanScene = () => {
  const f = useCurrentFrame();
  const pos = 0.15 + (Math.sin(f * 0.12) * 0.5 + 0.5) * 0.7;
  const lab = spring({frame: f - 16, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Screen f={f} lock={0.08} />
      <Dial pos={pos} />
      <Caption top={250} kicker="100 ANBIETER, EINE STIMME" main={<>Zwischen all den anderen<br /><span style={{color: C.gold}}>geht dein Name unter.</span></>} o={lab} ty={(1 - lab) * 16} kcol={C.gold} />
    </AbsoluteFill>
  );
};

const LockScene = () => {
  const f = useCurrentFrame();
  const lock = interpolate(f, [20, 70], [0.08, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pos = interpolate(f, [10, 60], [0.72, 0.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lab = spring({frame: f - 74, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Screen f={f} lock={lock} />
      <Dial pos={pos} />
      <Caption top={250} kicker="SIGNAL GEFUNDEN" main={<>Eine <span style={{color: C.teal}}>klare Frequenz</span>.<br />Deine.</>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const LineScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <div style={{opacity: a, transform: `scale(${0.92 + a * 0.08})`}}>
        <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 4, color: C.gold, marginBottom: 16}}>KLAR STATT LAUT</div>
        <div style={{fontSize: 60, fontWeight: 900, color: C.ink, lineHeight: 1.14}}>Eine gute Website ist<br />dein <span style={{color: C.teal}}>klares Signal</span>.</div>
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
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Sende klar <span style={{color: C.teal}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 860, lineHeight: 1.3}}>Auf welcher Frequenz sendest DU? 📻 ↓</div>
    </AbsoluteFill>
  );
};

export const SignalImRauschen = () => (
  <AbsoluteFill style={{background: '#060a09', fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={SCAN}><ScanScene /></Sequence>
    <Sequence from={HOOK + SCAN} durationInFrames={LOCK}><LockScene /></Sequence>
    <Sequence from={HOOK + SCAN + LOCK} durationInFrames={LINE}><LineScene /></Sequence>
    <Sequence from={HOOK + SCAN + LOCK + LINE} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.07} vignette={0.8} gradeProps={{a: 'rgba(52,227,208,0.10)', b: 'rgba(124,92,255,0.09)'}} />
  </AbsoluteFill>
);
