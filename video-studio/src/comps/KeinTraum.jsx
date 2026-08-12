// „Kein Traum" — Säule 1 (Websites).
//
// FORMAT-TREND (recherchiert 10.–11.08.2026): Der Reels-Trend „It was only a bad dream" —
// erst läuft etwas schief, dann Schnitt aufs Aufwachen. Die Quellen empfehlen ausdrücklich,
// Trends zu drehen statt zu kopieren. Unser Dreh: das Aufwachen ist die Erleichterung —
// und dann kippt sie, weil es eben kein Traum war. Umgekehrter Trend-Ausgang.
//
// LÄNGE: zurück auf 20 s (600 Frames). Der 65-s-Versuch (DasEcho) lag auf YouTube Shorts
// nach einem Tag bei 34 Aufrufen gegen 234 des gleichzeitig laufenden 20-Sekünders.
// Siehe Memory `project_length_experiment`.
//
// UNBESPIELTES THEMA: nicht der kaputte Kontakt (StilleLeitung), sondern der blinde Fleck —
// wer geht, löst keine Benachrichtigung aus. Man erfährt nie, dass er da war.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 4 Stationen)
// · LossTag · YouAre (Unity) · PeakFlash · LoopSeam. Das Aufwachen ist zugleich der
// stärkste Pattern Interrupt des Videos (harter Farb- und Tempowechsel in der Mitte).
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
const DREAM = 250, WAKE = 85, TWIST = 125, FIX = 90, CTA = 50;
const OPEN_Q = 'Warum merkst du davon nichts?';

// ---------- 1) Der Albtraum ----------
const BEATS = [
  {at: 10,  time: '20:14', t: 'Er sucht euch bei Google.',   s: 'Findet euch. Tippt drauf.'},
  {at: 68,  time: '20:14', t: 'Die Seite lädt.',             s: 'Und lädt. Und lädt.'},
  {at: 126, time: '20:15', t: 'Er sucht die Nummer.',        s: 'Ganz unten. Als Bild.'},
  {at: 184, time: '20:15', t: 'Er geht zurück.',             s: 'Und tippt aufs nächste Ergebnis.'},
];

const DreamBeat = ({localF, b, isNow}) => {
  const s = isNow ? spring({frame: localF - b.at, fps: 30, config: {damping: 16, mass: 0.8}}) : 0;
  const sub = isNow ? spring({frame: localF - b.at - 20, fps: 30, config: {damping: 15}}) : 0;
  const past = localF > b.at + 40;
  const shown = isNow || past;
  return (
    <div style={{
      width: 930, boxSizing: 'border-box', minHeight: isNow ? 290 : 155,
      background: shown ? (isNow ? C.cardHi : C.card) : 'transparent',
      border: `2px solid ${shown ? (isNow ? C.red + 'aa' : C.red + '33') : C.border + '55'}`,
      borderRadius: 20, padding: '22px 26px', textAlign: 'left',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      opacity: isNow ? 1 : (past ? 0.45 : 0.3),
    }}>
      <div style={{
        alignSelf: 'flex-start', fontSize: isNow ? 24 : 21, fontWeight: 900,
        color: shown ? C.red : C.dim, letterSpacing: 3,
        background: shown ? `${C.red}1a` : 'transparent',
        border: `2px solid ${shown ? C.red + '55' : C.border}`,
        borderRadius: 999, padding: '6px 15px',
      }}>{b.time}</div>
      {/* Kommende Stationen bleiben verdeckt — sonst liest man die Pointe vorweg */}
      <div style={{
        fontSize: isNow ? 45 : 29, fontWeight: 900, color: C.ink,
        lineHeight: 1.16, marginTop: isNow ? 12 : 7,
        opacity: isNow ? Math.max(0.001, s) : 1,
      }}>{shown ? b.t : '• • •'}</div>
      {isNow && (
        <div style={{
          opacity: sub, transform: `translateX(${(1 - sub) * 22}px)`,
          fontSize: 30, fontWeight: 800, color: C.muted, marginTop: 8,
        }}>{b.s}</div>
      )}
    </div>
  );
};

