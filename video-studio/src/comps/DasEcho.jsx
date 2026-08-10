// „Das Echo" — Säule 2 (Autonomous Recruiter).
//
// LÄNGEN-EXPERIMENT (recherchiert 2026-08-10): Buffer-Auswertung von 1,1 Mio. TikToks —
// Videos über 60 s erzielen 43 % mehr Reichweite. Completion wird gegen gleich lange
// Videos gemessen (1–3 min liegen im Schnitt bei ~22 %, >30 % gilt als stark), nicht gegen
// 15-Sekünder. Deshalb ist dies das erste Video über der Minute: 1950 Frames = 65 s.
// Bewusst als Test angelegt — Vergleichswert sind die sieben 20-s-Videos davor.
//
// Längeres Format heißt: mehr Kapitel, mehr Pattern Interrupts, härterer Peak. Sonst
// kippt die Retention und der Längenvorteil ist wieder aufgebraucht.
//
// UNBESPIELTES THEMA: nicht Geschwindigkeit (AntwortRennen, BewerbungsUhr), nicht die
// Anzeige (VierzehnSekunden), nicht die Dauer (173 Tage) — sondern was die Bewerber
// weitertragen, die ihr NICHT genommen habt. Arbeitgebermarke per Mundpropaganda.
//
// Bewusst OHNE Statistik: für die Weitererzähl-Kette gibt es keine belastbare deutsche
// Zahl, also wird hier erzählt statt behauptet (Marken-Regel: keine leeren Zahlen).
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 6 Kapitel)
// · LossTag · YouAre (Unity) · PeakFlash · PatternInterrupt · LoopSeam.
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {OpenLoop, StepProgress, LossTag, YouAre, PeakFlash, LoopSeam} from './Psych.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 30 fps → 1950 Frames = 65 s
const HOOK = 165, CHRON = 960, TWIST = 195, FIX = 420, CTA = 210;
const OPEN_Q = 'Was macht eine Nicht-Antwort mit eurer Suche?';

// ---------- 1) Hook ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 5, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 44, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 88, fps: 30, config: {damping: 15}});
  const d = spring({frame: f - 124, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 76, gap: 24}}>
      <div style={{opacity: a, fontSize: 60, fontWeight: 900, color: C.ink, lineHeight: 1.18, maxWidth: 920}}>
        Ihr habt ihn nicht<br />genommen.
      </div>
      <div style={{opacity: b, fontSize: 46, fontWeight: 900, color: C.gold, lineHeight: 1.22, maxWidth: 900}}>
        Das war nicht der Fehler.
      </div>
      <div style={{
        opacity: c, background: C.card, border: `2px solid ${C.border}`, borderRadius: 18,
        padding: '20px 28px', fontSize: 32, color: C.muted, fontWeight: 700, lineHeight: 1.4, maxWidth: 880,
      }}>
        Der Fehler war, dass er nie<br />erfahren hat, dass ihr ihn nicht nehmt.
      </div>
      <div style={{opacity: d, fontSize: 31, fontWeight: 900, color: C.red, marginTop: 4}}>
        Neun Monate später. 📻
      </div>
      <PeakFlash at={124} color={C.red} strength={0.14} />
    </AbsoluteFill>
  );
};

// ---------- 2) Die Chronik ----------
const CHAPTERS = [
  {when: 'Tag 1',    t: 'Er bewirbt sich.',                s: 'Abends, nach der Schicht. Er freut sich.',            tone: C.teal},
  {when: 'Tag 12',   t: 'Er fragt nach.',                  s: 'Höflich. Keine Antwort.',                              tone: C.gold},
  {when: 'Woche 5',  t: 'Er hört auf zu warten.',          s: 'Und erzählt es in der Pause.',                          tone: C.gold},
  {when: 'Monat 3',  t: 'Sein Schwager sucht auch.',       s: 'Euch schlägt er ihm nicht vor.',                        tone: C.red},
  {when: 'Monat 6',  t: 'Eure neue Anzeige geht online.',  s: 'Dieselbe Stelle. Weniger Bewerbungen.',                 tone: C.red},
  {when: 'Monat 9',  t: '„Woran liegt das nur?"',          s: 'Niemand im Betrieb bringt es zusammen.',                tone: C.red},
];

const CH_LEN = 160; // 960 / 6

