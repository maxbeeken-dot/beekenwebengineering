import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, rng} from './Cine.jsx';

// Cinematic: Raketenstart. Zündung → Aufstieg → Orbit. Eine gute Website hebt
// dein Business ab. Kernbotschaft: online durchstarten / Wachstum.
// 30fps → 75 + 195 + 180 + 75 + 75 = 600 = 20,0 s
const HOOK = 75, IGNITE = 195, CLIMB = 180, ORBIT = 75, CTA = 75;

const CX = 540;

const Starfield = ({scroll = 0, density = 60}) => {
  const stars = [];
  for (let i = 0; i < density; i++) {
    const x = rng(i) * 1080;
    const y = ((rng(i * 3 + 1) * 2400 + scroll) % 2400) - 240;
    const r = rng(i * 7) * 2.4 + 0.6;
    const tw = 0.4 + 0.6 * Math.abs(Math.sin((i + scroll * 0.02) * 0.3));
    stars.push(<div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: '50%', background: '#fff', opacity: tw * 0.8}} />);
  }
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{stars}</AbsoluteFill>;
};

// Rakete. thrust ∈ [0,1] Flammenstärke.
const Rocket = ({thrust = 0, f = 0, y = 0}) => {
  const flick = 0.7 + Math.sin(f * 0.9) * 0.3;
  const flameH = thrust * (220 + flick * 120);
  return (
    <div style={{position: 'absolute', left: CX - 70, top: 760 + y, width: 140, height: 420}}>
      {/* Flamme */}
      {thrust > 0.02 && (
        <div style={{position: 'absolute', left: 34, top: 300, width: 72, height: flameH, transform: `scaleX(${0.7 + flick * 0.3})`, transformOrigin: 'top center', background: `linear-gradient(180deg, #fff, ${C.gold} 30%, ${C.red} 75%, transparent)`, clipPath: 'polygon(50% 100%, 0 0, 100% 0)', filter: 'blur(2px)', opacity: 0.95}} />
      )}
      {/* Körper */}
      <div style={{position: 'absolute', left: 40, top: 60, width: 60, height: 250, borderRadius: '30px 30px 14px 14px', background: 'linear-gradient(90deg,#c9ccd8,#f6f5fa 45%,#9a9db0)'}} />
      {/* Nase */}
      <div style={{position: 'absolute', left: 40, top: 0, width: 60, height: 74, background: `linear-gradient(180deg,${C.violet},${C.teal})`, clipPath: 'polygon(50% 0,100% 100%,0 100%)'}} />
      {/* Fenster */}
      <div style={{position: 'absolute', left: 56, top: 110, width: 28, height: 28, borderRadius: '50%', background: C.teal, border: '3px solid #6b6e80', boxShadow: `0 0 16px ${C.teal}`}} />
      {/* Finnen */}
      <div style={{position: 'absolute', left: 14, top: 250, width: 34, height: 70, background: C.red, clipPath: 'polygon(100% 0,100% 100%,0 100%)'}} />
      <div style={{position: 'absolute', left: 92, top: 250, width: 34, height: 70, background: C.red, clipPath: 'polygon(0 0,100% 100%,0 100%)'}} />
    </div>
  );
};

const Smoke = ({f}) => {
  const puffs = [];
  for (let i = 0; i < 10; i++) {
    const t = ((f * 0.9 + i * 12) % 90) / 90;
    const side = i % 2 ? 1 : -1;
    const x = CX + side * (40 + t * 320) + (rng(i) - 0.5) * 40;
    const y = 1120 + t * 60 - Math.sin(t * 3) * 20;
    const r = 40 + t * 160;
    puffs.push(<div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(closest-side, rgba(220,220,230,${0.5 * (1 - t)}), transparent 70%)`, filter: 'blur(6px)'}} />);
  }
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{puffs}</AbsoluteFill>;
};

const Pad = () => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 240, background: 'linear-gradient(180deg,#12121a,#08080d)'}} />
    <div style={{position: 'absolute', left: CX - 130, bottom: 200, width: 260, height: 20, background: '#1c1b24', borderRadius: 4}} />
    <div style={{position: 'absolute', left: CX - 120, bottom: 60, width: 14, height: 150, background: '#20202a'}} />
    <div style={{position: 'absolute', left: CX + 106, bottom: 60, width: 14, height: 150, background: '#20202a'}} />
  </>
);

const Metric = ({top, label, value, o = 1, col = C.teal}) => (
  <div style={{position: 'absolute', right: 60, top, textAlign: 'right', opacity: o}}>
    <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 2, color: C.muted}}>{label}</div>
    <div style={{fontSize: 52, fontWeight: 900, color: col, fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>{value}</div>
  </div>
);

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.teal}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 62px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 12}}>{kicker}</div>}
    <div style={{fontSize: 55, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  const n = 3 - Math.floor(f / 22);
  return (
    <AbsoluteFill>
      <Starfield density={40} />
      <Pad />
      <Rocket thrust={0} f={f} />
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', opacity: a}}>
        {n > 0 && <div style={{fontSize: 160, fontWeight: 900, color: C.gold, lineHeight: 1, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 40px ${C.gold}66`}}>{n}</div>}
      </div>
      <Caption top={560} main={<>Deine Website.<br /><span style={{color: C.gold}}>Startklar?</span></>} o={a} ty={(1 - a) * 20} kcol={C.gold} />
    </AbsoluteFill>
  );
};

