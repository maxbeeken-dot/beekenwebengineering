import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const ROWS = [
  {ki: 'Sieht aus wie 1000 andere', code: 'Einzigartig für dich'},
  {ki: 'Aufgeblähter Code → langsam', code: 'Sauber & schnell'},
  {ki: 'Bricht bei Sonderwünschen', code: 'Baubar wie du willst'},
  {ki: 'SEO = Glückssache', code: 'Für Google gebaut'},
];

const CompareRow = ({ki, code, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  const cell = {flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 22px', fontSize: 30, fontWeight: 700, textAlign: 'left'};
  return (
    <div style={{display: 'flex', gap: 16, width: 920, opacity: p, transform: `translateY(${(1 - p) * 24}px)`}}>
      <div style={{...cell, borderLeft: `5px solid ${C.red}`, color: C.muted}}>{ki}</div>
      <div style={{...cell, borderLeft: `5px solid ${C.teal}`, color: C.ink}}>{code}</div>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.86 + pop * 0.14})`, opacity: pop}}>
        <div style={{fontSize: 80, color: C.ink, fontWeight: 800, lineHeight: 1.1}}>
          <span style={{color: C.teal}}>Code</span> vs. <span style={{color: C.red}}>KI</span>-Website</div>
        <div style={{marginTop: 30, fontSize: 42, color: C.muted, fontWeight: 700}}>Was die KI dir verschweigt.</div>
      </div>
    </AbsoluteFill>
  );
};

const PromiseScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 46, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{opacity: a, transform: `scale(${0.9 + a * 0.1})`}}>
        <div style={{fontSize: 120}}>🤖</div>
        <div style={{fontSize: 64, color: C.ink, fontWeight: 800, lineHeight: 1.12, marginTop: 6}}>Fertig in 30 Sek.</div>
      </div>
      <div style={{marginTop: 34, opacity: b, transform: `translateY(${(1 - b) * 20}px)`, fontSize: 46, color: C.muted, fontWeight: 700}}>
        Sieht <span style={{color: C.ink}}>erstmal</span> gut aus.</div>
    </AbsoluteFill>
  );
};

const ComparisonScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 14}}>
      <div style={{display: 'flex', gap: 16, width: 920, opacity: head, transform: `translateY(${(1 - head) * -20}px)`, marginBottom: 6}}>
        <div style={{flex: 1, textAlign: 'center', fontSize: 38, fontWeight: 900, color: C.red}}>🤖 KI-Website</div>
        <div style={{flex: 1, textAlign: 'center', fontSize: 38, fontWeight: 900, color: C.teal}}>{'</> Echter Code'}</div>
      </div>
      {ROWS.map((r, i) => <CompareRow key={i} ki={r.ki} code={r.code} delay={18 + i * 26} />)}
    </AbsoluteFill>
  );
};

const ReframeScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{opacity: a, transform: `scale(${0.9 + a * 0.1})`, fontSize: 74, color: C.ink, fontWeight: 800, lineHeight: 1.12}}>
        KI ist ein <span style={{color: C.violet}}>Werkzeug.</span></div>
      <div style={{marginTop: 30, opacity: b, transform: `translateY(${(1 - b) * 22}px)`, fontSize: 66, color: C.muted, fontWeight: 800}}>
        Kein <span style={{color: C.teal}}>Web-Engineer.</span></div>
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
        <div style={{fontSize: 78, color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 30}}>
          Gebaut von Hand.<br /><span style={{color: C.violet}}>Gebaut für dich.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '26px 52px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 38, fontWeight: 800}}>Kommentier „CODE" → so geht's</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const CodeVsKI = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={100}><HookScene /></Sequence>
      <Sequence from={100} durationInFrames={110}><PromiseScene /></Sequence>
      <Sequence from={210} durationInFrames={310}><ComparisonScene /></Sequence>
      <Sequence from={520} durationInFrames={90}><ReframeScene /></Sequence>
      <Sequence from={610} durationInFrames={110}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
