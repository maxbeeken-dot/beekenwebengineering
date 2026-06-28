import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const COSTS = [
  'Besucher, die nach 3 Sek. abspringen',
  'Kunden, die der Konkurrenz vertrauen',
  'Anfragen, die nie ankommen',
  'Eine Marke, die austauschbar wirkt',
];

const CostRow = ({label, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  return (
    <div style={{transform: `translateX(${(1 - p) * -40}px)`, opacity: p,
      display: 'flex', alignItems: 'center', gap: 24, width: 820,
      background: C.card, border: `1px solid ${C.border}`, borderLeft: `5px solid ${C.red}`, borderRadius: 18, padding: '22px 28px'}}>
      <div style={{width: 60, height: 60, borderRadius: 14, background: 'rgba(255,84,104,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, color: C.red, flexShrink: 0}}>↓</div>
      <div style={{flex: 1, fontSize: 36, fontWeight: 700, color: C.ink, textAlign: 'left'}}>{label}</div>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.86 + pop * 0.14})`, opacity: pop}}>
        <div style={{fontSize: 120}}>💸</div>
        <div style={{fontSize: 84, color: C.ink, fontWeight: 800, lineHeight: 1.08, marginTop: 16}}>
          Was kostet eine<br />Website <span style={{color: C.violet}}>wirklich?</span></div>
      </div>
    </AbsoluteFill>
  );
};

const FlipScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 16}});
  const strike = interpolate(f, [26, 56], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const b = spring({frame: f - 64, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center', gap: 50}}>
      <div style={{opacity: a, transform: `translateY(${(1 - a) * -20}px)`}}>
        <div style={{fontSize: 30, color: C.muted, fontWeight: 700, letterSpacing: 3, marginBottom: 16}}>DIE FALSCHE FRAGE</div>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{fontSize: 54, color: C.dim, fontWeight: 800}}>„Was kostet eine gute Website?"</div>
          <div style={{position: 'absolute', top: '52%', left: 0, height: 6, background: C.red, width: `${strike}%`, borderRadius: 3}} />
        </div>
      </div>
      <div style={{opacity: b, transform: `translateY(${(1 - b) * 24}px)`}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 3, marginBottom: 16}}>DIE RICHTIGE FRAGE</div>
        <div style={{fontSize: 72, color: C.ink, fontWeight: 800, lineHeight: 1.1}}>
          Was kostet dich eine<br /><span style={{color: C.red}}>schlechte?</span></div>
      </div>
    </AbsoluteFill>
  );
};

const CostListScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 20}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 46, fontWeight: 800, color: C.ink, marginBottom: 14, textAlign: 'center', lineHeight: 1.12}}>
        Eine <span style={{color: C.red}}>billige</span> Website<br />kostet dich:
      </div>
      {COSTS.map((label, i) => <CostRow key={i} label={label} delay={20 + i * 30} />)}
    </AbsoluteFill>
  );
};

const ValueScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 28, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{opacity: a, transform: `scale(${0.9 + a * 0.1})`, fontSize: 58, color: C.muted, fontWeight: 800, lineHeight: 1.15}}>
        Eine gute Website ist<br />keine <span style={{color: C.red}}>Ausgabe.</span>
      </div>
      <div style={{marginTop: 38, opacity: b, transform: `translateY(${(1 - b) * 22}px)`, fontSize: 72, color: C.ink, fontWeight: 800, lineHeight: 1.1}}>
        Sie ist eine <span style={{color: C.teal}}>Investition</span>,<br />die dir <span style={{color: C.violet}}>gehört.</span>
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
        <div style={{fontSize: 80, color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 30}}>
          Investier in etwas,<br /><span style={{color: C.violet}}>das dir gehört.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '26px 52px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 38, fontWeight: 800}}>Kommentier „WEBSITE" → ehrlicher Check</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebsiteKosten = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={96}><HookScene /></Sequence>
      <Sequence from={96} durationInFrames={154}><FlipScene /></Sequence>
      <Sequence from={250} durationInFrames={250}><CostListScene /></Sequence>
      <Sequence from={500} durationInFrames={100}><ValueScene /></Sequence>
      <Sequence from={600} durationInFrames={120}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