const IgniteScene = () => {
  const f = useCurrentFrame();
  const thrust = interpolate(f, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rise = interpolate(f, [40, 195], [0, -420], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shake = f < 60 ? Math.sin(f * 2.4) * (60 - f) * 0.12 : 0;
  const lab = spring({frame: f - 30, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
      <Starfield density={40} scroll={-rise * 0.4} />
      <Pad />
      <Smoke f={f} />
      <Rocket thrust={thrust} f={f} y={rise} />
      <Caption top={240} kicker="ZÜNDUNG" main={<>Eine gute Website<br /><span style={{color: C.gold}}>hebt dich ab.</span></>} o={lab} ty={(1 - lab) * 16} kcol={C.gold} />
    </AbsoluteFill>
  );
};

const ClimbScene = () => {
  const f = useCurrentFrame();
  const scroll = f * 14;
  const vis = Math.round(interpolate(f, [10, 160], [120, 4800], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const req = Math.round(interpolate(f, [30, 160], [2, 47], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const lab = spring({frame: f - 8, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Starfield density={70} scroll={scroll} />
      <Rocket thrust={1} f={f} y={-420} />
      <Metric top={640} label="BESUCHER / MONAT" value={vis.toLocaleString('de-DE')} o={interpolate(f, [10, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      <Metric top={780} label="ANFRAGEN" value={req} o={interpolate(f, [30, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} col={C.gold} />
      <Caption top={250} main={<>Mehr Sichtbarkeit.<br /><span style={{color: C.teal}}>Mehr Anfragen.</span></>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const OrbitScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const spin = f * 0.4;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <Starfield density={80} />
      {/* Planet/Logo */}
      <div style={{position: 'absolute', left: CX - 130, top: 640, width: 260, height: 260, borderRadius: '50%', background: `radial-gradient(circle at 38% 34%, ${C.teal}, ${C.violet} 70%, #1a1440)`, boxShadow: `0 0 80px ${C.violet}66`, transform: `scale(${0.7 + a * 0.3})`}} />
      <div style={{position: 'absolute', left: CX - 190, top: 720, width: 380, height: 120, borderRadius: '50%', border: `4px solid ${C.gold}55`, transform: `rotate(${18 + Math.sin(spin * 0.03) * 4}deg)`}} />
      <div style={{position: 'absolute', top: 1000, left: 0, right: 0, opacity: a}}>
        <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 5, color: C.gold, marginBottom: 14}}>IM ORBIT</div>
        <div style={{fontSize: 62, fontWeight: 900, color: C.ink}}>Online <span style={{color: C.teal}}>durchgestartet</span>.</div>
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
      <Starfield density={50} />
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Zünde deinen Start <span style={{color: C.gold}}>🚀</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 860, lineHeight: 1.3}}>Startklar oder noch am Boden? 🚀 in die Kommentare</div>
    </AbsoluteFill>
  );
};

export const Zuendung = () => (
  <AbsoluteFill style={{background: '#04040a', fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={IGNITE}><IgniteScene /></Sequence>
    <Sequence from={HOOK + IGNITE} durationInFrames={CLIMB}><ClimbScene /></Sequence>
    <Sequence from={HOOK + IGNITE + CLIMB} durationInFrames={ORBIT}><OrbitScene /></Sequence>
    <Sequence from={HOOK + IGNITE + CLIMB + ORBIT} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.07} vignette={0.82} gradeProps={{a: 'rgba(124,92,255,0.10)', b: 'rgba(245,185,69,0.09)'}} />
  </AbsoluteFill>
);
