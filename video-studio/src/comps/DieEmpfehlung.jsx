// „Die Empfehlung" — Säule 2 (Autonomous Recruiter).
//
// FORMAT-TREND (recherchiert 13.08.2026): Der „What I Did"-Trend teilt das Bild in drei
// horizontale Bänder, die synchron laufen. Neu im Bestand — bisher gab es Karten-Stapel,
// Zeitleisten, Suchleiste, Doku-Rahmen, aber nie ein Drei-Band-Layout.
// Unser Dreh: Band 1 = was gesagt wird, Band 2 = was gedacht wird, Band 3 = was es kostet.
//
// UNBESPIELTES THEMA: die Empfehlung aus dem eigenen Team. Bisher ging es um Tempo,
// Anzeige, Dauer, Ghosting, Hintergrundcheck und den ersten Tag — nie darum, dass der
// stärkste Kanal der eigene Mitarbeiter ist, und warum der schweigt.
//
// Bewusst ohne Statistik: für „Empfehlungen sind der beste Kanal" gibt es keine belastbare
// deutsche Zahl zur Hand, also wird erzählt statt behauptet (Marken-Regel).
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 3 Momente)
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
const HOOK = 105, BANDS = 270, TWIST = 85, FIX = 90, CTA = 50;
const OPEN_Q = 'Was antwortet dein Mitarbeiter?';

// ---------- 1) Hook ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 36, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 74, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 76, gap: 24}}>
      <div style={{opacity: a, fontSize: 30, fontWeight: 900, color: C.muted, letterSpacing: 4, textTransform: 'uppercase'}}>
        Freitag, 19 Uhr · Grillabend
      </div>
      <div style={{
        opacity: b, background: C.cardHi, border: `2px solid ${C.teal}55`, borderRadius: 22,
        padding: '26px 30px', fontSize: 44, fontWeight: 900, color: C.ink, lineHeight: 1.25, maxWidth: 900,
      }}>
        „Sucht ihr eigentlich<br />noch jemanden?"
      </div>
      <div style={{opacity: b, fontSize: 30, fontWeight: 800, color: C.muted, maxWidth: 880}}>
        Gefragt wird nicht dein Chef.<br />Gefragt wird dein Monteur.
      </div>
      <div style={{opacity: c, fontSize: 33, fontWeight: 900, color: C.gold, marginTop: 4}}>
        Drei Sekunden Pause. 👀
      </div>
      <PeakFlash at={74} color={C.gold} strength={0.13} />
    </AbsoluteFill>
  );
};

// ---------- 2) Drei Bänder ----------
const MOMENTE = [
  {sagt: '„Ja … glaub schon."',        denkt: 'Wir suchen seit Monaten. Dringend.',            folge: 'Er könnte jetzt jemanden mitbringen.', ton: C.teal},
  {sagt: '„Ist ganz okay bei uns."',    denkt: 'Meine erste Woche war ein Sprung ins Wasser.',  folge: 'Er wird vorsichtig.',                  ton: C.gold},
  {sagt: '„Frag am besten selbst an."', denkt: 'Wenn das schiefgeht, war ich es.',              folge: 'Die Empfehlung stirbt hier.',          ton: C.red},
];
const M_LEN = 90;

const Band = ({label, text, ton, at, localF, gross}) => {
  const s = spring({frame: localF - at, fps: 30, config: {damping: 16, mass: 0.8}});
  return (
    <div style={{
      width: 930, minHeight: 430, boxSizing: 'border-box',
      background: C.card, border: `2px solid ${ton}55`, borderRadius: 22,
      padding: '26px 28px', textAlign: 'left',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14,
      opacity: 0.35 + s * 0.65, transform: `translateY(${(1 - s) * 16}px)`,
    }}>
      <div style={{fontSize: 25, fontWeight: 900, color: ton, letterSpacing: 4, textTransform: 'uppercase'}}>
        {label}
      </div>
      <div style={{
        fontSize: gross ? 44 : 36, fontWeight: 900, color: C.ink, lineHeight: 1.2,
        opacity: Math.max(0.001, s),
      }}>{text}</div>
    </div>
  );
};

