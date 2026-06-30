import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const SECTIONS = [
  {num: '1', title: 'Headline', desc: 'sagt in 3 Sek., worum es geht', type: 'headline', accent: C.violet},
  {num: '2', title: 'Nutzen', desc: 'was der Besucher davon hat', type: 'text', accent: C.teal},
  {num: '3', title: 'Beweis', desc: 'Referenzen, Bewertungen, Logos', type: 'proof', accent: C.gold},
  {num: '4', title: 'EIN Call-to-Action', desc: 'ein Ziel, ein Button', type: 'cta', accent: C.violet},
];

const Skeleton = ({type}) => {
  const bar = (w, h, c = C.cardHi) => ({width: w, height: h, background: c, borderRadius: 6});
  if (type === 'headline') return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
      <div style={bar('72%', 22)} /><div style={bar('46%', 12)} />
    </div>
  );
  if (type === 'text') return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
      <div style={bar('92%', 11)} /><div style={bar('78%', 11)} />
    </div>
  );
  if (type === 'proof') return (
    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
      {[0, 1, 2, 3].map(i => <div key={i} style={{width: 26, height: 26, borderRadius: '50%', background: C.cardHi}} />)}
      <div style={{...bar('30%', 11), marginLeft: 8}} />
    </div>
  );
  return <div style={{width: '46%', height: 34, background: C.violet, borderRadius: 9}} />;
};

const Section = ({num, title, desc, type, accent, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  return (
    <div style={{opacity: p, transform: `translateY(${(1 - p) * 18}px)`,
      background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${accent}`, borderRadius: 12, padding: '16px 20px'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4}}>
        <span style={{color: accent, fontWeight: 900, fontSize: 26}}>{num}</span>
        <span style={{color: C.ink, fontWeight: 800, fontSize: 30}}>{title}</span>
      </div>
      <div style={{color: C.muted, fontWeight: 600, fontSize: 22, marginBottom: 12}}>{desc}</div>
      <Skeleton type={type} />
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.86 + pop * 0.14})`, opacity: pop}}>
        <div style={{fontSize: 110}}>🧩</div>
        <div style={{fontSize: 74, color: C.ink, fontWeight: 800, lineHeight: 1.1, marginTop: 6}}>
          Anatomie einer<br /><span style={{color: C.violet}}>Landing Page.</span></div>
        <div style={{marginTop: 28, fontSize: 40, color: C.muted, fontWeight: 700}}>Die 4 Teile, die verkaufen.</div>
      </div>
    </AbsoluteFill>
  );
};

const BuildScene = () => {
  const f = useCurrentFrame();
  const frame = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 70px'}}>
      <div style={{width: 940, opacity: frame, transform: `translateY(${(1 - frame) * 30}px)`,
        background: C.bg, border: `1px solid ${C.border}`, borderRadius: 22, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.55)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', background: C.surface || C.cardHi, borderBottom: `1px solid ${C.border}`}}>
          <div style={{width: 13, height: 13, borderRadius: '50%', background: C.red}} />
          <div style={{width: 13, height: 13, borderRadius: '50%', background: C.gold}} />
          <div style={{width: 13, height: 13, borderRadius: '50%', background: C.teal}} />
          <div style={{marginLeft: 16, flex: 1, height: 26, background: C.card, borderRadius: 13, display: 'flex', alignItems: 'center', paddingLeft: 16, color: C.muted, fontSize: 18, fontWeight: 600}}>deine-seite.de</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, padding: 20}}>
          {SECTIONS.map((s, i) => <Section key={i} {...s} delay={16 + i * 52} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PrincipleScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 24, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{opacity: a, transform: `scale(${0.9 + a * 0.1})`, fontSize: 78, color: C.ink, fontWeight: 800, lineHeight: 1.1}}>
        Eine Seite.<br /><span style={{color: C.teal}}>Ein Ziel.</span></div>
      <div style={{marginTop: 30, opacity: b, transform: `translateY(${(1 - b) * 20}px)`, fontSize: 40, color: C.muted, fontWeight: 700}}>
        Kein Ablenken. Ein klarer Weg zum Klick.</div>
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
          Struktur schlägt<br /><span style={{color: C.violet}}>Zufall.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '24px 50px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 800}}>🔖 Speichern für später</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const LandingPageAnatomie = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={96}><HookScene /></Sequence>
      <Sequence from={96} durationInFrames={444}><BuildScene /></Sequence>
      <Sequence from={540} durationInFrames={80}><PrincipleScene /></Sequence>
      <Sequence from={620} durationInFrames={100}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
