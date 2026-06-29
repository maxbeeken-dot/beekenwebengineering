import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const CAUSES = [
  {n: '1', cause: 'Riesige, unkomprimierte Bilder', fix: 'WebP/AVIF + richtige Maße'},
  {n: '2', cause: 'Zu viele Skripte & Plugins', fix: 'entrümpeln, defer/async laden'},
  {n: '3', cause: 'Kein Caching, kein CDN', fix: 'Caching aktivieren + CDN nutzen'},
];

const CauseRow = ({n, cause, fix, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  return (
    <div style={{transform: `translateX(${(1 - p) * -40}px)`, opacity: p,
      display: 'flex', alignItems: 'center', gap: 24, width: 880,
      background: C.card, border: `1px solid ${C.border}`, borderLeft: `5px solid ${C.red}`, borderRadius: 18, padding: '20px 26px'}}>
      <div style={{width: 70, height: 70, borderRadius: 16, background: C.cardHi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900, color: C.violet, flexShrink: 0}}>{n}</div>
      <div style={{flex: 1, textAlign: 'left'}}>
        <div style={{fontSize: 38, fontWeight: 800, color: C.ink}}>{cause}</div>
        <div style={{fontSize: 27, fontWeight: 700, color: C.teal, marginTop: 4}}>✅ {fix}</div>
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
        <div style={{fontSize: 120}}>🐌</div>
        <div style={{fontSize: 78, color: C.ink, fontWeight: 800, lineHeight: 1.1, marginTop: 8}}>
          Warum ist deine<br />Seite <span style={{color: C.red}}>langsam?</span></div>
        <div style={{marginTop: 28, fontSize: 40, color: C.muted, fontWeight: 700}}>Meistens sind es diese 3 Dinge.</div>
      </div>
    </AbsoluteFill>
  );
};

const CauseListScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 22}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 46, fontWeight: 800, color: C.ink, marginBottom: 14, textAlign: 'center'}}>
        Die <span style={{color: C.red}}>Top 3</span> Bremsen:
      </div>
      {CAUSES.map((c, i) => <CauseRow key={i} {...c} delay={20 + i * 40} />)}
    </AbsoluteFill>
  );
};

const CheckScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{opacity: a, transform: `scale(${0.9 + a * 0.1})`, fontSize: 48, color: C.muted, fontWeight: 700}}>So findest du's heraus:</div>
      <div style={{marginTop: 24, opacity: b, transform: `translateY(${(1 - b) * 20}px)`, fontSize: 62, color: C.ink, fontWeight: 800, lineHeight: 1.15}}>
        Google <span style={{color: C.teal}}>PageSpeed</span><br />Insights – gratis.</div>
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
        <div style={{fontSize: 76, color: C.ink, fontWeight: 800, lineHeight: 1.08, marginBottom: 30}}>
          Tempo ist kein Zufall.<br /><span style={{color: C.violet}}>Es ist gebaut.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '24px 50px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 800}}>🔖 Speichern für später</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const SeiteLangsam = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={100}><HookScene /></Sequence>
      <Sequence from={100} durationInFrames={400}><CauseListScene /></Sequence>
      <Sequence from={500} durationInFrames={100}><CheckScene /></Sequence>
      <Sequence from={600} durationInFrames={120}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