const BandScene = () => {
  const f = useCurrentFrame();
  const idx = Math.min(MOMENTE.length - 1, Math.floor(f / M_LEN));
  const local = f - idx * M_LEN;
  const m = MOMENTE[idx];
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '250px 40px 56px'}}>
      <StepProgress current={idx + 1} total={3} color={m.ton} />
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 20, marginTop: 26,
        minHeight: 1440, justifyContent: 'space-between',
      }}>
        <Band label="Er sagt"    text={m.sagt}  ton={C.teal} at={4}  localF={local} gross />
        <Band label="Er denkt"   text={m.denkt} ton={C.gold} at={24} localF={local} />
        <Band label="Das kostet" text={m.folge} ton={C.red}  at={46} localF={local} />
      </div>
      <PeakFlash at={2 * M_LEN + 46} color={C.red} strength={0.18} />
    </AbsoluteFill>
  );
};

// ---------- 3) Die Wendung ----------
const TwistScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 38, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 26}}>
      <PeakFlash at={2} color={C.gold} strength={0.2} />
      <div style={{opacity: a, fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 930}}>
        Der beste Bewerber kommt<br />selten über eine Anzeige.<br />
        <span style={{color: C.gold}}>Er kommt über dein Team.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Diese Bewerbung wurde nie geschrieben. Du erfährst nie davon." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Auflösung ----------
const FIXES = [
  {at: 4,  t: 'Frag dein Team: Würdest du uns empfehlen? Warum nicht?'},
  {at: 26, t: 'Die erste Woche planen – nicht „läuft schon"'},
  {at: 48, t: 'Empfehlung belohnen, bevor jemand danach fragt'},
];

const FixScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 66, gap: 20}}>
      <PeakFlash at={2} color={C.green} strength={0.18} />
      <div style={{opacity: a, fontSize: 32, fontWeight: 900, color: C.green, letterSpacing: 3, textTransform: 'uppercase'}}>
        Drei Fragen für Montag
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 15, marginTop: 4}}>
        {FIXES.map((x, i) => {
          const s = spring({frame: f - x.at, fps: 30, config: {damping: 16}});
          if (s <= 0.001) return null;
          return (
            <div key={i} style={{
              opacity: s, transform: `translateX(${(1 - s) * -28}px)`, width: 910,
              background: C.card, border: `2px solid ${C.green}55`, borderRadius: 16,
              padding: '20px 24px', fontSize: 30, fontWeight: 800, color: C.ink, textAlign: 'left',
            }}>✓ {x.t}</div>
          );
        })}
      </div>
      <div style={{opacity: spring({frame: f - 62, fps: 30, config: {damping: 15}}), maxWidth: 890, marginTop: 10}}>
        <YouAre text="Wer intern nicht empfohlen wird, wird extern teuer gesucht." color={C.green} />
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
      <div style={{opacity: q, fontSize: 40, fontWeight: 900, color: C.gold, lineHeight: 1.22, maxWidth: 890}}>
        👇 Würdest du deinen<br />eigenen Betrieb empfehlen?
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700, maxWidth: 860}}>
        Ehrlich: Ja oder Nein in die Kommentare. 🔖 Und speicher dir die drei Fragen.
      </div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{fontSize: 24, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 45, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
          Der <span style={{color: C.teal}}>Autonomous Recruiter</span>
        </div>
      </div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{transform: `scale(${pulse})`, padding: '17px 32px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 28, fontWeight: 900}}>
          beekenwebengineering.com/recruiter
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DieEmpfehlung = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(860px 860px at 540px 540px, rgba(124,92,255,0.08), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={BANDS}><BandScene /></Sequence>
      <Sequence from={HOOK + BANDS} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={HOOK + BANDS + TWIST} durationInFrames={FIX}><FixScene /></Sequence>
      <Sequence from={HOOK + BANDS + TWIST + FIX} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + BANDS + TWIST}>
        <OpenLoop text={OPEN_Q} hint="3 Momente · Auflösung am Ende" color={C.gold} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
