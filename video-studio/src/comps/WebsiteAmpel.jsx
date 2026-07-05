import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";
const HOOK = 56, CHECK = 84, CTA_LEN = 104;

// 4 Checks, typische Baukasten-Seite. verdict: 'red' | 'yellow' | 'green'
const CHECKS = [
  {emoji: '⚡', crit: 'Lädt in unter 2 Sekunden?', verdict: 'red', word: 'ROT', why: 'Baukasten-Ballast bremst — Kunden springen ab.'},
  {emoji: '📱', crit: 'Perfekt auf dem Handy?', verdict: 'yellow', word: 'GELB', why: 'Nur geschrumpft statt fürs Handy gebaut.'},
  {emoji: '🎯', crit: 'Klarer Button / Call-to-Action?', verdict: 'red', word: 'ROT', why: 'Keiner weiß, was zu tun ist — keine Anfrage.'},
  {emoji: '🔒', crit: 'DSGVO-sicher & HTTPS?', verdict: 'yellow', word: 'GELB', why: 'Google-Fonts & Tracker = Abmahnrisiko.'},
];
const COLOR = {red: C.red, yellow: C.gold, green: C.green};

const TrafficLight = ({active, big}) => {
  const size = big ? 78 : 62;
  const lamps = [{k: 'red', c: C.red}, {k: 'yellow', c: C.gold}, {k: 'green', c: C.green}];
  return (
    <div style={{display: 'inline-flex', flexDirection: 'column', gap: 16, padding: 18, borderRadius: 26, background: '#0a0a0d', border: `3px solid ${C.border}`}}>
      {lamps.map((l) => {
        const on = active === l.k;
        return (
          <div key={l.k} style={{width: size, height: size, borderRadius: size, background: on ? l.c : '#1a1a1f',
            boxShadow: on ? `0 0 30px ${l.c}, inset 0 0 10px rgba(255,255,255,0.35)` : 'inset 0 0 8px rgba(0,0,0,0.6)',
            opacity: on ? 1 : 0.4}} />
        );
      })}
    </div>
  );
};

const CheckScene = ({data, index}) => {
  const f = useCurrentFrame();
  const intro = spring({frame: f, fps: 30, config: {damping: 15}});
  // Ampel zyklt rot->gelb->grün->... und landet bei resolveAt auf verdict
  const resolveAt = 44;
  const cycleColors = ['red', 'yellow', 'green'];
  const active = f < resolveAt ? cycleColors[Math.floor(f / 6) % 3] : data.verdict;
  const resolved = f >= resolveAt;
  const stamp = spring({frame: f - resolveAt, fps: 30, config: {damping: 11, mass: 0.7}});
  const vc = COLOR[data.verdict];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 60, gap: 30}}>
      <div style={{opacity: intro, transform: `translateY(${(1 - intro) * -20}px)`, textAlign: 'center'}}>
        <div style={{fontSize: 26, fontWeight: 800, color: C.muted, letterSpacing: 2}}>CHECK {index + 1}/4</div>
        <div style={{fontSize: 46, fontWeight: 900, color: C.ink, marginTop: 10, maxWidth: 820}}>{data.emoji} {data.crit}</div>
      </div>
      <div style={{transform: `scale(${0.9 + intro * 0.1})`, marginTop: 10}}>
        <TrafficLight active={active} big />
      </div>
      {resolved && (
        <div style={{transform: `scale(${stamp})`, opacity: stamp, border: `6px solid ${vc}`, color: vc, padding: '8px 30px', borderRadius: 14, fontSize: 52, fontWeight: 900, letterSpacing: 3}}>
          {data.word}
        </div>
      )}
      {resolved && (
        <div style={{opacity: stamp, fontSize: 29, fontWeight: 600, color: C.ink, textAlign: 'center', maxWidth: 760}}>{data.why}</div>
      )}
    </AbsoluteFill>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const b = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 24}}>
      <div style={{fontSize: 96, transform: `scale(${a})`}}>🚦</div>
      <div style={{fontSize: 66, fontWeight: 900, color: C.ink, lineHeight: 1.08, opacity: a}}>Der Website-<br /><span style={{color: C.gold}}>Ampel-Check</span></div>
      <div style={{fontSize: 32, fontWeight: 700, color: C.muted, opacity: b, transform: `translateY(${(1 - b) * 24}px)`}}>Welche Farbe hat DEINE Seite? 👇</div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line2 = spring({frame: f - 24, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  const g = spring({frame: f - 10, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 22}}>
      <div style={{transform: `scale(${g})`, opacity: g}}><TrafficLight active="green" big /></div>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 28, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 12}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 56, color: C.ink, fontWeight: 900, lineHeight: 1.12}}>Handgecodet =<br /><span style={{color: C.green}}>alles grün</span> 🟢</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 20}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '22px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 32, fontWeight: 900}}>👇 Wie viele grüne Lichter hat DEINE Seite?</div>
        </div>
        <div style={{marginTop: 28, fontSize: 32, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebsiteAmpel = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      {CHECKS.map((c, i) => (
        <Sequence key={i} from={HOOK + i * CHECK} durationInFrames={CHECK}><CheckScene data={c} index={i} /></Sequence>
      ))}
      <Sequence from={HOOK + CHECKS.length * CHECK} durationInFrames={CTA_LEN}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
