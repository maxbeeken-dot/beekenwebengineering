import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Szenenlängen (30 fps) → 45 + 480 + 45 = 570 = 19,0 s
// STACK bündelt Karte 1–4 + Wende in EINER Sequence, damit sich die
// Definitions-Karten sichtbar stapeln können (getrennte Sequences würden
// frühere Karten wieder unmounten).
const HOOK = 45, STACK = 480, CTA = 45;

// Lokale Geburts-Frames der Karten im STACK-Scene + Wende-Zeitpunkt
const BIRTHS = [0, 105, 210, 315];
const WENDE = 405;
const BASE_TOP = 560, DEPTH_OFFSET = 86;

const CARDS = [
  {q: 'Ein Zettel im Internet, den Fremde finden, wenn sie dich googeln.', sub: '(= bei Google gefunden werden)', emoji: '🔎', accent: C.teal},
  {q: 'Ein Verkäufer, der nie schläft und nie krankfeiert.', sub: '(= verkauft rund um die Uhr)', emoji: '🌙', accent: C.violet},
  {q: 'Der Händedruck, bevor du „Hallo“ sagst — auch für Bewerber.', sub: '(= Vertrauen + zieht Fachkräfte an)', emoji: '🤝', accent: C.gold},
  {q: 'Zu langsam? Kunde weg, bevor sie geladen hat.', sub: '(= Ladezeit = Umsatz)', emoji: '⚡', accent: C.red},
];

// Eine Definitions-Karte im Stapel: poppt rein, rutscht bei jeder neuen Karte
// eine Ebene nach hinten/oben, wischt beim Wende-Beat seitlich raus.
const StackCard = ({i, f, data}) => {
  const entrance = spring({frame: f - BIRTHS[i], fps: 30, config: {damping: 13, mass: 0.6}});
  if (entrance <= 0.001) return null;
  // Tiefe = wie viele spätere Karten schon da sind (weich rampend, kein Sprung)
  let depth = 0;
  for (let j = i + 1; j < BIRTHS.length; j++) {
    depth += interpolate(f - BIRTHS[j], [0, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  }
  const wipe = spring({frame: f - WENDE, fps: 30, config: {damping: 15, mass: 0.7}});
  const dir = i % 2 === 0 ? -1 : 1;
  const rot = Math.sin(i * 2.1) * (1.6 + depth * 0.9);
  const ty = -depth * DEPTH_OFFSET + (1 - entrance) * 70;
  const scale = (1 - depth * 0.05) * (0.74 + entrance * 0.26);
  const wipeX = wipe * dir * 1300;
  const opacity = Math.max(0, (1 - depth * 0.16) * entrance * (1 - wipe));
  const isFront = depth < 0.5;
  return (
    <div style={{
      position: 'absolute', left: '50%', top: BASE_TOP, width: 860,
      transform: `translateX(calc(-50% + ${wipeX}px)) translateY(${ty}px) rotate(${rot}deg) scale(${scale})`,
      opacity, zIndex: i + 1,
      background: isFront ? C.cardHi : C.card, border: `2px solid ${isFront ? data.accent : C.border}`,
      borderRadius: 24, padding: '34px 40px',
      boxShadow: isFront ? `0 26px 70px rgba(0,0,0,0.55), 0 0 40px ${data.accent}22` : '0 18px 44px rgba(0,0,0,0.5)',
    }}>
      <div style={{fontSize: 43, fontWeight: 800, color: C.ink, lineHeight: 1.22, letterSpacing: '-0.01em'}}>
        „{data.q}“
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 20}}>
        <div style={{fontSize: 30}}>{data.emoji}</div>
        <div style={{fontSize: 27, fontWeight: 700, color: C.teal}}>{data.sub}</div>
      </div>
    </div>
  );
};

// Beat 1: Hook — Titel springt rein
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 12, mass: 0.7}});
  const b = spring({frame: f - 12, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.3) * 0.05;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, gap: 26}}>
      <div style={{fontSize: 92, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.86 + a * 0.14})`, lineHeight: 1.06}}>
        Deine Website.<br />
        <span style={{color: C.violet}}>Schlecht erklärt.</span>{' '}
        <span style={{display: 'inline-block', transform: `scale(${pulse})`}}>🫠</span>
      </div>
      <div style={{fontSize: 34, fontWeight: 800, letterSpacing: 2, color: C.teal, opacity: b, transform: `translateY(${(1 - b) * 18}px)`}}>
        Was sie WIRKLICH für dich tut ↓
      </div>
    </AbsoluteFill>
  );
};

// Beat 2–6: Karten stapeln sich, dann Wende
const StackScene = () => {
  const f = useCurrentFrame();
  const label = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const wende = spring({frame: f - WENDE, fps: 30, config: {damping: 15, mass: 0.7}});
  const reveal = spring({frame: f - (WENDE + 18), fps: 30, config: {damping: 14, mass: 0.6}});
  const revealSub = spring({frame: f - (WENDE + 40), fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      {/* Teal-Gradient schiebt sich im Wende-Beat übers Violett (violett→teal) */}
      <AbsoluteFill style={{background: 'radial-gradient(940px 940px at 540px 940px, rgba(52,227,208,0.16), transparent 70%)', opacity: wende}} />
      {/* Kopf-Label */}
      <div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', opacity: label * (1 - wende), transform: `translateY(${(1 - label) * -16}px)`}}>
        <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 6, color: C.teal}}>DEINE WEBSITE — SCHLECHT ERKLÄRT</div>
      </div>
      {/* Der Stapel */}
      {CARDS.map((d, i) => <StackCard key={i} i={i} f={f} data={d} />)}
      {/* Wende-Auflösung */}
      <div style={{position: 'absolute', top: 700, left: 0, right: 0, textAlign: 'center', padding: '0 70px', opacity: reveal}}>
        <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 4, color: C.teal, transform: `translateY(${(1 - reveal) * -14}px)`}}>RICHTIG ERKLÄRT</div>
        <div style={{fontSize: 66, fontWeight: 900, color: C.ink, lineHeight: 1.14, marginTop: 16, transform: `scale(${0.92 + reveal * 0.08})`}}>
          Deine <span style={{color: C.teal}}>24/7-Kundengewinnung</span>.
        </div>
        <div style={{fontSize: 30, fontWeight: 700, color: C.muted, marginTop: 20, opacity: revealSub, transform: `translateY(${(1 - revealSub) * 16}px)`}}>
          Kunden. Vertrauen. Bewerber. Tempo.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Beat 7: CTA
const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 12, fps: 30, config: {damping: 15}});
  const bait = spring({frame: f - 24, fps: 30, config: {damping: 16}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 20}}>
      <div style={{opacity: pop, transform: `scale(${0.9 + pop * 0.1})`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 60, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>
          Deine Website <span style={{color: C.violet}}>bauen lassen</span> →
        </div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`, marginTop: 22}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 24, fontSize: 30, fontWeight: 700, color: C.gold, maxWidth: 820, lineHeight: 1.3}}>
        Erklär DEINEN Job mal absichtlich schlecht ↓
      </div>
    </AbsoluteFill>
  );
};

export const SchlechtErklaert = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(780px 780px at 540px 640px, rgba(124,92,255,0.12), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={STACK}><StackScene /></Sequence>
      <Sequence from={HOOK + STACK} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
