import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const ROWS = [
  {kind: 'hover', label: 'Hover-Feedback', sub: 'zeigt, was klickbar ist'},
  {kind: 'confirm', label: 'Klick-Bestätigung', sub: 'bestätigt jede Aktion'},
  {kind: 'reveal', label: 'Scroll-Reveal', sub: 'führt den Blick zum Angebot'},
  {kind: 'pulse', label: 'Mikro-Bewegung', sub: 'hält Aufmerksamkeit & Vertrauen'},
];

// Mini-Demo-Widget, das die jeweilige Micro-Interaction live zeigt
const Demo = ({kind, lf}) => {
  if (kind === 'hover') {
    const s = 1 + Math.sin(lf * 0.16) * 0.14;
    const g = 8 + (Math.sin(lf * 0.16) * 0.5 + 0.5) * 16;
    return <div style={{width: 48, height: 30, borderRadius: 8, background: C.violet, transform: `scale(${s})`, boxShadow: `0 0 ${g}px rgba(124,92,255,0.7)`}} />;
  }
  if (kind === 'confirm') {
    const cyc = lf % 90;
    const done = cyc > 46;
    const pop = done ? Math.min(1, (cyc - 46) / 9) : 0;
    return done
      ? <div style={{width: 46, height: 46, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04201c', fontSize: 28, fontWeight: 900, transform: `scale(${pop})`}}>✓</div>
      : <div style={{width: 48, height: 30, borderRadius: 8, background: C.violet}} />;
  }
  if (kind === 'reveal') {
    const c = (lf % 78) / 78;
    const y = interpolate(c, [0, 0.4, 1], [22, 0, 0]);
    const o = interpolate(c, [0, 0.4, 0.85, 1], [0, 1, 1, 0]);
    return <div style={{transform: `translateY(${y}px)`, opacity: o, width: 52, height: 11, borderRadius: 6, background: C.teal}} />;
  }
  const sc = 1 + Math.sin(lf * 0.2) * 0.2;
  return <div style={{width: 22, height: 22, borderRadius: '50%', background: C.violet, transform: `scale(${sc})`, boxShadow: '0 0 14px rgba(124,92,255,0.75)'}} />;
};

const DemoRow = ({kind, label, sub, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  const lf = Math.max(0, f - delay);
  return (
    <div style={{transform: `translateX(${(1 - p) * -40}px)`, opacity: p,
      display: 'flex', alignItems: 'center', gap: 24, width: 840,
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: '20px 26px'}}>
      <div style={{width: 84, height: 84, borderRadius: 16, background: C.cardHi, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <Demo kind={kind} lf={lf} />
      </div>
      <div style={{flex: 1, textAlign: 'left'}}>
        <div style={{fontSize: 38, fontWeight: 800, color: C.ink}}>{label}</div>
        <div style={{fontSize: 27, fontWeight: 600, color: C.muted, marginTop: 4}}>{sub}</div>
      </div>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.05;
  const glow = 24 + (Math.sin(f * 0.16) * 0.5 + 0.5) * 26;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.86 + pop * 0.14})`, opacity: pop}}>
        <div style={{fontSize: 86, color: C.ink, fontWeight: 800, lineHeight: 1.08}}>
          Diese <span style={{color: C.violet}}>Animation</span><br />verkauft.</div>
        <div style={{marginTop: 56, display: 'inline-block', transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 50px', background: C.violet, borderRadius: 16, color: '#fff', fontSize: 40, fontWeight: 800, boxShadow: `0 0 ${glow}px rgba(124,92,255,0.7)`}}>Jetzt anfragen →</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ReframeScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 16}});
  const strike = interpolate(f, [24, 52], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const b = spring({frame: f - 60, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center', gap: 48}}>
      <div style={{opacity: a, transform: `translateY(${(1 - a) * -20}px)`, position: 'relative', display: 'inline-block'}}>
        <div style={{fontSize: 62, color: C.dim, fontWeight: 800}}>Animation ist Deko.</div>
        <div style={{position: 'absolute', top: '52%', left: 0, height: 6, background: C.red, width: `${strike}%`, borderRadius: 3}} />
      </div>
      <div style={{opacity: b, transform: `translateY(${(1 - b) * 24}px)`}}>
        <div style={{fontSize: 72, color: C.ink, fontWeight: 800, lineHeight: 1.1}}>
          Sie ist ein<br /><span style={{color: C.teal}}>Verkaufs-Werkzeug.</span></div>
      </div>
    </AbsoluteFill>
  );
};

const ListScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 20}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 46, fontWeight: 800, color: C.ink, marginBottom: 14, textAlign: 'center'}}>
        Bewegung, die <span style={{color: C.teal}}>konvertiert:</span>
      </div>
      {ROWS.map((r, i) => <DemoRow key={i} kind={r.kind} label={r.label} sub={r.sub} delay={20 + i * 30} />)}
    </AbsoluteFill>
  );
};

const RestraintScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{opacity: a, transform: `scale(${0.9 + a * 0.1})`, fontSize: 70, color: C.ink, fontWeight: 800}}>Aber: weniger ist mehr.</div>
      <div style={{marginTop: 34, opacity: b, transform: `translateY(${(1 - b) * 22}px)`, fontSize: 50, color: C.muted, fontWeight: 700, lineHeight: 1.25}}>
        Gezielt <span style={{color: C.teal}}>führt.</span><br />Überall <span style={{color: C.red}}>= Chaos.</span></div>
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
          Bewegung, die<br /><span style={{color: C.violet}}>verkauft.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '26px 52px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 38, fontWeight: 800}}>Kommentier „MOTION" → Beispiele</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const AnimationenVerkaufen = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={100}><HookScene /></Sequence>
      <Sequence from={100} durationInFrames={130}><ReframeScene /></Sequence>
      <Sequence from={230} durationInFrames={290}><ListScene /></Sequence>
      <Sequence from={520} durationInFrames={90}><RestraintScene /></Sequence>
      <Sequence from={610} durationInFrames={110}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
