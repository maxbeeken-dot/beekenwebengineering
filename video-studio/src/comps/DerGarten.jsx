import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, LightRays, DustMotes, rng} from './Cine.jsx';

// Cinematic: Samen → Baum. Eine eigene Website wächst & trägt jedes Jahr mehr –
// und gehört DIR. Kernbotschaft: Eigentum / langfristige Investition.
// 30fps → 75 + 210 + 165 + 105 + 75 = 630 = 21,0 s
const HOOK = 75, GROW = 210, YEARS = 165, OWN = 105, CTA = 75;

const GROUND_Y = 1480;
const CX = 540;

const Ground = () => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: GROUND_Y, bottom: 0, background: 'linear-gradient(180deg,#1a1206,#0c0a05)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: GROUND_Y, height: 4, background: 'linear-gradient(90deg,transparent,#3ddc8433,transparent)'}} />
  </>
);

// Pflanze nach Wachstums-Fortschritt g ∈ [0,1]. fruit = Anzahl leuchtender Früchte.
const Plant = ({g, fruit = 0, f = 0}) => {
  const trunkH = 60 + g * 560;
  const trunkW = 18 + g * 26;
  const blobs = [
    {dx: 0, dy: -40, r: 150, t: 0.30}, {dx: -130, dy: 30, r: 120, t: 0.42},
    {dx: 130, dy: 26, r: 120, t: 0.42}, {dx: -70, dy: -140, r: 110, t: 0.55},
    {dx: 80, dy: -150, r: 110, t: 0.55}, {dx: 0, dy: -200, r: 96, t: 0.7},
  ];
  const topY = GROUND_Y - trunkH;
  const fruits = [];
  for (let i = 0; i < fruit; i++) {
    const fx = CX + (rng(i) - 0.5) * 320;
    const fy = topY - 60 + (rng(i * 3 + 1) - 0.5) * 240;
    const pop = interpolate(f, [i * 3, i * 3 + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    fruits.push(<div key={i} style={{position: 'absolute', left: fx, top: fy, width: 22, height: 22, borderRadius: '50%', background: C.gold, boxShadow: `0 0 18px 4px ${C.gold}`, transform: `scale(${pop})`}} />);
  }
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* Wurzeln */}
      {[-1, 0, 1].map((s, i) => (
        <div key={i} style={{position: 'absolute', left: CX + s * 24, top: GROUND_Y, width: 5, height: g * (120 + i * 30), background: 'linear-gradient(180deg,#4a3418,transparent)', transform: `rotate(${s * 16}deg)`, transformOrigin: 'top center', opacity: 0.7}} />
      ))}
      {/* Stamm */}
      <div style={{position: 'absolute', left: CX - trunkW / 2, top: topY, width: trunkW, height: trunkH, background: 'linear-gradient(90deg,#3a2a14,#5a431f,#3a2a14)', borderRadius: 8}} />
      {/* Krone */}
      {blobs.map((b, i) => {
        const bg = interpolate(g, [b.t, Math.min(1, b.t + 0.22)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return <div key={i} style={{position: 'absolute', left: CX + b.dx - b.r, top: topY + b.dy - b.r, width: b.r * 2, height: b.r * 2, borderRadius: '50%', background: `radial-gradient(closest-side,#3ddc84,#1f7a48 70%,transparent)`, opacity: bg * 0.92, transform: `scale(${0.4 + bg * 0.6})`}} />;
      })}
      {fruits}
    </AbsoluteFill>
  );
};

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.green}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 66px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 12}}>{kicker}</div>}
    <div style={{fontSize: 55, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  const glow = 0.5 + Math.abs(Math.sin(f * 0.06)) * 0.5;
  return (
    <AbsoluteFill>
      <Ground />
      <div style={{position: 'absolute', left: CX - 14, top: GROUND_Y - 20, width: 28, height: 34, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: C.green, opacity: glow, boxShadow: `0 0 26px 6px ${C.green}`}} />
      <Caption top={430} main={<>Die meisten <span style={{color: C.red}}>mieten</span><br />ihre Sichtbarkeit.</>} o={a} ty={(1 - a) * 22} kcol={C.gold} />
    </AbsoluteFill>
  );
};

const GrowScene = () => {
  const f = useCurrentFrame();
  const g = interpolate(f, [10, 180], [0.02, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lab = spring({frame: f - 30, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <LightRays x="50%" y="-6%" color="rgba(61,220,132,0.10)" count={6} spread={60} />
      <DustMotes count={18} color="rgba(61,220,132,0.5)" />
      <Ground />
      <Plant g={g} fruit={g > 0.6 ? 4 : 0} f={f - 120} />
      <Caption top={250} kicker="ZEIGEN STATT ERZÄHLEN" main={<>Eine <span style={{color: C.green}}>eigene</span> Website<br />wächst mit dir.</>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const YearsScene = () => {
  const f = useCurrentFrame();
  const g = interpolate(f, [0, 150], [0.85, 1], {extrapolateRight: 'clamp'});
  const year = Math.min(5, 1 + Math.floor(interpolate(f, [0, 150], [0, 5], {extrapolateRight: 'clamp'})));
  const fruit = Math.min(12, 4 + Math.floor(interpolate(f, [0, 150], [0, 8], {extrapolateRight: 'clamp'})));
  const lab = spring({frame: f - 8, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <LightRays x="50%" y="-6%" color="rgba(245,185,69,0.09)" count={6} spread={60} />
      <DustMotes count={20} color="rgba(245,185,69,0.5)" />
      <Ground />
      <Plant g={g} fruit={fruit} f={f} />
      <div style={{position: 'absolute', top: 190, left: 0, right: 0, textAlign: 'center', opacity: lab}}>
        <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 4, color: C.gold}}>JAHR</div>
        <div style={{fontSize: 120, fontWeight: 900, color: C.ink, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums'}}>{year}</div>
      </div>
      <Caption top={470} main={<>Jedes Jahr <span style={{color: C.gold}}>trägt sie mehr</span>.</>} o={lab} ty={0} />
    </AbsoluteFill>
  );
};

const OwnScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 6, fps: 30, config: {damping: 15}});
  const stamp = spring({frame: f - 26, fps: 30, config: {damping: 9, mass: 0.6}});
  return (
    <AbsoluteFill>
      <LightRays x="50%" y="-6%" color="rgba(61,220,132,0.10)" count={6} spread={60} />
      <DustMotes count={22} color="rgba(255,255,255,0.5)" />
      <Ground />
      <Plant g={1} fruit={12} f={f + 40} />
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 16}px)`}}>
        <div style={{fontSize: 58, fontWeight: 900, color: C.ink, lineHeight: 1.14}}>Und der Baum<br />gehört <span style={{color: C.green}}>dir</span>.</div>
        <div style={{display: 'inline-block', marginTop: 18, transform: `scale(${stamp}) rotate(-7deg)`, fontSize: 30, fontWeight: 900, color: C.green, border: `4px solid ${C.green}`, borderRadius: 14, padding: '8px 22px'}}>DEIN EIGENTUM ✅</div>
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
      <DustMotes count={16} color="rgba(61,220,132,0.5)" />
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.green, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Pflanz deine Website <span style={{color: C.green}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 860, lineHeight: 1.3}}>Seit wann steht DEINE Website? Jahre in die Kommentare 🌱</div>
    </AbsoluteFill>
  );
};

export const DerGarten = () => (
  <AbsoluteFill style={{background: '#070a06', fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={GROW}><GrowScene /></Sequence>
    <Sequence from={HOOK + GROW} durationInFrames={YEARS}><YearsScene /></Sequence>
    <Sequence from={HOOK + GROW + YEARS} durationInFrames={OWN}><OwnScene /></Sequence>
    <Sequence from={HOOK + GROW + YEARS + OWN} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.075} vignette={0.8} gradeProps={{a: 'rgba(61,220,132,0.10)', b: 'rgba(245,185,69,0.09)'}} />
  </AbsoluteFill>
);
