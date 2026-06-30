import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const FIXES = [
  {n: '1', title: 'Richtiges Format', desc: 'WebP/AVIF statt JPG/PNG'},
  {n: '2', title: 'Richtige Größe', desc: 'kein 4000px-Bild für 800px Platz'},
  {n: '3', title: 'Komprimieren', desc: 'Qualität ~80% reicht völlig'},
  {n: '4', title: 'Lazy Load', desc: 'loading="lazy" – lädt erst bei Bedarf'},
];

const FixRow = ({n, title, desc, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  return (
    <div style={{transform: `translateX(${(1 - p) * -40}px)`, opacity: p,
      display: 'flex', alignItems: 'center', gap: 22, width: 880,
      background: C.card, border: `1px solid ${C.border}`, borderLeft: `5px solid ${C.teal}`, borderRadius: 18, padding: '18px 26px'}}>
      <div style={{width: 66, height: 66, borderRadius: 14, background: C.cardHi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 900, color: C.teal, flexShrink: 0}}>{n}</div>
      <div style={{flex: 1, textAlign: 'left'}}>
        <div style={{fontSize: 36, fontWeight: 800, color: C.ink}}>{title}</div>
        <div style={{fontSize: 26, fontWeight: 600, color: C.muted, marginTop: 3}}>{desc}</div>
      </div>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.86 + pop * 0.14})`, opacity: pop}}>
        <div style={{fontSize: 96}}>🖼️</div>
        <div style={{fontSize: 132, color: C.red, fontWeight: 900, lineHeight: 1}}>4,2 MB</div>
        <div style={{marginTop: 18, fontSize: 56, color: C.ink, fontWeight: 800, lineHeight: 1.12}}>Ein Bild – und deine<br />Seite kriecht. 🐌</div>
      </div>
    </AbsoluteFill>
  );
};

const FixListScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 20}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 46, fontWeight: 800, color: C.ink, marginBottom: 12}}>So machst du Bilder <span style={{color: C.teal}}>leicht</span>:</div>
      {FIXES.map((x, i) => <FixRow key={i} {...x} delay={20 + i * 36} />)}
    </AbsoluteFill>
  );
};

const PayoffScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const t = interpolate(f, [12, 64], [4200, 180], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const label = t >= 1000 ? (t / 1000).toFixed(1).replace('.', ',') + ' MB' : Math.round(t) + ' KB';
  const color = t > 1000 ? C.red : C.teal;
  const b = spring({frame: f - 56, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{opacity: a, fontSize: 42, color: C.muted, fontWeight: 700, marginBottom: 8}}>Gleiches Bild:</div>
      <div style={{fontSize: 140, fontWeight: 900, color, lineHeight: 1}}>{label}</div>
      <div style={{marginTop: 24, opacity: b, transform: `translateY(${(1 - b) * 20}px)`, fontSize: 58, color: C.ink, fontWeight: 800}}>
        ~95% <span style={{color: C.teal}}>leichter.</span> 🚀</div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 14}});
  const pulse = 1 + Math.sin(f * 0.18) * 0.03;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 26}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 78, color: C.ink, fontWeight: 800, lineHeight: 1.08, marginBottom: 30}}>
          Schnelle Seite<br />beginnt beim <span style={{color: C.violet}}>Bild.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '24px 50px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 800}}>🔖 Speichern für später</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const BilderOptimieren = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={100}><HookScene /></Sequence>
      <Sequence from={100} durationInFrames={370}><FixListScene /></Sequence>
      <Sequence from={470} durationInFrames={130}><PayoffScene /></Sequence>
      <Sequence from={600} durationInFrames={120}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
