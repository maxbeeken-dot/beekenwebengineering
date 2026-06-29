import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";
const MONO = "'Menlo','Consolas',monospace";

const STEPS = [
  {t: 'Schrift lädt vom Google-Server', accent: C.muted},
  {t: 'Besucher-IP geht an Google (USA)', accent: C.red},
  {t: '…ohne Einwilligung = DSGVO-Verstoß', accent: C.red},
];

const StepCard = ({t, accent, delay, last}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  return (
    <div style={{opacity: p, transform: `translateY(${(1 - p) * 22}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: 840, background: C.card, border: `1px solid ${C.border}`, borderLeft: `5px solid ${accent}`, borderRadius: 16, padding: '22px 28px', fontSize: 36, fontWeight: 700, color: C.ink, textAlign: 'left'}}>{t}</div>
      {!last && <div style={{fontSize: 40, color: C.dim, margin: '6px 0'}}>↓</div>}
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.86 + pop * 0.14})`, opacity: pop}}>
        <div style={{fontSize: 110}}>😳</div>
        <div style={{fontSize: 72, color: C.ink, fontWeight: 800, lineHeight: 1.12, marginTop: 8}}>
          Diese Schriftart kann<br />dich <span style={{color: C.red}}>abmahnen.</span></div>
        <div style={{marginTop: 28, fontSize: 40, color: C.muted, fontWeight: 700}}>Wenn du Google Fonts falsch einbindest.</div>
      </div>
    </AbsoluteFill>
  );
};

const ProblemScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 44, fontWeight: 800, color: C.ink, marginBottom: 26, textAlign: 'center'}}>Das Problem:</div>
      {STEPS.map((s, i) => <StepCard key={i} {...s} delay={18 + i * 34} last={i === STEPS.length - 1} />)}
    </AbsoluteFill>
  );
};

const ConsequenceScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 9, mass: 0.8}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{opacity: Math.min(1, a * 1.5), border: `8px solid ${C.red}`, borderRadius: 20, padding: '24px 48px', color: C.red, fontSize: 66, fontWeight: 900, letterSpacing: 2, transform: `scale(${0.5 + a * 0.5}) rotate(-6deg)`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>ABGEMAHNT</div>
      <div style={{marginTop: 50, opacity: b, transform: `translateY(${(1 - b) * 20}px)`, fontSize: 44, color: C.muted, fontWeight: 700, lineHeight: 1.3}}>
        Gerichte werteten das als<br />DSGVO-Verstoß. <span style={{color: C.ink}}>Es folgte eine Abmahn-Welle.</span></div>
    </AbsoluteFill>
  );
};

const FixScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  const a = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 46, fps: 30, config: {damping: 15}});
  const codeCard = {width: 900, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px'};
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 22, padding: '0 60px'}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 48, fontWeight: 800, color: C.ink, marginBottom: 8, textAlign: 'center'}}>
        Die <span style={{color: C.teal}}>Lösung</span>: selbst hosten</div>
      <div style={{...codeCard, borderLeft: `5px solid ${C.red}`, opacity: a, transform: `translateX(${(1 - a) * -30}px)`}}>
        <div style={{fontSize: 28, color: C.red, fontWeight: 800, marginBottom: 10}}>❌ vom Google-Server</div>
        <div style={{fontFamily: MONO, fontSize: 26, color: C.muted}}>{'<link href="fonts.googleapis.com/…">'}</div>
      </div>
      <div style={{...codeCard, borderLeft: `5px solid ${C.teal}`, opacity: b, transform: `translateX(${(1 - b) * 30}px)`}}>
        <div style={{fontSize: 28, color: C.teal, fontWeight: 800, marginBottom: 10}}>✅ selbst gehostet</div>
        <div style={{fontFamily: MONO, fontSize: 26, color: C.ink}}>{"@font-face { src: url('/fonts/…') }"}</div>
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
        <div style={{fontSize: 70, color: C.ink, fontWeight: 800, lineHeight: 1.1, marginBottom: 30}}>
          Lädt deine Seite Fonts<br /><span style={{color: C.red}}>von Google?</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '24px 50px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 800}}>🔖 Speichern & checken</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const GoogleFontsAbmahnung = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={100}><HookScene /></Sequence>
      <Sequence from={100} durationInFrames={190}><ProblemScene /></Sequence>
      <Sequence from={290} durationInFrames={120}><ConsequenceScene /></Sequence>
      <Sequence from={410} durationInFrames={190}><FixScene /></Sequence>
      <Sequence from={600} durationInFrames={120}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
