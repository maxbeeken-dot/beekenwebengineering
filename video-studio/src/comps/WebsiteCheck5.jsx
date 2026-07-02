import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const ITEMS = [
  {icon: '📱', q: 'Sieht sie am Handy top aus?'},
  {icon: '⚡', q: 'Lädt sie in unter 3 Sekunden?'},
  {icon: '🔒', q: 'Steht das Schloss (HTTPS) in der Leiste?'},
  {icon: '🎯', q: 'Sofort klar, was du bietest — + 1 Button?'},
  {icon: '📞', q: 'Kontakt in unter 5 Sekunden gefunden?'},
];
const FIRST = 20;
const STEP = 74;

const CheckRow = ({icon, q, n, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 14, mass: 0.7}});
  const stamp = spring({frame: f - (delay + 10), fps: 30, config: {damping: 9, mass: 0.6}});
  return (
    <div style={{
      opacity: p, transform: `translateX(${(1 - p) * -40}px)`,
      display: 'flex', alignItems: 'center', gap: 18, width: 900,
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 24px',
    }}>
      <div style={{width: 54, height: 54, borderRadius: 14, background: C.cardHi, color: C.muted, fontWeight: 900, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{n}</div>
      <span style={{fontSize: 40}}>{icon}</span>
      <span style={{flex: 1, color: C.ink, fontWeight: 700, fontSize: 34, lineHeight: 1.15}}>{q}</span>
      <div style={{width: 56, height: 56, borderRadius: '50%', background: C.teal, color: '#06140f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 900, flexShrink: 0, transform: `scale(${stamp})`}}>✓</div>
    </div>
  );
};

const ChecklistScene = () => {
  const f = useCurrentFrame();
  const title = spring({frame: f, fps: 30, config: {damping: 14}});
  const shown = ITEMS.filter((_, i) => f >= FIRST + i * STEP).length;
  const countPop = spring({frame: f - (FIRST + (shown - 1) * STEP + 10), fps: 30, config: {damping: 10}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 40px', gap: 26}}>
      <div style={{opacity: title, transform: `translateY(${(1 - title) * -26}px)`, textAlign: 'center', marginBottom: 4}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 800, letterSpacing: 3}}>DER 10-SEKUNDEN-CHECK 👀</div>
        <div style={{fontSize: 60, color: C.ink, fontWeight: 900, lineHeight: 1.05, marginTop: 8}}>Wie viele von <span style={{color: C.gold}}>5</span> schaffst du?</div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
        {ITEMS.map((it, i) => <CheckRow key={i} icon={it.icon} q={it.q} n={i + 1} delay={FIRST + i * STEP} />)}
      </div>
      <div style={{marginTop: 10, fontSize: 34, color: C.muted, fontWeight: 700, transform: `scale(${0.9 + countPop * 0.1})`}}>👆 Zähl mit — 1 Punkt pro „Ja"</div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 14}});
  const grade = spring({frame: f - 14, fps: 30, config: {damping: 15}});
  const line2 = spring({frame: f - 30, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 56}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 22}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.1}}>Deine Punktzahl?</div>
      </div>
      <div style={{opacity: grade, transform: `translateY(${(1 - grade) * 18}px)`, marginTop: 26, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
        <div style={{fontSize: 32, color: C.red, fontWeight: 800}}>0–2 → Zeit für ein Update</div>
        <div style={{fontSize: 32, color: C.gold, fontWeight: 800}}>3–4 → solide</div>
        <div style={{fontSize: 32, color: C.teal, fontWeight: 800}}>5 → richtig stark 🔥</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 40}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 46px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 38, fontWeight: 900}}>👇 Wie viele hat DEINE Seite?</div>
        </div>
        <div style={{marginTop: 32, fontSize: 34, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebsiteCheck5 = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 600], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${540 + bgGlowX}px 860px, rgba(52,227,208,0.12), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={470}><ChecklistScene /></Sequence>
      <Sequence from={470} durationInFrames={130}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
