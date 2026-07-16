import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, rng} from './Cine.jsx';

// Cinematic: gleiche Fassade, zwei Fundamente. Baukasten auf Sand (Risse, kippt)
// vs. Handarbeit auf Fels (steht). Kernbotschaft: Qualität / Fundament / Eigentum.
// 30fps → 75 + 195 + 165 + 90 + 75 = 600 = 20,0 s
const HOOK = 75, SAND = 195, ROCK = 165, LINE = 90, CTA = 75;

const CX = 540;

const Rain = ({intensity = 1}) => {
  const f = useCurrentFrame();
  const drops = [];
  for (let i = 0; i < 60; i++) {
    const x = rng(i) * 1080;
    const speed = 22 + rng(i * 3) * 16;
    const y = ((f * speed + rng(i * 5) * 1920) % 2000) - 60;
    drops.push(<div key={i} style={{position: 'absolute', left: x, top: y, width: 2, height: 22, background: 'linear-gradient(180deg,transparent,#6b7a9a99)', opacity: 0.5 * intensity, transform: 'rotate(8deg)'}} />);
  }
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{drops}</AbsoluteFill>;
};

// Haus mit Fassade. tilt (deg), cracks ∈ [0,1] Rissfortschritt.
const House = ({accent, tilt = 0, sink = 0, cracks = 0}) => (
  <div style={{position: 'absolute', left: CX - 230, top: 620 + sink, width: 460, height: 520, transform: `rotate(${tilt}deg)`, transformOrigin: 'bottom center'}}>
    {/* Dach */}
    <div style={{position: 'absolute', left: -20, top: 0, width: 500, height: 130, background: 'linear-gradient(180deg,#2a2833,#1c1b24)', clipPath: 'polygon(50% 0,100% 100%,0 100%)'}} />
    {/* Körper */}
    <div style={{position: 'absolute', left: 20, top: 120, width: 420, height: 400, background: 'linear-gradient(180deg,#17161f,#121118)', border: `2px solid #24232e`, borderRadius: '4px'}} />
    {/* Fenster */}
    <div style={{position: 'absolute', left: 60, top: 170, width: 110, height: 110, background: `${accent}33`, border: `2px solid ${accent}`, borderRadius: 4}} />
    <div style={{position: 'absolute', left: 270, top: 170, width: 110, height: 110, background: `${accent}33`, border: `2px solid ${accent}`, borderRadius: 4}} />
    {/* Tür */}
    <div style={{position: 'absolute', left: 178, top: 330, width: 84, height: 190, background: '#0e0d14', border: `2px solid ${accent}88`, borderRadius: '6px 6px 0 0'}} />
    {/* Risse */}
    {cracks > 0.02 && (
      <svg viewBox="0 0 460 520" style={{position: 'absolute', inset: 0}}>
        <polyline points="230,120 220,200 250,260 235,340 255,430" fill="none" stroke={C.red} strokeWidth="3" strokeDasharray="400" strokeDashoffset={400 - cracks * 400} style={{filter: `drop-shadow(0 0 4px ${C.red})`}} />
        <polyline points="120,140 140,220 110,300" fill="none" stroke={C.red} strokeWidth="2.4" strokeDasharray="260" strokeDashoffset={260 - cracks * 260} opacity="0.85" />
      </svg>
    )}
  </div>
);

