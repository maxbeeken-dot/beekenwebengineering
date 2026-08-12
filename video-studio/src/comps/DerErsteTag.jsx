// „Der erste Tag" — Säule 2 (Autonomous Recruiter).
//
// NEUES FORMAT im Bestand: Kalendergitter. Kein bisheriges Video benutzt ein Raster —
// alle arbeiten mit gestapelten Karten, Zeitleisten oder Vollbild-Text. Vierzehn Kästchen,
// die sich leer füllen, sind optisch sofort als anderes Video erkennbar.
//
// UNBESPIELTES THEMA: die Lücke zwischen Zusage und erstem Arbeitstag. DasEcho behandelt
// Ghosting DURCH den Betrieb; hier ghostet der Bewerber — aus demselben Grund: Stille.
// Kein Video im Bestand behandelt die Zeit nach der Zusage.
//
// Bewusst ohne Statistik: für Absprünge zwischen Zusage und Start gibt es keine belastbare
// deutsche Zahl. Erzählt statt behauptet (Marken-Regel: keine leeren Zahlenversprechen).
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 4 Marken)
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
const HOOK = 100, CAL = 260, EMPTY = 95, FIX = 95, CTA = 50;
const OPEN_Q = 'Warum kommt er am ersten Tag nicht?';

// ---------- 1) Hook ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 36, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 70, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 76, gap: 24}}>
      <div style={{opacity: a, fontSize: 60, fontWeight: 900, color: C.ink, lineHeight: 1.18, maxWidth: 920}}>
        Er hat zugesagt.
      </div>
      <div style={{
        opacity: b, background: C.card, border: `2px solid ${C.green}55`, borderRadius: 18,
        padding: '18px 26px', fontSize: 33, color: C.green, fontWeight: 800, maxWidth: 880,
      }}>
        „Wir freuen uns auf Sie!"<br />Vertrag unterschrieben. 🎉
      </div>
      <div style={{opacity: c, fontSize: 36, fontWeight: 900, color: C.gold, lineHeight: 1.25, maxWidth: 900, marginTop: 6}}>
        Dann passierten 14 Tage<br />gar nichts.
      </div>
      <PeakFlash at={70} color={C.gold} strength={0.14} />
    </AbsoluteFill>
  );
};

// ---------- 2) Der Kalender ----------
const MARKS = {
  2:  {at: 30,  t: 'Ein anderer Betrieb ruft an.',        s: 'Er sagt höflich ab. Noch.'},
  6:  {at: 100, t: '„Hast du was gehört?"',               s: 'Fragt seine Frau. Er sagt: „Nee."'},
  10: {at: 165, t: 'Er liest den Vertrag nochmal.',       s: 'Und findet ihn plötzlich dünn.'},
  14: {at: 225, t: 'Er ruft den anderen Betrieb an.',     s: 'Der hatte sich zwischendurch gemeldet.'},
};
const MARK_DAYS = [2, 6, 10, 14];

