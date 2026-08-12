// „Die Zeitkapsel" — Säule 1 (Websites).
//
// NEUES FORMAT im Bestand: Ausgrabung. Alle bisherigen Videos laufen vorwärts (Chronik,
// Rennen, Countdown) oder listen auf. Dieses gräbt rückwärts: vier Fundstücke mit
// Jahreszahl, wie Schichten in einer Grabung. Optisch dadurch klar unterscheidbar.
//
// UNBESPIELTES THEMA: nicht Tempo, nicht Technik, nicht Text, sondern VERALTETE INHALTE —
// Öffnungszeiten von früher, Leute, die längst weg sind, ein Weihnachtsgruß im August.
// Kein bestehendes Video behandelt das Altern einer Website nach dem Launch.
//
// Marken-Hinweis: Dieses Thema führt sauber zum optionalen monatlichen Service (Pflege).
// Deshalb NIE mit „keine monatlichen Gebühren" werben — das widerspricht dem Angebot.
// Hier wird Pflege als Nutzen gezeigt, nicht Kostenfreiheit versprochen.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 4 Fundstücke)
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
const HOOK = 105, DIG = 270, TWIST = 80, FIX = 95, CTA = 50;
const OPEN_Q = 'Was steht da heute noch drauf?';

// ---------- 1) Hook ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 38, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 74, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 76, gap: 24}}>
      {/* ⏳ statt 🪏 — der Spaten rendert in der Render-Umgebung nicht zuverlässig */}
      <div style={{opacity: a, fontSize: 110, lineHeight: 1}}>⏳</div>
      <div style={{opacity: a, fontSize: 58, fontWeight: 900, color: C.ink, lineHeight: 1.18, maxWidth: 920}}>
        Diese Website wurde<br />zuletzt 2019 angefasst.
      </div>
      <div style={{
        opacity: b, background: C.card, border: `2px solid ${C.border}`, borderRadius: 18,
        padding: '18px 26px', fontSize: 32, color: C.muted, fontWeight: 700, maxWidth: 880,
      }}>
        Der Betrieb läuft prima.<br />Die Seite ist stehen geblieben.
      </div>
      <div style={{opacity: c, fontSize: 34, fontWeight: 900, color: C.gold, marginTop: 4}}>
        Vier Fundstücke. 👀
      </div>
      <PeakFlash at={74} color={C.gold} strength={0.13} />
    </AbsoluteFill>
  );
};

// ---------- 2) Die Ausgrabung ----------
const FINDS = [
  {at: 10,  year: '2019', t: 'Die Öffnungszeiten',      s: 'Samstags längst zu. Steht aber offen da.'},
  {at: 76,  year: '2021', t: '„Ihr Ansprechpartner"',   s: 'Ist seit drei Jahren nicht mehr im Betrieb.'},
  {at: 142, year: '2022', t: 'Die Preisliste',          s: '„Stand 2022" – im besten Fall.'},
  {at: 208, year: 'Dez.', t: '„Frohe Weihnachten!"',    s: 'Im August noch auf der Startseite.'},
];

const FindRow = ({localF, fnd, i}) => {
  const s = spring({frame: localF - fnd.at, fps: 30, config: {damping: 16, mass: 0.8}});
  const sub = spring({frame: localF - fnd.at - 20, fps: 30, config: {damping: 15}});
  const shown = s > 0.02;
  return (
    <div style={{
      width: 930, minHeight: 250, boxSizing: 'border-box',
      background: shown ? C.card : 'transparent',
      border: `2px solid ${shown ? C.gold + '55' : C.border + 'aa'}`,
      borderRadius: 20, padding: '22px 26px', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 20,
      opacity: shown ? 1 : 0.5,
    }}>
      {/* Jahreszahl wie eine Fundschicht */}
      <div style={{
        minWidth: 118, textAlign: 'center', padding: '12px 10px', borderRadius: 14,
        background: shown ? `${C.gold}1a` : 'transparent',
        border: `2px solid ${C.gold}${shown ? '66' : '2a'}`,
        color: shown ? C.gold : C.dim, fontSize: 30, fontWeight: 900, letterSpacing: 1,
      }}>{shown ? fnd.year : '—'}</div>
      <div style={{flex: 1}}>
        <div style={{
          fontSize: 40, fontWeight: 900, color: C.ink, lineHeight: 1.16,
          // Platzhalter dauerhaft sichtbar; nur der echte Fund fadet mit der Animation ein
          opacity: shown ? s : 1,
        }}>{shown ? fnd.t : '• • •'}</div>
        <div style={{
          opacity: sub, transform: `translateX(${(1 - sub) * 22}px)`,
          fontSize: 29, fontWeight: 800, color: C.red, lineHeight: 1.3, marginTop: 8,
        }}>{fnd.s}</div>
      </div>
    </div>
  );
};

const DigScene = () => {
  const f = useCurrentFrame();
  const done = FINDS.filter(x => f > x.at + 20).length;
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '250px 40px 60px'}}>
      <StepProgress current={done} total={4} color={C.gold} />
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 18, marginTop: 26,
        minHeight: 1480, justifyContent: 'space-between',
      }}>
        {FINDS.map((x, i) => <FindRow key={i} localF={f} fnd={x} i={i} />)}
      </div>
      <PeakFlash at={208} color={C.red} strength={0.16} />
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
        Nichts davon war je falsch.<br />
        <span style={{color: C.gold}}>Es ist nur alt geworden.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Der Kunde weiß nicht, was noch gilt. Also ruft er nicht an." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Auflösung ----------
const FIXES = [
  {at: 4,  t: 'Öffnungszeiten und Team zweimal im Jahr prüfen'},
  {at: 26, t: 'Saison-Banner mit Enddatum im Kalender'},
  {at: 48, t: 'Preise mit Datum – oder ganz ohne'},
];

const FixScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 20}}>
      <PeakFlash at={2} color={C.green} strength={0.18} />
      <div style={{opacity: a, fontSize: 32, fontWeight: 900, color: C.green, letterSpacing: 3, textTransform: 'uppercase'}}>
        Zehn Minuten im Halbjahr
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
      <div style={{opacity: spring({frame: f - 64, fps: 30, config: {damping: 15}}), maxWidth: 880, marginTop: 10}}>
        <YouAre text="Eine Website ist kein Möbelstück. Sie altert." color={C.green} />
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
        👇 Was ist das Älteste<br />auf deiner Website?
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700, maxWidth: 860}}>
        Jahreszahl in die Kommentare. 🔖 Und speicher dir die drei Punkte.
      </div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{fontSize: 24, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 45, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
          Websites, die<br /><span style={{color: C.teal}}>aktuell bleiben</span>
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

export const DieZeitkapsel = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(860px 860px at 540px 540px, rgba(245,185,69,0.08), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={DIG}><DigScene /></Sequence>
      <Sequence from={HOOK + DIG} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={HOOK + DIG + TWIST} durationInFrames={FIX}><FixScene /></Sequence>
      <Sequence from={HOOK + DIG + TWIST + FIX} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + DIG + TWIST}>
        <OpenLoop text={OPEN_Q} hint="4 Fundstücke · Auflösung am Ende" color={C.gold} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