const DreamScene = () => {
  const f = useCurrentFrame();
  const idx = Math.max(0, BEATS.filter(b => f >= b.at).length - 1);
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '252px 40px 70px'}}>
      <StepProgress current={idx + 1} total={4} color={C.red} />
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 16, marginTop: 26,
        minHeight: 1480, justifyContent: 'space-between',
      }}>
        {BEATS.map((b, i) => <DreamBeat key={i} localF={f} b={b} isNow={i === idx} />)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2) Das Aufwachen (harter Bruch) ----------
const WakeScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 13, mass: 0.6}});
  const b = spring({frame: f - 34, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 76, gap: 26}}>
      <PeakFlash at={2} color={C.green} strength={0.3} />
      <div style={{opacity: a, fontSize: 100, fontWeight: 900, color: C.green, lineHeight: 1}}>😮‍💨</div>
      <div style={{opacity: a, fontSize: 62, fontWeight: 900, color: C.ink, lineHeight: 1.18, maxWidth: 900}}>
        Puh.<br />Nur ein Traum.
      </div>
      <div style={{opacity: b, fontSize: 33, fontWeight: 800, color: C.muted, maxWidth: 860}}>
        Aufgewacht. Kaffee. Weiterarbeiten.
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3) Die Wendung ----------
const TwistScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 14}});
  const b = spring({frame: f - 40, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 78, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 76, gap: 24}}>
      <PeakFlash at={2} color={C.red} strength={0.26} />
      <div style={{opacity: a, fontSize: 58, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 920}}>
        War es aber nicht.
      </div>
      <div style={{opacity: b, fontSize: 38, fontWeight: 800, color: C.muted, lineHeight: 1.3, maxWidth: 900}}>
        Das war gestern Abend.<br />Und vorgestern.
      </div>
      <div style={{opacity: c, marginTop: 6}}>
        <LossTag text="Für die, die gehen, klingelt kein Telefon." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Auflösung ----------
const FIXES = [
  {at: 4,  t: 'Auf dem Handy in unter 3 Sekunden da'},
  {at: 24, t: 'Telefonnummer als Knopf, nicht als Bild'},
  {at: 44, t: 'Anfrage in zwei Feldern, nicht in acht'},
];

const FixScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 20}}>
      <PeakFlash at={2} color={C.teal} strength={0.18} />
      <div style={{opacity: a, fontSize: 32, fontWeight: 900, color: C.teal, letterSpacing: 3, textTransform: 'uppercase'}}>
        Der Unterschied
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 15, marginTop: 4}}>
        {FIXES.map((x, i) => {
          const s = spring({frame: f - x.at, fps: 30, config: {damping: 16}});
          if (s <= 0.001) return null;
          return (
            <div key={i} style={{
              opacity: s, transform: `translateX(${(1 - s) * -28}px)`, width: 900,
              background: C.card, border: `2px solid ${C.teal}55`, borderRadius: 16,
              padding: '20px 24px', fontSize: 32, fontWeight: 800, color: C.ink, textAlign: 'left',
            }}>✓ {x.t}</div>
          );
        })}
      </div>
      <div style={{opacity: spring({frame: f - 60, fps: 30, config: {damping: 15}}), maxWidth: 880, marginTop: 10}}>
        <YouAre text="Drei Minuten prüfen. Auf deinem eigenen Handy." color={C.teal} />
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
        🔖 Speicher dir die drei Punkte.
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700, maxWidth: 860}}>
        Und schreib in die Kommentare, wie lange deine Seite auf dem Handy braucht.
      </div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{fontSize: 24, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 45, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
          Websites, die<br /><span style={{color: C.teal}}>niemanden verlieren</span>
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

export const KeinTraum = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(860px 860px at 540px 540px, rgba(255,84,104,0.07), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={DREAM}><DreamScene /></Sequence>
      <Sequence from={DREAM} durationInFrames={WAKE}><WakeScene /></Sequence>
      <Sequence from={DREAM + WAKE} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={DREAM + WAKE + TWIST} durationInFrames={FIX}><FixScene /></Sequence>
      <Sequence from={DREAM + WAKE + TWIST + FIX} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={DREAM + WAKE + TWIST}>
        <OpenLoop text={OPEN_Q} hint="Auflösung am Ende" color={C.red} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
