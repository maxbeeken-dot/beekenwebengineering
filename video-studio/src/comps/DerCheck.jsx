// „Der Check" — Säule 2 (Autonomous Recruiter).
//
// FORMAT-TREND (recherchiert 11.08.2026): „Tap to Reveal" — etwas wird verdeckt, der
// Zuschauer wird zum Mitraten aufgefordert, dann folgt die Auflösung. Quellen betonen
// erneut: drehen statt kopieren. Unser Dreh: vier verdeckte Kacheln, der Zuschauer rät
// mit, bevor jede umklappt. Das macht das Video interaktiv statt vorgetragen.
//
// UNBESPIELTES THEMA: nicht Tempo (AntwortRennen, BewerbungsUhr), nicht die Anzeige
// (VierzehnSekunden), nicht die Dauer (173 Tage), nicht das Ghosting (DasEcho) — sondern
// der Hintergrundcheck, den der Bewerber über EUCH macht, bevor er überhaupt schreibt.
//
// Die Rate-Mechanik liefert den CTA gleich mit („Wie viele hattest du?") — eine Frage,
// die man beantworten WILL, statt einer, die man beantworten soll.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 4 Kacheln)
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
const HOOK = 110, REVEAL = 275, TWIST = 80, FIX = 85, CTA = 50;
const OPEN_Q = 'Was prüft er, bevor er sich bewirbt?';

// ---------- 1) Hook: vier verdeckte Kacheln ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 40, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 76, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 74, gap: 24}}>
      <div style={{opacity: a, fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1.18, maxWidth: 920}}>
        Bevor er sich bewirbt,<br />googelt er euch.
      </div>
      <div style={{opacity: b, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 6}}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 430, height: 190, borderRadius: 20,
            background: C.card, border: `2px dashed ${C.teal}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 76, fontWeight: 900, color: C.teal,
          }}>?</div>
        ))}
      </div>
      <div style={{opacity: c, fontSize: 36, fontWeight: 900, color: C.gold, lineHeight: 1.25, maxWidth: 900, marginTop: 8}}>
        Vier Dinge schaut er an.<br />Rate mit. 👀
      </div>
      <PeakFlash at={76} color={C.gold} strength={0.14} />
    </AbsoluteFill>
  );
};

// ---------- 2) Die Auflösung ----------
const TILES = [
  {at: 10,  t: 'Eure Google-Bewertungen',  s: 'Aber die von Ex-Mitarbeitern, nicht von Kunden.'},
  {at: 76,  t: 'Ob es eine Karriereseite gibt', s: 'Nicht die Startseite. Die Seite für ihn.'},
  {at: 142, t: 'Die Fotos',                 s: 'Echtes Team – oder Stockbilder mit Bauhelm?'},
  {at: 208, t: 'Wann ihr zuletzt gepostet habt', s: 'Zwei Jahre Stille wirkt wie geschlossen.'},
];

const Tile = ({localF, tile, i}) => {
  const flip = spring({frame: localF - tile.at, fps: 30, config: {damping: 17, mass: 0.8}});
  const sub = spring({frame: localF - tile.at - 22, fps: 30, config: {damping: 15}});
  const open = flip > 0.5;
  return (
    <div style={{
      width: 930, minHeight: 260, boxSizing: 'border-box',
      background: open ? C.cardHi : C.card,
      border: `2px ${open ? 'solid' : 'dashed'} ${open ? C.teal + 'aa' : C.teal + '44'}`,
      borderRadius: 20, padding: '22px 26px', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 20,
      transform: `scale(${0.98 + flip * 0.02})`,
    }}>
      <div style={{
        minWidth: 62, height: 62, borderRadius: 16,
        background: open ? `${C.teal}22` : 'transparent',
        border: `2px solid ${C.teal}${open ? '77' : '33'}`,
        color: C.teal, fontSize: 30, fontWeight: 900,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{open ? i + 1 : '?'}</div>
      <div style={{flex: 1}}>
        <div style={{
          fontSize: 40, fontWeight: 900, color: C.ink, lineHeight: 1.16,
          opacity: Math.max(0.001, flip),
        }}>{open ? tile.t : ''}</div>
        <div style={{
          opacity: sub, transform: `translateX(${(1 - sub) * 22}px)`,
          fontSize: 29, fontWeight: 800, color: C.muted, lineHeight: 1.3, marginTop: 8,
        }}>{tile.s}</div>
      </div>
    </div>
  );
};

const RevealScene = () => {
  const f = useCurrentFrame();
  const done = TILES.filter(t => f > t.at + 22).length;
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '250px 40px 60px'}}>
      <StepProgress current={done} total={4} color={C.teal} />
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 18, marginTop: 26,
        minHeight: 1480, justifyContent: 'space-between',
      }}>
        {TILES.map((t, i) => <Tile key={i} localF={f} tile={t} i={i} />)}
      </div>
      <PeakFlash at={208} color={C.gold} strength={0.16} />
    </AbsoluteFill>
  );
};

// ---------- 3) Die Wendung ----------
const TwistScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 34, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 26}}>
      <PeakFlash at={2} color={C.red} strength={0.2} />
      <div style={{opacity: a, fontSize: 54, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 920}}>
        Ihr sucht ihn.<br />
        <span style={{color: C.gold}}>Er prüft euch trotzdem zuerst.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Die Absage kommt oft, bevor die Bewerbung geschrieben ist." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Auflösung ----------
const FIXES = [
  {at: 4,  t: 'Eine echte Karriereseite, nicht nur „Jobs" im Menü'},
  {at: 26, t: 'Drei Fotos vom echten Team'},
  {at: 48, t: 'Ein Satz, warum Leute bei euch bleiben'},
];

const FixScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 20}}>
      <PeakFlash at={2} color={C.green} strength={0.18} />
      <div style={{opacity: a, fontSize: 32, fontWeight: 900, color: C.green, letterSpacing: 3, textTransform: 'uppercase'}}>
        Was er finden sollte
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
        <YouAre text="Er entscheidet sich für euch, bevor er euch schreibt." color={C.green} />
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
      <div style={{opacity: q, fontSize: 44, fontWeight: 900, color: C.gold, lineHeight: 1.22, maxWidth: 890}}>
        👇 Wie viele hattest du?
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700, maxWidth: 860}}>
        Schreib die Zahl in die Kommentare. 🔖 Und speicher dir die drei Punkte.
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

export const DerCheck = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(860px 860px at 540px 540px, rgba(52,227,208,0.08), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={REVEAL}><RevealScene /></Sequence>
      <Sequence from={HOOK + REVEAL} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={HOOK + REVEAL + TWIST} durationInFrames={FIX}><FixScene /></Sequence>
      <Sequence from={HOOK + REVEAL + TWIST + FIX} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + REVEAL + TWIST}>
        <OpenLoop text={OPEN_Q} hint="4 Dinge · Rate mit" color={C.teal} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
