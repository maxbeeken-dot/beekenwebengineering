// „Die Gabelung" — Säule 1 (Websites).
//
// NEUES FORMAT im Bestand: zwei parallele Wege nebeneinander, die Schritt für Schritt
// gleichzeitig laufen und am Ende auseinandergehen. Bisher gab es Karten-Stapel,
// Zeitleisten, Suchleiste, Doku-Rahmen und Drei-Band — aber nie zwei Spalten im Gleichlauf.
// (DasFundament vergleicht zwar zwei Websites, aber statisch als Bild, ohne Verlauf.)
//
// UNBESPIELTES THEMA: „Preis auf Anfrage". WebsiteKosten (nie veröffentlicht) behandelt,
// was eine Website kostet — hier geht es um die Preisangabe auf der Kundenseite und was
// ihr Fehlen auslöst.
//
// Die Zahlen im Beispiel sind Illustration aus einem fremden Gewerk (Badsanierung), damit
// nichts als BWE-Preisversprechen missverstanden wird.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 3 Schritte)
// · LossTag · YouAre (Unity) · PeakFlash · LoopSeam.
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
const HOOK = 105, PATHS = 275, TWIST = 85, FIX = 85, CTA = 50;
const OPEN_Q = 'Welcher der beiden ruft an?';

// ---------- 1) Hook ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 36, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 72, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 76, gap: 26}}>
      <div style={{opacity: a, fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1.18, maxWidth: 920}}>
        Zwei Kunden.<br />Dieselbe Leistung.<br />Dieselbe Stadt.
      </div>
      <div style={{
        opacity: b, background: C.card, border: `2px solid ${C.border}`, borderRadius: 18,
        padding: '20px 28px', fontSize: 32, color: C.muted, fontWeight: 700, lineHeight: 1.35, maxWidth: 880,
      }}>
        Beide suchen jemanden fürs Bad.<br />Beide landen auf einer Website.
      </div>
      <div style={{opacity: c, fontSize: 34, fontWeight: 900, color: C.gold}}>
        Nur einer ruft an. 👀
      </div>
      <PeakFlash at={72} color={C.gold} strength={0.13} />
    </AbsoluteFill>
  );
};

// ---------- 2) Die zwei Wege ----------
const SCHRITTE = [
  {
    label: 'Er liest die Seite',
    links: '„Preis auf Anfrage"',
    rechts: '„Komplettbad ab 8.000 €"',
  },
  {
    label: 'Er denkt',
    links: 'Wird schon teuer sein.',
    rechts: 'Passt ungefähr. Gut zu wissen.',
  },
  {
    label: 'Er handelt',
    links: 'Schließt den Tab.',
    rechts: 'Ruft an – und fragt nach Details.',
  },
];
const S_LEN = 92;

const Weg = ({titel, text, ton, sichtbar, s}) => (
  <div style={{
    flex: 1, minHeight: 300, boxSizing: 'border-box',
    background: C.card, border: `2px solid ${ton}55`, borderRadius: 20,
    padding: '22px 22px', textAlign: 'left',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12,
    opacity: sichtbar ? 1 : 0.3,
  }}>
    <div style={{fontSize: 23, fontWeight: 900, color: ton, letterSpacing: 3, textTransform: 'uppercase'}}>
      {titel}
    </div>
    <div style={{
      fontSize: 33, fontWeight: 900, color: C.ink, lineHeight: 1.22,
      opacity: sichtbar ? Math.max(0.001, s) : 1,
    }}>{sichtbar ? text : '• • •'}</div>
  </div>
);

