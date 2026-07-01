import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const TYPES = [
  {letter: 'A', color: C.violet, icon: '🧩', name: 'Der Baukasten-Bastler', trait: 'Wix zusammengeklickt. Hauptsache online.'},
  {letter: 'B', color: C.gold, icon: '📄', name: 'Das PDF im Header', trait: 'Speisekarte als Bild reingeklatscht.'},
  {letter: 'C', color: C.red, icon: '🎠', name: 'Der Karussell-König', trait: '5 Slider, 3 Pop-ups, Autoplay-Video.'},
  {letter: 'D', color: C.teal, icon: '💻', name: 'Handgecodet', trait: 'Sauber, schnell, gehört dir.'},
];

const TypeCard = ({letter, color, icon, name, trait, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 13, mass: 0.7}});
  return (
    <div style={{
      opacity: p, transform: `scale(${0.8 + p * 0.2}) translateY(${(1 - p) * 30}px)`,
      width: 448, height: 360, boxSizing: 'border-box',
      background: C.card, border: `1px solid ${C.border}`, borderTop: `4px solid ${color}`,
      borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 10,
      boxShadow: `0 16px 40px ${color}18`,
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{width: 62, height: 62, borderRadius: '50%', background: color, color: '#06110f',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, flexShrink: 0}}>{letter}</div>
        <div style={{fontSize: 56}}>{icon}</div>
      </div>
      <div style={{fontSize: 36, fontWeight: 900, color: C.ink, lineHeight: 1.1, marginTop: 6}}>{name}</div>
      <div style={{fontSize: 27, color: C.muted, fontWeight: 600, lineHeight: 1.25}}>{trait}</div>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const p = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const sub = spring({frame: f - 12, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, gap: 28}}>
      <div style={{opacity: p, transform: `scale(${0.88 + p * 0.12})`, fontSize: 84, fontWeight: 900, color: C.ink, lineHeight: 1.06}}>
        Welcher Website-<span style={{color: C.violet}}>Typ</span> bist du?
      </div>
      <div style={{opacity: sub, fontSize: 40, color: C.muted, fontWeight: 700}}>Sei ehrlich. 👀</div>
    </AbsoluteFill>
  );
};

const TypesScene = () => {
  const f = useCurrentFrame();
  const title = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 56px', gap: 32}}>
      <div style={{opacity: title, transform: `translateY(${(1 - title) * -20}px)`, fontSize: 46, fontWeight: 900, color: C.ink, textAlign: 'center'}}>
        Welcher <span style={{color: C.violet}}>Typ</span> bist du?
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '448px 448px', gridTemplateRows: '360px 360px', gap: 24}}>
        {TYPES.map((t, i) => <TypeCard key={t.letter} {...t} delay={10 + i * 34} />)}
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 14}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 24}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 76, color: C.ink, fontWeight: 900, lineHeight: 1.08, marginBottom: 32}}>
          A, B, C oder <span style={{color: C.violet}}>D</span>?
        </div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block'}}>
          <div style={{padding: '26px 50px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 40, fontWeight: 900}}>👇 Kommentier deinen Buchstaben</div>
        </div>
        <div style={{marginTop: 38, fontSize: 36, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebsiteTyp = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 570], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${540 + bgGlowX}px 900px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={90}><HookScene /></Sequence>
      <Sequence from={90} durationInFrames={360}><TypesScene /></Sequence>
      <Sequence from={450} durationInFrames={120}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