// Alle sechs Stationen stehen ab Frame 0 als Zeitleiste im Bild. Die aktuelle klappt auf
// (Untertitel + farbiger Rahmen), vergangene bleiben gedimmt stehen, kommende sind leer.
// Das füllt das 9:16-Format, macht den Goal-Gradient sichtbar und zeigt vor allem, wie
// sich die Folgen aufsummieren — genau das ist die Aussage des Videos.
const ChapterRow = ({ch, state, localF}) => {
  const isNow = state === 'now';
  const isPast = state === 'past';
  const open = isNow ? spring({frame: localF - 6, fps: 30, config: {damping: 17, mass: 0.85}}) : 0;
  const sub = isNow ? spring({frame: localF - 30, fps: 30, config: {damping: 15}}) : 0;
  const tone = ch.tone;
  const shown = isNow || isPast;
  return (
    <div style={{
      width: 930, boxSizing: 'border-box',
      minHeight: isNow ? 300 : 150,
      background: isNow ? C.cardHi : (isPast ? C.card : 'transparent'),
      border: `2px solid ${shown ? tone + (isNow ? 'aa' : '3a') : C.border + '55'}`,
      borderRadius: 20, padding: isNow ? '24px 26px' : '20px 24px', textAlign: 'left',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      transform: `scale(${isNow ? 1 + open * 0.012 : 1})`,
      opacity: isNow ? 1 : (isPast ? 0.5 : 0.32),
    }}>
      <div style={{
        display: 'inline-block', alignSelf: 'flex-start',
        fontSize: isNow ? 25 : 22, fontWeight: 900,
        color: shown ? tone : C.dim, letterSpacing: 3, textTransform: 'uppercase',
        background: shown ? `${tone}1a` : 'transparent',
        border: `2px solid ${shown ? tone + '55' : C.border}`,
        borderRadius: 999, padding: isNow ? '7px 16px' : '5px 14px',
      }}>{ch.when}</div>
      {/* Kommende Stationen zeigen NUR den Zeitstempel — der Text bliebe sonst lesbar
          und würde die Geschichte vorwegnehmen (die offene Schleife wäre entwertet). */}
      <div style={{
        fontSize: isNow ? 46 : 30, fontWeight: 900,
        color: C.ink, lineHeight: 1.16, marginTop: isNow ? 14 : 8,
      }}>{shown ? ch.t : '• • •'}</div>
      {isNow && (
        <div style={{
          opacity: sub, transform: `translateX(${(1 - sub) * 24}px)`,
          fontSize: 31, fontWeight: 800, color: C.muted, lineHeight: 1.3, marginTop: 10,
        }}>{ch.s}</div>
      )}
    </div>
  );
};

const ChronScene = () => {
  const f = useCurrentFrame();
  const idx = Math.min(CHAPTERS.length - 1, Math.floor(f / CH_LEN));
  const localF = f - idx * CH_LEN;
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '256px 40px 70px'}}>
      <StepProgress current={idx + 1} total={6} color={CHAPTERS[idx].tone} />
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 14, marginTop: 26,
        minHeight: 1500, justifyContent: 'space-between',
      }}>
        {CHAPTERS.map((ch, i) => (
          <ChapterRow
            key={i}
            ch={ch}
            localF={localF}
            state={i === idx ? 'now' : (i < idx ? 'past' : 'future')}
          />
        ))}
      </div>
      <PeakFlash at={5 * CH_LEN + 6} color={C.red} strength={0.18} />
    </AbsoluteFill>
  );
};

// ---------- 3) Die Wendung ----------
const TwistScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 56, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 108, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 30}}>
      <PeakFlash at={6} color={C.gold} strength={0.22} />
      <div style={{opacity: a, fontSize: 54, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 930}}>
        Abgelehnte Bewerber sind<br />
        <span style={{color: C.gold}}>eure größte Reichweite.</span>
      </div>
      <div style={{opacity: b, fontSize: 40, fontWeight: 900, color: C.muted, lineHeight: 1.3, maxWidth: 900}}>
        Sie reden weiter.<br />Die Frage ist nur, worüber.
      </div>
      <div style={{opacity: c, marginTop: 6}}>
        <LossTag text="Eine Absage kostet zwei Minuten. Keine Absage kostet Jahre." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Das Gegenmittel (speicherbar) ----------