const PathScene = () => {
  const f = useCurrentFrame();
  const idx = Math.min(SCHRITTE.length - 1, Math.floor(f / S_LEN));
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '250px 34px 56px'}}>
      <StepProgress current={idx + 1} total={3} color={C.teal} />
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 22, marginTop: 24,
        minHeight: 1440, justifyContent: 'space-between', width: 1012,
      }}>
        {SCHRITTE.map((sch, i) => {
          const local = f - i * S_LEN;
          const s = spring({frame: local - 6, fps: 30, config: {damping: 16, mass: 0.8}});
          const sichtbar = i <= idx;
          return (
            <div key={i} style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              <div style={{
                fontSize: 26, fontWeight: 900, color: sichtbar ? C.muted : C.dim,
                letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center',
              }}>{sch.label}</div>
              <div style={{display: 'flex', gap: 18}}>
                <Weg titel="Seite A" text={sch.links}  ton={C.red}   sichtbar={sichtbar} s={s} />
                <Weg titel="Seite B" text={sch.rechts} ton={C.green} sichtbar={sichtbar} s={s} />
              </div>
            </div>
          );
        })}
      </div>
      <PeakFlash at={2 * S_LEN + 8} color={C.red} strength={0.16} />
    </AbsoluteFill>
  );
};

// ---------- 3) Die Wendung ----------
const TwistScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 40, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 26}}>
      <PeakFlash at={2} color={C.gold} strength={0.2} />
      <div style={{opacity: a, fontSize: 50, fontWeight: 900, color: C.ink, lineHeight: 1.22, maxWidth: 930}}>
        „Preis auf Anfrage" filtert<br />nicht die Sparsamen raus.<br />
        <span style={{color: C.gold}}>Es filtert die Entschlossenen raus.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Wer nicht einschätzen kann, fragt nicht nach. Er sucht weiter." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Auflösung ----------
const FIXES = [
  {at: 4,  t: 'Einen Ab-Preis nennen, keinen Endpreis'},
  {at: 26, t: 'Lieber eine Spanne als gar keine Zahl'},
  {at: 48, t: 'Dazuschreiben, was den Preis treibt'},
];

const FixScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 20}}>
      <PeakFlash at={2} color={C.green} strength={0.18} />
      <div style={{opacity: a, fontSize: 32, fontWeight: 900, color: C.green, letterSpacing: 3, textTransform: 'uppercase'}}>
        Was stattdessen wirkt
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 15, marginTop: 4}}>
        {FIXES.map((x, i) => {
          const s = spring({frame: f - x.at, fps: 30, config: {damping: 16}});
          if (s <= 0.001) return null;
          return (
            <div key={i} style={{
              opacity: s, transform: `translateX(${(1 - s) * -28}px)`, width: 900,
              background: C.card, border: `2px solid ${C.green}55`, borderRadius: 16,
              padding: '20px 24px', fontSize: 31, fontWeight: 800, color: C.ink, textAlign: 'left',
            }}>✓ {x.t}</div>
          );
        })}
      </div>
      <div style={{opacity: spring({frame: f - 62, fps: 30, config: {damping: 15}}), maxWidth: 880, marginTop: 10}}>
        <YouAre text="Eine Zahl kostet dich nichts. Ihr Fehlen den Anruf." color={C.green} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5) CTA ----------
const CtaScene = () => {
  const f = useCurrentFrame();
  const q = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const line = spring({frame: f - 16, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f / 7) * 0.02;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 14}}>
      <div style={{opacity: q, fontSize: 41, fontWeight: 900, color: C.gold, lineHeight: 1.22, maxWidth: 890}}>
        👇 Preis auf der Seite –<br />ja oder nein?
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700, maxWidth: 860}}>
        Sag warum, in einem Satz. 🔖 Und speicher dir die drei Punkte.
      </div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{fontSize: 24, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 45, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
          Websites, die<br /><span style={{color: C.teal}}>Fragen beantworten</span>
        </div>
      </div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{transform: `scale(${pulse})`, padding: '17px 34px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 29, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DieGabelung = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(860px 860px at 540px 540px, rgba(61,220,132,0.07), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={PATHS}><PathScene /></Sequence>
      <Sequence from={HOOK + PATHS} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={HOOK + PATHS + TWIST} durationInFrames={FIX}><FixScene /></Sequence>
      <Sequence from={HOOK + PATHS + TWIST + FIX} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + PATHS + TWIST}>
        <OpenLoop text={OPEN_Q} hint="3 Schritte · Auflösung am Ende" color={C.teal} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
