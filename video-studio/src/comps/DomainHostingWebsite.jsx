import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const ROWS = [
  {icon: '📍', term: 'Domain', accent: C.violet, lead: 'deine Adresse', detail: 'z. B. deinefirma.de – so finden dich Besucher'},
  {icon: '🗄️', term: 'Hosting', accent: C.teal, lead: 'das Grundstück', detail: 'der Server, auf dem deine Website wohnt'},
  {icon: '🏠', term: 'Website', accent: C.gold, lead: 'das Haus', detail: 'das, was Besucher am Ende sehen'},
];

const AnalogyRow = ({icon, term, accent, lead, detail, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  return (
    <div style={{transform: `translateX(${(1 - p) * -40}px)`, opacity: p,
      display: 'flex', alignItems: 'center', gap: 24, width: 860,
      background: C.card, border: `1px solid ${C.border}`, borderLeft: `5px solid ${accent}`, borderRadius: 18, padding: '22px 28px'}}>
      <div style={{width: 74, height: 74, borderRadius: 16, background: C.cardHi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, flexShrink: 0}}>{icon}</div>
      <div style={{flex: 1, textAlign: 'left'}}>
        <div style={{fontSize: 40, fontWeight: 800, color: C.ink}}>{term} <span style={{color: accent}}>= {lead}</span></div>
        <div style={{fontSize: 27, fontWeight: 600, color: C.muted, marginTop: 4}}>{detail}</div>
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
        <div style={{fontSize: 74, color: C.ink, fontWeight: 800, lineHeight: 1.14}}>
          <span style={{color: C.violet}}>Domain</span> ≠ <span style={{color: C.teal}}>Hosting</span><br />≠ <span style={{color: C.gold}}>Website</span></div>
        <div style={{marginTop: 30, fontSize: 42, color: C.muted, fontWeight: 700}}>Die 3 verwechselt fast jeder.</div>
      </div>
    </AbsoluteFill>
  );
};

const AnalogyScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 22}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 44, fontWeight: 800, color: C.ink, marginBottom: 14}}>
        Stell's dir wie ein <span style={{color: C.gold}}>Haus</span> vor:
      </div>
      {ROWS.map((r, i) => <AnalogyRow key={i} {...r} delay={20 + i * 42} />)}
    </AbsoluteFill>
  );
};

const SynthScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 30, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{opacity: a, transform: `scale(${0.92 + a * 0.08})`, fontSize: 60, fontWeight: 800, color: C.ink, lineHeight: 1.18}}>
        <span style={{color: C.violet}}>Adresse</span> + <span style={{color: C.teal}}>Grundstück</span><br />+ <span style={{color: C.gold}}>Haus</span></div>
      <div style={{marginTop: 28, opacity: b, transform: `translateY(${(1 - b) * 20}px)`, fontSize: 52, fontWeight: 800, color: C.muted}}>
        = deine Website <span style={{color: C.ink}}>online.</span></div>
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
        <div style={{fontSize: 74, color: C.ink, fontWeight: 800, lineHeight: 1.08, marginBottom: 30}}>
          Jetzt weißt du,<br />was <span style={{color: C.violet}}>was ist.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '24px 50px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 800}}>🔖 Speichern für später</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const DomainHostingWebsite = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={96}><HookScene /></Sequence>
      <Sequence from={96} durationInFrames={374}><AnalogyScene /></Sequence>
      <Sequence from={470} durationInFrames={130}><SynthScene /></Sequence>
      <Sequence from={600} durationInFrames={120}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