const FIXES = [
  {at: 30,  t: 'Jede Bewerbung bekommt eine Antwort'},
  {at: 90,  t: 'Auch die Absage – innerhalb von 48 Stunden'},
  {at: 150, t: 'Mit Namen, nicht „Sehr geehrte Damen und Herren"'},
  {at: 210, t: 'Und der Satz: „Melden Sie sich gern wieder."'},
];

const FixScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 15}});
  const chips = spring({frame: f - 290, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 22}}>
      <PeakFlash at={4} color={C.green} strength={0.18} />
      <div style={{opacity: a, fontSize: 33, fontWeight: 900, color: C.green, letterSpacing: 3, textTransform: 'uppercase'}}>
        Das Gegenmittel
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 4}}>
        {FIXES.map((x, i) => {
          const s = spring({frame: f - x.at, fps: 30, config: {damping: 16}});
          if (s <= 0.001) return null;
          return (
            <div key={i} style={{
              opacity: s, transform: `translateX(${(1 - s) * -30}px)`, width: 900,
              background: C.card, border: `2px solid ${C.green}55`, borderRadius: 16,
              padding: '22px 26px', fontSize: 33, fontWeight: 800, color: C.ink, textAlign: 'left',
            }}>✓ {x.t}</div>
          );
        })}
      </div>
      <div style={{opacity: spring({frame: f - 256, fps: 30, config: {damping: 15}}), maxWidth: 900, marginTop: 12}}>
        <YouAre text="Vier Sätze. Kein Budget. Nur jemand, der sie schreibt." color={C.green} />
      </div>
      <div style={{opacity: chips, display: 'flex', gap: 13, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 940, marginTop: 12}}>
        {['Antwort automatisch', 'Absage mit Namen', 'Tür bleibt offen'].map((t, i) => (
          <div key={i} style={{
            background: C.card, border: `2px solid ${C.teal}55`, borderRadius: 999,
            padding: '12px 20px', fontSize: 25, fontWeight: 800, color: C.ink,
          }}>{t}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5) CTA ----------
const CtaScene = () => {
  const f = useCurrentFrame();
  const q = spring({frame: f - 4, fps: 30, config: {damping: 15}});
  const ask = spring({frame: f - 40, fps: 30, config: {damping: 15}});
  const line = spring({frame: f - 76, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f / 7) * 0.02;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 16}}>
      <div style={{opacity: q, fontSize: 42, fontWeight: 900, color: C.gold, lineHeight: 1.22, maxWidth: 900}}>
        🔖 Speicher dir die vier Sätze.
      </div>
      <div style={{opacity: ask, fontSize: 30, color: C.ink, fontWeight: 800, lineHeight: 1.3, maxWidth: 880}}>
        Und ehrlich: Wie lange hast du selbst<br />mal auf eine Antwort gewartet?
      </div>
      <div style={{opacity: ask, fontSize: 25, color: C.muted, fontWeight: 700}}>Schreib es in die Kommentare.</div>
      <div style={{opacity: line, marginTop: 16}}>
        <div style={{fontSize: 24, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 45, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
          Der <span style={{color: C.teal}}>Autonomous Recruiter</span>
        </div>
      </div>
      <div style={{opacity: line, marginTop: 14}}>
        <div style={{transform: `scale(${pulse})`, padding: '18px 34px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 28, fontWeight: 900}}>
          beekenwebengineering.com/recruiter
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DasEcho = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    {/* 70-s-Bett: das Standardbett ist nur 30 s lang und liefe hier ab Sekunde 30 stumm */}
    <MusicBed file="music/brand-bed-long.wav" />
    <AbsoluteFill style={{background: 'radial-gradient(880px 880px at 540px 540px, rgba(124,92,255,0.08), transparent 70%)'}} />
    <LoopSeam frames={16}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={CHRON}><ChronScene /></Sequence>
      <Sequence from={HOOK + CHRON} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={HOOK + CHRON + TWIST} durationInFrames={FIX}><FixScene /></Sequence>
      <Sequence from={HOOK + CHRON + TWIST + FIX} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + CHRON + TWIST}>
        <OpenLoop text={OPEN_Q} hint="9 Monate · Auflösung am Ende" color={C.violet} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
