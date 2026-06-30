import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const BANDS = [
  {range: '0–49', label: 'langsam', color: C.red},
  {range: '50–89', label: 'ok – Luft nach oben', color: C.gold},
  {range: '90–100', label: 'schnell – dein Ziel', color: C.teal},
];

const METRICS = [
  {abbr: 'LCP', plain: 'Lädt der Hauptinhalt schnell?', target: 'Ziel: unter 2,5 s'},
  {abbr: 'INP', plain: 'Reagiert die Seite flott?', target: 'Ziel: unter 200 ms'},
  {abbr: 'CLS', plain: 'Springt nichts beim Laden?', target: 'Ziel: unter 0,1'},
];

const ScoreRing = ({score, color}) => {
  const r = 150, sw = 26, c = 2 * Math.PI * r;
  const off = c * (1 - score / 100);
  return (
    <svg width={360} height={360} viewBox="0 0 360 360">
      <circle cx="180" cy="180" r={r} fill="none" stroke={C.cardHi} strokeWidth={sw} />
      <circle cx="180" cy="180" r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 180 180)" />
      <text x="180" y="182" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="120" fontWeight="800" fontFamily={FONT}>{Math.round(score)}</text>
    </svg>
  );
};

const BandRow = ({range, label, color, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  return (
    <div style={{opacity: p, transform: `translateX(${(1 - p) * -36}px)`,
      display: 'flex', alignItems: 'center', gap: 20, width: 840,
      background: C.card, border: `1px solid ${C.border}`, borderLeft: `6px solid ${color}`, borderRadius: 16, padding: '20px 28px'}}>
      <span style={{minWidth: 170, fontSize: 42, fontWeight: 900, color}}>{range}</span>
      <span style={{flex: 1, fontSize: 34, fontWeight: 700, color: C.ink, textAlign: 'left'}}>{label}</span>
    </div>
  );
};

const MetricRow = ({abbr, plain, target, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  return (
    <div style={{opacity: p, transform: `translateX(${(1 - p) * -36}px)`,
      display: 'flex', alignItems: 'center', gap: 20, width: 860,
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 24px'}}>
      <div style={{minWidth: 104, height: 72, borderRadius: 14, background: C.cardHi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900, color: C.violet, flexShrink: 0}}>{abbr}</div>
      <div style={{flex: 1, textAlign: 'left'}}>
        <div style={{fontSize: 31, fontWeight: 800, color: C.ink}}>{plain}</div>
        <div style={{fontSize: 26, fontWeight: 700, color: C.teal, marginTop: 4}}>{target}</div>
      </div>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const sc = spring({frame: f - 8, fps: 30, config: {damping: 18}});
  const score = interpolate(sc, [0, 1], [0, 47]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{opacity: pop, fontSize: 40, color: C.muted, fontWeight: 700, marginBottom: 8}}>Dein PageSpeed-Score:</div>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}><ScoreRing score={score} color={C.red} /></div>
      <div style={{marginTop: 14, fontSize: 52, color: C.ink, fontWeight: 800}}>Was heißt das? 😬</div>
    </AbsoluteFill>
  );
};

const BandsScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 20}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 46, fontWeight: 800, color: C.ink, marginBottom: 12}}>Der Score von <span style={{color: C.teal}}>0–100</span>:</div>
      {BANDS.map((b, i) => <BandRow key={i} {...b} delay={20 + i * 34} />)}
    </AbsoluteFill>
  );
};

const MetricsScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 18}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 44, fontWeight: 800, color: C.ink, marginBottom: 8, textAlign: 'center', lineHeight: 1.15}}>
        Die 3 Werte dahinter<br /><span style={{color: C.muted, fontSize: 30, fontWeight: 700}}>(Core Web Vitals)</span></div>
      {METRICS.map((m, i) => <MetricRow key={i} {...m} delay={20 + i * 36} />)}
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
        <div style={{fontSize: 80, color: C.ink, fontWeight: 800, lineHeight: 1.08, marginBottom: 20}}>
          <span style={{color: C.teal}}>90+</span> ist das Ziel.</div>
        <div style={{fontSize: 34, color: C.muted, fontWeight: 700, marginBottom: 30}}>Gratis messen: Google PageSpeed Insights.</div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 4}}>
          <div style={{padding: '24px 50px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 800}}>🔖 Speichern für später</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const PageSpeedScore = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={100}><HookScene /></Sequence>
      <Sequence from={100} durationInFrames={200}><BandsScene /></Sequence>
      <Sequence from={300} durationInFrames={300}><MetricsScene /></Sequence>
      <Sequence from={600} durationInFrames={120}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