const Day = ({n, activeDay, localF}) => {
  const mark = MARKS[n];
  const isMark = !!mark;
  const reached = isMark ? localF >= mark.at : false;
  const isNow = activeDay === n;
  // Tage ohne Ereignis füllen sich einfach der Reihe nach — sichtbar leer
  const passed = localF > (n / 14) * 240;
  const tone = isNow ? C.red : (isMark && reached ? C.gold : C.dim);
  return (
    <div style={{
      width: 118, height: 118, borderRadius: 18, boxSizing: 'border-box',
      background: isNow ? `${C.red}22` : (passed ? C.card : 'transparent'),
      border: `2px solid ${isNow ? C.red : (passed ? C.border : C.border + '66')}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transform: `scale(${isNow ? 1.06 : 1})`,
    }}>
      <div style={{fontSize: 34, fontWeight: 900, color: tone}}>{n}</div>
      <div style={{fontSize: 20, fontWeight: 800, color: passed && !isMark ? C.dim : 'transparent'}}>
        {passed && !isMark ? '—' : '·'}
      </div>
    </div>
  );
};

const CalScene = () => {
  const f = useCurrentFrame();
  const activeIdx = MARK_DAYS.filter(d => f >= MARKS[d].at).length - 1;
  const activeDay = activeIdx >= 0 ? MARK_DAYS[activeIdx] : null;
  const mark = activeDay ? MARKS[activeDay] : null;
  const s = mark ? spring({frame: f - mark.at, fps: 30, config: {damping: 17, mass: 0.8}}) : 0;
  const sub = mark ? spring({frame: f - mark.at - 20, fps: 30, config: {damping: 15}}) : 0;
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '250px 40px 80px'}}>
      <StepProgress current={Math.max(0, activeIdx + 1)} total={4} color={C.gold} />
      {/* minHeight + space-between, damit Gitter und Ereignis-Karte das 9:16 füllen */}
      <div style={{
        marginTop: 34, display: 'flex', flexDirection: 'column', alignItems: 'center',
        minHeight: 1480, justifyContent: 'space-between',
      }}>
        <div style={{fontSize: 27, fontWeight: 900, color: C.muted, letterSpacing: 4, textTransform: 'uppercase'}}>
          Zwischen Zusage und Start
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 118px)', gap: 16}}>
          {Array.from({length: 14}, (_, i) => (
            <Day key={i} n={i + 1} activeDay={activeDay} localF={f} />
          ))}
        </div>
        {/* Ereignis-Karte unter dem Gitter */}
        <div style={{
          width: 930, minHeight: 420, boxSizing: 'border-box',
          background: mark ? C.cardHi : 'transparent',
          border: `2px solid ${mark ? C.red + '77' : C.border + '55'}`,
          borderRadius: 20, padding: '26px 28px', textAlign: 'left',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            alignSelf: 'flex-start', fontSize: 24, fontWeight: 900, color: C.red, letterSpacing: 3,
            background: `${C.red}1a`, border: `2px solid ${C.red}55`, borderRadius: 999, padding: '6px 16px',
            opacity: mark ? 1 : 0,
          }}>TAG {activeDay ?? ''}</div>
          <div style={{
            fontSize: 44, fontWeight: 900, color: C.ink, lineHeight: 1.16, marginTop: 14,
            opacity: Math.max(0.001, s),
          }}>{mark ? mark.t : ''}</div>
          <div style={{
            opacity: sub, transform: `translateX(${(1 - sub) * 22}px)`,
            fontSize: 30, fontWeight: 800, color: C.muted, marginTop: 10,
          }}>{mark ? mark.s : ''}</div>
        </div>
      </div>
      <PeakFlash at={225} color={C.red} strength={0.18} />
    </AbsoluteFill>
  );
};

// ---------- 3) Der erste Tag ----------
const EmptyScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 14}});
  const b = spring({frame: f - 34, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 62, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 24}}>
      <PeakFlash at={2} color={C.red} strength={0.24} />
      <div style={{opacity: a, fontSize: 30, fontWeight: 900, color: C.red, letterSpacing: 4, textTransform: 'uppercase'}}>
        Erster Arbeitstag, 7:00 Uhr
      </div>
      <div style={{opacity: a, fontSize: 58, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 920}}>
        Er kommt nicht.
      </div>
      <div style={{opacity: b, fontSize: 36, fontWeight: 800, color: C.muted, lineHeight: 1.3, maxWidth: 900}}>
        Nichts ist schiefgelaufen.<br />Es ist nur nichts passiert.
      </div>
      <div style={{opacity: c, marginTop: 6}}>
        <LossTag text="Zwei Wochen Stille sind auch eine Nachricht." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Auflösung ----------
const FIXES = [
  {at: 4,  t: 'Am Tag der Zusage: Termin für den Willkommensanruf'},
  {at: 26, t: 'Woche 1: Wer ihn einarbeitet, meldet sich kurz'},
  {at: 48, t: 'Woche 2: Ablauf des ersten Tages schicken'},
];

const FixScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 20}}>
      <PeakFlash at={2} color={C.green} strength={0.18} />
      <div style={{opacity: a, fontSize: 32, fontWeight: 900, color: C.green, letterSpacing: 3, textTransform: 'uppercase'}}>
        Drei Kontakte, drei Minuten
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 15, marginTop: 4}}>
        {FIXES.map((x, i) => {
          const s = spring({frame: f - x.at, fps: 30, config: {damping: 16}});
          if (s <= 0.001) return null;
          return (
            <div key={i} style={{
              opacity: s, transform: `translateX(${(1 - s) * -28}px)`, width: 900,
              background: C.card, border: `2px solid ${C.green}55`, borderRadius: 16,
              padding: '20px 24px', fontSize: 30, fontWeight: 800, color: C.ink, textAlign: 'left',
            }}>✓ {x.t}</div>
          );
        })}
      </div>
      <div style={{opacity: spring({frame: f - 64, fps: 30, config: {damping: 15}}), maxWidth: 880, marginTop: 10}}>
        <YouAre text="Unterschrieben heißt noch nicht angekommen." color={C.green} />
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
        👇 Ist euch das schon<br />mal passiert?
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700, maxWidth: 860}}>
        Kurz in die Kommentare. 🔖 Und speicher dir die drei Kontakte.
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

export const DerErsteTag = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(860px 860px at 540px 540px, rgba(255,84,104,0.07), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={CAL}><CalScene /></Sequence>
      <Sequence from={HOOK + CAL} durationInFrames={EMPTY}><EmptyScene /></Sequence>
      <Sequence from={HOOK + CAL + EMPTY} durationInFrames={FIX}><FixScene /></Sequence>
      <Sequence from={HOOK + CAL + EMPTY + FIX} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + CAL + EMPTY}>
        <OpenLoop text={OPEN_Q} hint="14 Tage · Auflösung am Ende" color={C.red} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
