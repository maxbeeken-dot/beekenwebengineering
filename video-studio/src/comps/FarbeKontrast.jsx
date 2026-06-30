import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Demo-Block, der echten Kontrast zeigt (gut = lesbar, schlecht = nicht)
const DemoBlock = ({good}) => {
  const bg = good ? '#15141d' : '#3a3a40';
  const txt = good ? C.ink : '#55555c';
  const btnBg = good ? C.violet : '#47474e';
  const btnTxt = good ? '#ffffff' : '#5c5c63';
  return (
    <div style={{width: 820, background: bg, border: `1px solid ${C.border}`, borderRadius: 18, padding: '26px 30px'}}>
      <div style={{color: txt, fontSize: 40, fontWeight: 800, marginBottom: 8}}>Jetzt 20% sparen</div>
      <div style={{color: txt, fontSize: 24, fontWeight: 600, marginBottom: 18}}>Nur diese Woche – sichere dir dein Angebot.</div>
      <div style={{display: 'inline-block', background: btnBg, color: btnTxt, fontSize: 26, fontWeight: 800, padding: '14px 30px', borderRadius: 12}}>Jetzt sichern</div>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 70, textAlign: 'center', gap: 36}}>
      <div style={{transform: `scale(${0.92 + pop * 0.08})`, opacity: pop}}><DemoBlock good={false} /></div>
      <div style={{opacity: pop, fontSize: 60, color: C.ink, fontWeight: 800}}>Kannst du das lesen? 👀</div>
    </AbsoluteFill>
  );
};

const CompareScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  const a = spring({frame: f - 18, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 44, fps: 30, config: {damping: 15}});
  const lbl = {fontSize: 30, fontWeight: 800, marginTop: 10, textAlign: 'left', width: 820};
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 28}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 46, fontWeight: 800, color: C.ink, marginBottom: 6}}>Derselbe Inhalt – zwei Welten:</div>
      <div style={{opacity: a, transform: `translateX(${(1 - a) * -30}px)`}}>
        <DemoBlock good={false} />
        <div style={{...lbl, color: C.red}}>✗ niedriger Kontrast – schwer lesbar</div>
      </div>
      <div style={{opacity: b, transform: `translateX(${(1 - b) * 30}px)`}}>
        <DemoBlock good={true} />
        <div style={{...lbl, color: C.teal}}>✓ hoher Kontrast – klar lesbar</div>
      </div>
    </AbsoluteFill>
  );
};

const RuleScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const ring = spring({frame: f - 10, fps: 30, config: {damping: 13, mass: 0.7}});
  const b = spring({frame: f - 34, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 70, textAlign: 'center'}}>
      <div style={{opacity: a, fontSize: 44, color: C.muted, fontWeight: 700, marginBottom: 24}}>Die Faustregel:</div>
      <div style={{transform: `scale(${0.6 + ring * 0.4})`, opacity: Math.min(1, ring * 1.4),
        border: `8px solid ${C.teal}`, borderRadius: 28, padding: '24px 50px', color: C.teal, fontSize: 96, fontWeight: 900, letterSpacing: 2}}>4,5:1</div>
      <div style={{marginTop: 22, opacity: b, transform: `translateY(${(1 - b) * 18}px)`}}>
        <div style={{fontSize: 40, color: C.ink, fontWeight: 800}}>Mindest-Kontrast für Text</div>
        <div style={{fontSize: 30, color: C.muted, fontWeight: 700, marginTop: 8}}>großer Text & Buttons: 3:1</div>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, marginTop: 16}}>Gratis prüfen: WebAIM Contrast Checker</div>
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
        <div style={{fontSize: 78, color: C.ink, fontWeight: 800, lineHeight: 1.08, marginBottom: 30}}>
          Kontrast ist kein Stil.<br /><span style={{color: C.violet}}>Er ist Funktion.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '24px 50px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 800}}>🔖 Speichern für später</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const FarbeKontrast = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={100}><HookScene /></Sequence>
      <Sequence from={100} durationInFrames={240}><CompareScene /></Sequence>
      <Sequence from={340} durationInFrames={220}><RuleScene /></Sequence>
      <Sequence from={560} durationInFrames={160}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
