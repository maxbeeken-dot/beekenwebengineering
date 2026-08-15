// „Der Filter" — Säule 2 (Autonomous Recruiter).
//
// FORMAT (recherchiert 15.08.2026): „Single-Thought Recognition Reels" laufen gerade stark —
// ein Gedanke, ein Textblock, eine Wendung; der Zuschauer erkennt sich wieder und teilt.
// Umgesetzt als STREICHLISTE: jede Anforderung streicht sichtbar einen echten Menschen weg.
// Neu im Bestand — bisher gab es Karten, Zeitleisten, Bänder, Spalten, aber nie ein
// Durchstreichen als Kernmechanik.
//
// UNBESPIELTES THEMA: überzogene Anforderungen. Bisher ging es um Tempo, Anzeige-Aufbau,
// Dauer, Ghosting, Hintergrundcheck, ersten Tag und Empfehlung — nie darum, wen die
// eigene Anforderungsliste vorher aussortiert.
//
// Die Personen sind Illustration, keine echten Fälle, und es wird keine Statistik behauptet.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 4 Streichungen)
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
const HOOK = 100, LIST = 280, TWIST = 85, FIX = 85, CTA = 50;
const OPEN_Q = 'Wen streicht ihr damit weg?';

// ---------- 1) Hook ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 36, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 70, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 76, gap: 26}}>
      <div style={{opacity: a, fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1.18, maxWidth: 920}}>
        Vier Zeilen in eurer<br />Stellenanzeige.
      </div>
      <div style={{
        opacity: b, background: C.card, border: `2px solid ${C.border}`, borderRadius: 18,
        padding: '20px 28px', fontSize: 31, color: C.muted, fontWeight: 700, lineHeight: 1.4, maxWidth: 880,
      }}>
        Jede klingt vernünftig.<br />Jede kostet euch jemanden.
      </div>
      <div style={{opacity: c, fontSize: 34, fontWeight: 900, color: C.gold}}>
        Schauen wir, wen. 👀
      </div>
      <PeakFlash at={70} color={C.gold} strength={0.13} />
    </AbsoluteFill>
  );
};

// ---------- 2) Die Streichliste ----------
const ZEILEN = [
  {at: 8,   fordert: '„Mind. 5 Jahre Berufserfahrung"', name: 'Jonas, 24',  wer: 'Zwei Jahre dabei. Lernt schnell. Wäre geblieben.'},
  {at: 76,  fordert: '„Meisterbrief zwingend"',         name: 'Anna, 38',   wer: '15 Jahre Praxis. Nur eben kein Brief.'},
  {at: 144, fordert: '„Führerschein Klasse C"',          name: 'Tarek, 31',  wer: 'Hätte den großen Wagen nie gefahren.'},
  {at: 212, fordert: '„Belastbar, flexibel, teamfähig"', name: 'Alle',       wer: 'Die Ehrlichen bewerben sich hier nicht mehr.'},
];

const ZeileRow = ({localF, z}) => {
  const auf = spring({frame: localF - z.at, fps: 30, config: {damping: 16, mass: 0.8}});
  // Streich-Linie wächst von links nach rechts
  const strich = interpolate(localF, [z.at + 22, z.at + 40], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const weg = spring({frame: localF - z.at - 34, fps: 30, config: {damping: 15}});
  const sichtbar = auf > 0.02;
  return (
    <div style={{
      width: 930, minHeight: 300, boxSizing: 'border-box',
      background: sichtbar ? C.card : 'transparent',
      border: `2px solid ${sichtbar ? C.border : C.border + '55'}`,
      borderRadius: 20, padding: '22px 26px', textAlign: 'left',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12,
      opacity: sichtbar ? 1 : 0.35,
    }}>
      {/* Anforderung */}
      <div style={{position: 'relative', display: 'inline-block', alignSelf: 'flex-start'}}>
        <div style={{
          fontSize: 36, fontWeight: 900, color: C.ink, lineHeight: 1.18,
          opacity: sichtbar ? Math.max(0.001, auf) : 1,
        }}>{sichtbar ? z.fordert : '• • •'}</div>
        {sichtbar && strich > 0 && (
          <div style={{
            position: 'absolute', left: 0, top: '52%', height: 5, borderRadius: 3,
            width: `${strich * 100}%`, background: C.red,
          }} />
        )}
      </div>
      {/* Wer dadurch wegfällt */}
      <div style={{
        opacity: weg, transform: `translateX(${(1 - weg) * 22}px)`,
        display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4,
      }}>
        <span style={{fontSize: 30, fontWeight: 900, color: C.red}}>✕ {z.name}</span>
        <span style={{fontSize: 28, fontWeight: 800, color: C.muted}}>{z.wer}</span>
      </div>
    </div>
  );
};

const ListScene = () => {
  const f = useCurrentFrame();
  const done = ZEILEN.filter(z => f > z.at + 34).length;
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '250px 40px 56px'}}>
      <StepProgress current={done} total={4} color={C.red} />
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 16, marginTop: 26,
        minHeight: 1450, justifyContent: 'space-between',
      }}>
        {ZEILEN.map((z, i) => <ZeileRow key={i} localF={f} z={z} />)}
      </div>
      <PeakFlash at={212 + 34} color={C.red} strength={0.18} />
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
      <div style={{opacity: a, fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.22, maxWidth: 930}}>
        Am Ende bleibt genau<br />einer übrig.<br />
        <span style={{color: C.gold}}>Und der hat sich nie beworben.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Das war keine Auswahl. Das war Abschreckung." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Auflösung ----------
const FIXES = [
  {at: 4,  t: 'Muss und Kann trennen – drei Muss reichen'},
  {at: 26, t: 'Einarbeitung anbieten statt Erfahrung fordern'},
  {at: 48, t: 'Floskeln streichen – sie filtern nur die Ehrlichen'},
];

const FixScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 20}}>
      <PeakFlash at={2} color={C.green} strength={0.18} />
      <div style={{opacity: a, fontSize: 32, fontWeight: 900, color: C.green, letterSpacing: 3, textTransform: 'uppercase'}}>
        Zehn Minuten Streichen
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
        <YouAre text="Ihr sucht keinen Lebenslauf. Ihr sucht jemanden, der bleibt." color={C.green} />
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
        👇 Wie viele Anforderungen<br />stehen in eurer Anzeige?
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700, maxWidth: 860}}>
        Zähl sie einmal durch und schreib die Zahl. 🔖 Und speicher dir die drei Punkte.
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

export const DerFilter = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(860px 860px at 540px 540px, rgba(255,84,104,0.07), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={LIST}><ListScene /></Sequence>
      <Sequence from={HOOK + LIST} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={HOOK + LIST + TWIST} durationInFrames={FIX}><FixScene /></Sequence>
      <Sequence from={HOOK + LIST + TWIST + FIX} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + LIST + TWIST}>
        <OpenLoop text={OPEN_Q} hint="4 Zeilen · Auflösung am Ende" color={C.red} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
