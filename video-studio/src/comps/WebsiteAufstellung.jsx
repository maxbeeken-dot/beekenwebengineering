import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', border: '#26242f', pitch: '#0c2a1a', pitchLine: 'rgba(255,255,255,0.16)',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 4-3-3 Aufstellung. yPct: 0=oben(Sturm) .. 100=unten(Tor). line: Reveal-Reihenfolge.
const PLAYERS = [
  {num: 1, emoji: '🔒', label: 'HTTPS/SSL', x: 50, y: 88, line: 0},
  // Abwehr
  {num: 2, emoji: '⚡', label: 'Ladezeit', x: 20, y: 68, line: 1},
  {num: 3, emoji: '📱', label: 'Mobil', x: 40, y: 71, line: 1},
  {num: 4, emoji: '🔐', label: 'DSGVO', x: 60, y: 71, line: 1},
  {num: 5, emoji: '♿', label: 'Barrierefrei', x: 80, y: 68, line: 1},
  // Mittelfeld
  {num: 6, emoji: '🧭', label: 'Navigation', x: 28, y: 48, line: 2},
  {num: 8, emoji: '🔍', label: 'SEO', x: 50, y: 50, line: 2},
  {num: 10, emoji: '🎯', label: 'Klarer CTA', x: 72, y: 48, line: 2},
  // Sturm
  {num: 7, emoji: '✨', label: 'Design', x: 26, y: 27, line: 3},
  {num: 9, emoji: '⭐', label: 'Social Proof', x: 50, y: 23, line: 3},
  {num: 11, emoji: '📝', label: 'Inhalt', x: 74, y: 27, line: 3},
];
const LINE_START = [64, 108, 160, 212]; // lokale Frames pro Linie in PitchScene
const LINE_NAMES = [
  {t: 'TOR', at: 64, c: C.gold},
  {t: 'ABWEHR', at: 108, c: C.teal},
  {t: 'MITTELFELD', at: 160, c: C.violet},
  {t: 'STURM', at: 212, c: C.red},
];

const Pitch = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: `linear-gradient(180deg, #0e3322 0%, ${C.pitch} 55%, #081d13 100%)`}} />
    {/* Streifen */}
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <div key={i} style={{position: 'absolute', left: 0, right: 0, top: `${i * 12.5}%`, height: '12.5%', background: i % 2 ? 'rgba(255,255,255,0.028)' : 'transparent'}} />
    ))}
    {/* Rahmen + Mittellinie + Kreis */}
    <div style={{position: 'absolute', inset: '60px 60px', border: `3px solid ${C.pitchLine}`, borderRadius: 6}} />
    <div style={{position: 'absolute', left: 60, right: 60, top: '50%', height: 3, background: C.pitchLine}} />
    <div style={{position: 'absolute', left: '50%', top: '50%', width: 200, height: 200, marginLeft: -100, marginTop: -100, border: `3px solid ${C.pitchLine}`, borderRadius: 200}} />
    {/* Strafraum unten */}
    <div style={{position: 'absolute', left: '50%', bottom: 60, width: 420, height: 190, marginLeft: -210, borderLeft: `3px solid ${C.pitchLine}`, borderRight: `3px solid ${C.pitchLine}`, borderTop: `3px solid ${C.pitchLine}`}} />
  </AbsoluteFill>
);

const Jersey = ({p, localF}) => {
  const idx = PLAYERS.filter((q) => q.line === p.line).indexOf(p);
  const start = LINE_START[p.line] + idx * 8;
  const s = spring({frame: localF - start, fps: 30, config: {damping: 13, mass: 0.6}});
  if (s <= 0.001) return null;
  const color = [C.gold, C.teal, C.violet, C.red][p.line];
  return (
    <div style={{position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%,-50%) scale(${s})`, opacity: s, textAlign: 'center', width: 150}}>
      <div style={{width: 96, height: 96, margin: '0 auto', borderRadius: 96, background: C.card, border: `3px solid ${color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 26px ${color}66`}}>
        <div style={{fontSize: 34, lineHeight: 1}}>{p.emoji}</div>
        <div style={{fontSize: 18, fontWeight: 900, color: C.ink, marginTop: 2}}>{p.num}</div>
      </div>
      <div style={{marginTop: 8, fontSize: 24, fontWeight: 800, color: C.ink, textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>{p.label}</div>
    </div>
  );
};

const PitchScene = () => {
  const f = useCurrentFrame();
  const activeLine = [...LINE_NAMES].reverse().find((l) => f >= l.at);
  const banner = activeLine ? spring({frame: f - activeLine.at, fps: 30, config: {damping: 14}}) : 0;
  const complete = f >= 250 ? spring({frame: f - 250, fps: 30, config: {damping: 13, mass: 0.6}}) : 0;
  return (
    <AbsoluteFill>
      <Pitch />
      {PLAYERS.map((p) => <Jersey key={p.num} p={p} localF={f} />)}
      {/* Linien-Banner oben */}
      {activeLine && f < 250 && (
        <div style={{position: 'absolute', top: 90, left: '50%', transform: `translateX(-50%) translateY(${(1 - banner) * -20}px)`, opacity: banner,
          padding: '10px 28px', borderRadius: 12, background: 'rgba(0,0,0,0.55)', border: `2px solid ${activeLine.c}`, backdropFilter: 'blur(4px)'}}>
          <span style={{fontSize: 32, fontWeight: 900, color: activeLine.c, letterSpacing: 3}}>{activeLine.t}</span>
        </div>
      )}
      {/* Komplett-Badge */}
      {complete > 0 && (
        <div style={{position: 'absolute', top: 84, left: '50%', transform: `translateX(-50%) scale(${complete})`, opacity: complete,
          padding: '12px 30px', borderRadius: 14, background: C.teal, color: '#04120f'}}>
          <span style={{fontSize: 30, fontWeight: 900, letterSpacing: 1}}>AUFSTELLUNG KOMPLETT ✅</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const b = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg,#0e3322,#081d13)`, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 24}}>
      <div style={{fontSize: 96, transform: `scale(${a})`}}>⚽</div>
      <div style={{fontSize: 70, fontWeight: 900, color: C.ink, lineHeight: 1.06, opacity: a}}>Die <span style={{color: C.teal}}>Startelf</span><br />deiner Website</div>
      <div style={{fontSize: 32, fontWeight: 700, color: '#cfe9df', opacity: b, transform: `translateY(${(1 - b) * 24}px)`}}>4-3-3 — welche Spieler hast DU? 👇</div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line2 = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg,#0e3322,#06140d)`, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 16}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 60, color: C.ink, fontWeight: 900, lineHeight: 1.12}}>Handgecodet =<br /><span style={{color: C.teal}}>die komplette Startelf</span>.</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 42}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 44px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>👇 Wie viele Stammspieler hat DEINE Seite?</div>
        </div>
        <div style={{marginTop: 32, fontSize: 34, color: '#cfe9df'}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebsiteAufstellung = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <Sequence from={0} durationInFrames={56}><HookScene /></Sequence>
      <Sequence from={56} durationInFrames={320}><PitchScene /></Sequence>
      <Sequence from={376} durationInFrames={130}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
