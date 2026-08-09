// „Der Floskel-Decoder" — Säule 1 (Websites).
// Unbespieltes Thema: die Texte auf der Website. Vier Sätze, die auf fast jeder Firmenseite
// stehen — daneben, was der Kunde tatsächlich daraus liest (nämlich nichts).
// Neues Format im Bestand: Decoder/Übersetzung (links Behauptung, rechts Wirkung).
//
// Dramaturgie folgt dem „Told you so"-Muster (aktuell starkes Format): Behauptung → Beweis.
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 4 Sätze)
// · LossTag · YouAre (Unity) · PeakFlash (Peak-End) · LoopSeam (Rewatch).
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {OpenLoop, StepProgress, LossTag, YouAre, PeakFlash, LoopSeam} from './Psych.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 30 fps → 600 Frames = 20 s
const HOOK = 90, DECODE = 280, POINT = 70, FIX = 100, CTA = 60;
const OPEN_Q = 'Was liest dein Kunde wirklich?';

// ---------- 1) Hook ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 6, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 34, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 60, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 74, gap: 22}}>
      <div style={{opacity: a, fontSize: 62, fontWeight: 900, color: C.ink, lineHeight: 1.16, maxWidth: 930}}>
        Diese 4 Sätze stehen<br />auf fast jeder Website.
      </div>
      <div style={{
        opacity: b, background: C.card, border: `2px solid ${C.border}`, borderRadius: 18,
        padding: '18px 26px', fontSize: 31, color: C.muted, fontWeight: 700, lineHeight: 1.35, maxWidth: 880,
      }}>„Wir sind ein junges, dynamisches Team mit<br />individuellen Lösungen für jeden Bedarf."</div>
      <div style={{opacity: c, fontSize: 35, fontWeight: 900, color: C.gold, marginTop: 4}}>
        Keiner davon verkauft. 👀
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2) Der Decoder ----------
const PHRASES = [
  {at: 10,  says: '„Ein junges, dynamisches Team"',        reads: 'Wir wissen selbst nicht, was uns auszeichnet.'},
  {at: 78,  says: '„Ihr zuverlässiger Partner"',            reads: 'Schreibt die Konkurrenz wortgleich.'},
  {at: 146, says: '„Qualität seit 1998"',                   reads: 'Eine Jahreszahl ist kein Beweis.'},
  {at: 214, says: '„Individuelle Lösungen für jeden Bedarf"', reads: 'Ich weiß immer noch nicht, was ihr macht.'},
];

const DecodeRow = ({localF, p}) => {
  const s = spring({frame: localF - p.at, fps: 30, config: {damping: 16, mass: 0.75}});
  const flip = spring({frame: localF - p.at - 26, fps: 30, config: {damping: 15}});
  if (s <= 0.001) return null;
  return (
    <div style={{opacity: s, transform: `translateY(${(1 - s) * 22}px)`, width: 930}}>
      <div style={{
        background: C.card, border: `2px solid ${C.border}`, borderRadius: 16,
        padding: '16px 22px', fontSize: 31, fontWeight: 800, color: C.ink, textAlign: 'left',
      }}>{p.says}</div>
      <div style={{
        opacity: flip, transform: `translateX(${(1 - flip) * 30}px)`,
        display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, paddingLeft: 22,
      }}>
        <span style={{color: C.red, fontSize: 28, fontWeight: 900}}>→</span>
        <span style={{fontSize: 27, fontWeight: 800, color: C.red, textAlign: 'left'}}>{p.reads}</span>
      </div>
    </div>
  );
};

const DecodeScene = () => {
  const f = useCurrentFrame();
  const done = PHRASES.filter(p => f > p.at + 26).length;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '244px 40px 56px', gap: 14}}>
      <StepProgress current={done} total={4} color={C.red} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 20, marginTop: 30}}>
        {PHRASES.map((p, i) => <DecodeRow key={i} localF={f} p={p} />)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3) Der Punkt ----------
const PointScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 24}}>
      <PeakFlash at={3} color={C.red} strength={0.2} />
      <div style={{opacity: a, fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 930}}>
        Adjektive kann jeder<br />über sich schreiben.<br />
        <span style={{color: C.gold}}>Deshalb glaubt sie keiner.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Vier Sätze, null Unterschied zur Konkurrenz." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Lösung: konkret statt Floskel ----------
const FIXES = [
  {at: 16, t: 'Wir sind in 48 Stunden bei Ihnen.'},
  {at: 46, t: 'Festpreis vorab, schriftlich.'},
  {at: 76, t: 'Meisterbetrieb, 12 Leute, Bad Homburg.'},
];

const FixScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, gap: 20}}>
      <PeakFlash at={2} color={C.green} strength={0.18} />
      <div style={{opacity: a, fontSize: 34, fontWeight: 900, color: C.green, letterSpacing: 3, textTransform: 'uppercase'}}>
        Was stattdessen wirkt
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4}}>
        {FIXES.map((x, i) => {
          const s = spring({frame: f - x.at, fps: 30, config: {damping: 16}});
          if (s <= 0.001) return null;
          return (
            <div key={i} style={{
              opacity: s, transform: `translateX(${(1 - s) * -30}px)`, width: 880,
              background: C.card, border: `2px solid ${C.green}55`, borderRadius: 16,
              padding: '18px 24px', fontSize: 32, fontWeight: 800, color: C.ink, textAlign: 'left',
            }}>✓ {x.t}</div>
          );
        })}
      </div>
      <div style={{opacity: spring({frame: f - 108, fps: 30, config: {damping: 15}}), maxWidth: 880, marginTop: 10}}>
        <YouAre text="Konkret klingt weniger nach Werbung. Genau deshalb wirkt es." color={C.green} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5) CTA ----------
const CtaScene = () => {
  const f = useCurrentFrame();
  const q = spring({frame: f, fps: 30, config: {damping: 15}});
  const line = spring({frame: f - 16, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f / 7) * 0.02;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, gap: 16}}>
      <div style={{opacity: q, fontSize: 38, fontWeight: 900, color: C.gold, lineHeight: 1.25, maxWidth: 890}}>
        👇 Welche Floskel steht<br />auf DEINER Website?
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700}}>Ehrlich abtippen in die Kommentare.</div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{fontSize: 25, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 46, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
          Texte, die etwas<br /><span style={{color: C.teal}}>Konkretes</span> sagen
        </div>
      </div>
      <div style={{opacity: line, marginTop: 14}}>
        <div style={{transform: `scale(${pulse})`, padding: '18px 36px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 30, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FloskelDecoder = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(820px 820px at 540px 540px, rgba(124,92,255,0.09), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={DECODE}><DecodeScene /></Sequence>
      <Sequence from={HOOK + DECODE} durationInFrames={POINT}><PointScene /></Sequence>
      <Sequence from={HOOK + DECODE + POINT} durationInFrames={FIX}><FixScene /></Sequence>
      <Sequence from={HOOK + DECODE + POINT + FIX} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + DECODE + POINT}>
        <OpenLoop text={OPEN_Q} hint="4 Sätze · Auflösung am Ende" color={C.violet} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
