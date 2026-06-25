import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const ITEMS = [
  {icon: '</>', label: 'Der komplette Quellcode'},
  {icon: '🗂️', label: 'Alle Dateien & Assets'},
  {icon: '🌐', label: 'Deine eigene Domain'},
  {icon: '🚀', label: 'Frei hostbar – wo du willst'},
];

const CheckRow = ({icon, label, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  const check = spring({frame: f - delay - 8, fps: 30, config: {damping: 12}});
  return (
    <div style={{transform: `translateX(${(1 - p) * -40}px)`, opacity: p,
      display: 'flex', alignItems: 'center', gap: 24, width: 760,
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: '22px 28px'}}>
      <div style={{width: 64, height: 64, borderRadius: 14, background: C.cardHi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 800, color: C.violet, flexShrink: 0}}>{icon}</div>
      <div style={{flex: 1, fontSize: 38, fontWeight: 700, color: C.ink}}>{label}</div>
      <div style={{width: 52, height: 52, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04201c', fontSize: 32, fontWeight: 900, transform: `scale(${check})`}}>✓</div>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.86 + pop * 0.14})`, opacity: pop}}>
        <div style={{fontSize: 120}}>📦</div>
        <div style={{fontSize: 76, color: C.ink, fontWeight: 800, lineHeight: 1.1, marginTop: 16}}>
          Am Ende bekommst du<br />nicht <span style={{color: C.violet}}>nur</span> eine Website.</div>
        <div style={{fontSize: 36, color: C.muted, marginTop: 24}}>Du bekommst ein Eigentum.</div>
      </div>
    </AbsoluteFill>
  );
};

const ListScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 22}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 44, fontWeight: 800, color: C.ink, marginBottom: 14}}>
        Das gehört nach dem Projekt <span style={{color: C.teal}}>dir:</span>
      </div>
      {ITEMS.map((it, i) => <CheckRow key={i} icon={it.icon} label={it.label} delay={20 + i * 32} />)}
    </AbsoluteFill>
  );
};

const StampScene = () => {
  const f = useCurrentFrame();
  const stamp = spring({frame: f, fps: 30, config: {damping: 9, mass: 0.8}});
  const rot = interpolate(stamp, [0, 1], [-16, -8]);
  const line = spring({frame: f - 24, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <div style={{transform: `scale(${0.4 + stamp * 0.6}) rotate(${rot}deg)`, opacity: Math.min(1, stamp * 1.5),
        border: `8px solid ${C.teal}`, borderRadius: 22, padding: '30px 54px', color: C.teal,
        fontSize: 70, fontWeight: 900, letterSpacing: 3, boxShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>
        GEHÖRT DIR
      </div>
      <div style={{marginTop: 50, opacity: line, transform: `translateY(${(1 - line) * 20}px)`, fontSize: 46, fontWeight: 800, color: C.ink}}>
        Kein Mietmodell. <span style={{color: C.violet}}>Dein digitales Eigentum.</span>
      </div>
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
        <div style={{fontSize: 86, color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 30}}>
          Deine Website.<br /><span style={{color: C.violet}}>Dein Eigentum.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '26px 52px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 38, fontWeight: 800}}>Kommentier „MEINS" → so geht's</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const EigentumUebergabe = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 690], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 800px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={92}><HookScene /></Sequence>
      <Sequence from={92} durationInFrames={250}><ListScene /></Sequence>
      <Sequence from={342} durationInFrames={210}><StampScene /></Sequence>
      <Sequence from={552} durationInFrames={138}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