// Fundament: sand (körnig) oder fels (geschichtet).
const Foundation = ({type, glow = false, shift = 0}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 1140, bottom: 0}}>
    {type === 'sand' ? (
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#3a3220,#211d12)', transform: `translateY(${shift}px)`}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#5a4d2e 1.5px, transparent 1.5px)', backgroundSize: '14px 14px', opacity: 0.5}} />
      </div>
    ) : (
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#232634,#12141c)'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 40, height: 3, background: '#34e3d022'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 120, height: 3, background: '#34e3d022'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 220, height: 3, background: '#34e3d022'}} />
        {glow && <div style={{position: 'absolute', left: CX - 240, top: -6, width: 480, height: 60, background: `radial-gradient(closest-side, ${C.teal}55, transparent 72%)`, filter: 'blur(10px)'}} />}
      </div>
    )}
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 4, background: type === 'sand' ? '#5a4d2e' : `${C.teal}55`}} />
    <div style={{position: 'absolute', left: 60, top: -46, fontSize: 26, fontWeight: 900, letterSpacing: 4, color: type === 'sand' ? C.gold : C.teal}}>{type === 'sand' ? 'SAND' : 'FELS'}</div>
  </div>
);

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.teal}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 66px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 12}}>{kicker}</div>}
    <div style={{fontSize: 55, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const Blueprint = () => (
  <AbsoluteFill style={{opacity: 0.1}}>
    <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#7c5cff 1px,transparent 1px),linear-gradient(90deg,#7c5cff 1px,transparent 1px)', backgroundSize: '48px 48px'}} />
  </AbsoluteFill>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <Blueprint />
      <House accent={C.muted} />
      <Foundation type="rock" />
      <Caption top={330} main={<>Zwei Websites.<br />Gleiche <span style={{color: C.violet}}>Fassade</span>.</>} o={a} ty={(1 - a) * 22} />
    </AbsoluteFill>
  );
};

const SandScene = () => {
  const f = useCurrentFrame();
  const cracks = interpolate(f, [40, 150], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tilt = interpolate(f, [90, 195], [0, 7], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sink = interpolate(f, [90, 195], [0, 40], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lab = spring({frame: f - 20, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Blueprint />
      <Rain intensity={1} />
      <House accent={C.red} tilt={tilt} sink={sink} cracks={cracks} />
      <Foundation type="sand" shift={interpolate(f, [90, 195], [0, 16], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      <Caption top={280} kicker="BAUKASTEN" main={<>Gebaut auf <span style={{color: C.red}}>Sand</span>.<br />Der erste Sturm reicht.</>} o={lab} ty={(1 - lab) * 16} kcol={C.red} />
    </AbsoluteFill>
  );
};

const RockScene = () => {
  const f = useCurrentFrame();
  const lab = spring({frame: f - 16, fps: 30, config: {damping: 16}});
  const shake = f < 60 ? Math.sin(f * 2) * 1.2 : 0;
  return (
    <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
      <Blueprint />
      <Rain intensity={1} />
      <House accent={C.teal} />
      <Foundation type="rock" glow />
      <Caption top={280} kicker="HANDARBEIT" main={<>Gebaut auf <span style={{color: C.teal}}>Fels</span>.<br />Steht. Punkt.</>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const LineScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <Blueprint />
      <div style={{opacity: a, transform: `scale(${0.92 + a * 0.08})`}}>
        <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 4, color: C.gold, marginBottom: 16}}>WORAUF ES ANKOMMT</div>
        <div style={{fontSize: 60, fontWeight: 900, color: C.ink, lineHeight: 1.14}}>Die Fassade sieht man.<br />Das <span style={{color: C.teal}}>Fundament</span> entscheidet.</div>
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
      <Blueprint />
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Bau auf Fels <span style={{color: C.teal}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 860, lineHeight: 1.3}}>Worauf steht DEINE Website — Sand oder Fels? ↓</div>
    </AbsoluteFill>
  );
};

export const DasFundament = () => (
  <AbsoluteFill style={{background: '#080810', fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={SAND}><SandScene /></Sequence>
    <Sequence from={HOOK + SAND} durationInFrames={ROCK}><RockScene /></Sequence>
    <Sequence from={HOOK + SAND + ROCK} durationInFrames={LINE}><LineScene /></Sequence>
    <Sequence from={HOOK + SAND + ROCK + LINE} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.08} vignette={0.82} gradeProps={{a: 'rgba(124,92,255,0.09)', b: 'rgba(52,227,208,0.10)'}} />
  </AbsoluteFill>
);
