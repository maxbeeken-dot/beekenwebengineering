import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, DustMotes, rng} from './Cine.jsx';

// Cinematic: Theaterbühne. Vorhang auf → erster Auftritt deiner Marke. Amateur
// vs. großer Auftritt. Kernbotschaft: erster Eindruck / Vertrauen ab Sekunde 1.
// 30fps → 75 + 165 + 210 + 75 + 75 = 600 = 20,0 s
const HOOK = 75, AMATEUR = 165, GRAND = 210, LINE = 75, CTA = 75;

// Roter Samtvorhang – zwei Panels, die nach außen fahren. open ∈ [0,1].
const Curtain = ({open}) => {
  const shift = open * 620;
  const panel = (side) => (
    <div style={{
      position: 'absolute', top: 0, bottom: 0, width: 620,
      [side]: 0, transform: `translateX(${side === 'left' ? -shift : shift}px)`,
      background: 'repeating-linear-gradient(90deg,#4a0d18 0 26px,#6d1626 26px 40px,#3a0a13 40px 66px)',
      boxShadow: side === 'left' ? 'inset -40px 0 60px rgba(0,0,0,0.6)' : 'inset 40px 0 60px rgba(0,0,0,0.6)',
      borderRight: side === 'left' ? '4px solid #2a0710' : 'none',
      borderLeft: side === 'right' ? '4px solid #2a0710' : 'none',
    }} />
  );
  return (
    <AbsoluteFill style={{zIndex: 30, pointerEvents: 'none'}}>
      {panel('left')}
      {panel('right')}
      {/* Bordüre oben */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(180deg,#6d1626,#3a0a13)', borderBottom: '4px solid #f5b94566', zIndex: 31}} />
    </AbsoluteFill>
  );
};

const Spotlight = ({x = 540, y = 900, r = 560, col = 'rgba(245,185,69,0.20)'}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(closest-side, ${col}, transparent 72%)`, pointerEvents: 'none'}} />
);

const Stage = () => (
  <>
    {/* Bühnenboden (Perspektive) */}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 520, background: 'linear-gradient(180deg,#14121a,#0a0910)', clipPath: 'polygon(16% 0, 84% 0, 100% 100%, 0 100%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 518, height: 3, background: 'linear-gradient(90deg,transparent,#f5b94544,transparent)'}} />
  </>
);

// Publikum – Silhouetten-Köpfe unten.
const Audience = ({react = 0}) => {
  const heads = [];
  for (let i = 0; i < 11; i++) {
    const x = 40 + i * 96 + (rng(i) - 0.5) * 20;
    const y = 1800 + rng(i * 3) * 20 - react * (6 + rng(i) * 10);
    heads.push(<div key={i} style={{position: 'absolute', left: x, top: y, width: 62, height: 62, borderRadius: '50%', background: '#050506', boxShadow: '0 -14px 0 -6px #050506'}} />);
  }
  return <AbsoluteFill style={{zIndex: 25, pointerEvents: 'none'}}>{heads}</AbsoluteFill>;
};

// Website-Mockup auf der Bühne. bad → schief/kaputt, good → clean & leuchtend.
const StageSite = ({bad, f = 0}) => {
  const rot = bad ? -4.5 : 0;
  const accent = bad ? C.red : C.teal;
  return (
    <div style={{position: 'absolute', left: 300, top: 620, width: 480, height: 560, transform: `rotate(${rot}deg)`, transformOrigin: 'bottom center'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 16, background: bad ? '#141118' : '#141320', border: `3px solid ${bad ? '#3a2430' : accent}`, boxShadow: bad ? 'none' : `0 0 70px ${accent}55`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 44, background: '#0e0d14', borderRadius: '13px 13px 0 0', display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16}}>
        <div style={{width: 12, height: 12, borderRadius: '50%', background: bad ? C.red : C.green}} />
        <div style={{width: 12, height: 12, borderRadius: '50%', background: '#33313c'}} />
        <div style={{width: 12, height: 12, borderRadius: '50%', background: '#33313c'}} />
      </div>
      {/* Inhalt */}
      <div style={{position: 'absolute', left: 34, top: 84, width: bad ? 260 : 300, height: 34, borderRadius: 6, background: accent, opacity: bad ? 0.6 : 1, transform: bad ? 'skewX(-6deg)' : 'none'}} />
      <div style={{position: 'absolute', left: 34, top: 140, width: bad ? 360 : 400, height: 14, borderRadius: 4, background: '#fff', opacity: bad ? 0.25 : 0.7}} />
      <div style={{position: 'absolute', left: 34, top: 168, width: bad ? 180 : 320, height: 14, borderRadius: 4, background: '#fff', opacity: bad ? 0.18 : 0.55}} />
      {bad
        ? <div style={{position: 'absolute', left: 60, top: 300, fontSize: 40}}>⚠️</div>
        : <div style={{position: 'absolute', left: 34, top: 360, width: 200, height: 60, borderRadius: 12, background: C.violet, boxShadow: `0 0 26px ${C.violet}88`, opacity: interpolate(f, [0, 24], [0, 1], {extrapolateRight: 'clamp'})}} />}
    </div>
  );
};

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.teal}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 66px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 12}}>{kicker}</div>}
    <div style={{fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  const sweep = 540 + Math.sin(f * 0.05) * 120;
  return (
    <AbsoluteFill>
      <Spotlight x={sweep} y={820} r={520} col="rgba(245,185,69,0.16)" />
      <Curtain open={0} />
      <Audience />
      <Caption top={420} main={<>In <span style={{color: C.gold}}>3 Sekunden</span> entscheidet<br />dein Kunde über dich.</>} o={a} ty={(1 - a) * 22} />
    </AbsoluteFill>
  );
};

const AmateurScene = () => {
  const f = useCurrentFrame();
  const open = spring({frame: f, fps: 30, config: {damping: 15, mass: 0.9}});
  const lab = spring({frame: f - 40, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Spotlight x={540} y={860} r={520} col="rgba(255,84,104,0.16)" />
      <Stage />
      <StageSite bad />
      <Curtain open={open} />
      <Audience react={0} />
      <Caption top={280} kicker="ERSTER EINDRUCK" main={<>Vorhang auf –<br /><span style={{color: C.red}}>und alle sehen: Amateur.</span></>} o={lab} ty={(1 - lab) * 16} kcol={C.red} />
    </AbsoluteFill>
  );
};

const GrandScene = () => {
  const f = useCurrentFrame();
  // Vorhang schließt kurz (0-40) und öffnet neu (40+) → sauberer Reveal
  const close = interpolate(f, [0, 34], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const reopen = f > 40 ? spring({frame: f - 40, fps: 30, config: {damping: 15, mass: 0.9}}) : 0;
  const open = f < 40 ? close : reopen;
  const lab = spring({frame: f - 78, fps: 30, config: {damping: 16}});
  const applause = interpolate(f, [90, 150], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Spotlight x={540} y={840} r={560} col="rgba(52,227,208,0.20)" />
      {f > 40 && <DustMotes count={26} color="rgba(245,185,69,0.6)" />}
      <Stage />
      {f > 40 && <StageSite bad={false} f={f - 60} />}
      <Curtain open={open} />
      <Audience react={applause} />
      <Caption top={270} kicker="GROSSER AUFTRITT" main={<>Oder: Sie sehen<br /><span style={{color: C.teal}}>einen Profi.</span></>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const LineScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <Spotlight x={540} y={960} r={620} col="rgba(52,227,208,0.16)" />
      <div style={{opacity: a, transform: `scale(${0.92 + a * 0.08})`}}>
        <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 5, color: C.gold, marginBottom: 18}}>VERTRAUEN AB SEKUNDE 1</div>
        <div style={{fontSize: 68, fontWeight: 900, color: C.ink, lineHeight: 1.12}}>Deine Website ist<br />deine <span style={{color: C.teal}}>Bühne</span>.</div>
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
      <Spotlight x={540} y={300} r={460} col="rgba(52,227,208,0.16)" />
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Inszenier deinen Auftritt <span style={{color: C.teal}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 840, lineHeight: 1.3}}>Standing Ovation oder Buhrufe? 👏 oder 🍅 ↓</div>
    </AbsoluteFill>
  );
};

export const VorhangAuf = () => (
  <AbsoluteFill style={{background: '#0a0609', fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={AMATEUR}><AmateurScene /></Sequence>
    <Sequence from={HOOK + AMATEUR} durationInFrames={GRAND}><GrandScene /></Sequence>
    <Sequence from={HOOK + AMATEUR + GRAND} durationInFrames={LINE}><LineScene /></Sequence>
    <Sequence from={HOOK + AMATEUR + GRAND + LINE} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.08} vignette={0.84} gradeProps={{a: 'rgba(245,185,69,0.10)', b: 'rgba(52,227,208,0.10)'}} />
  </AbsoluteFill>
);
