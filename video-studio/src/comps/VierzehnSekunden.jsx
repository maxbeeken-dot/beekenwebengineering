// „14 Sekunden" — Säule 2 (Autonomous Recruiter).
// Belegte Zahl: Bewerber entscheiden im Schnitt in 14 Sekunden, ob sie eine
// Stellenanzeige weiterlesen (LinkedIn Talent Solutions). Quelle steht im Bild —
// Marken-Regel: keine leeren Zahlenversprechen.
//
// NEUES FORMAT im Bestand: Speicher-Karte / Referenz-Checkliste. Grund (Recherche 09.08.):
// Instagram wertet seit dem Q1-2026-Update SAVES und SHARES als stärkste Engagement-
// Signale — stärker als Kommentare. Deshalb ist dieses Video bewusst so gebaut, dass man
// es aufheben will (5 prüfbare Punkte), und der CTA fordert zuerst das Speichern.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 5 Punkte)
// · LossTag · ProofChip (belegter Social Proof) · YouAre (Unity) · PeakFlash · LoopSeam.
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {OpenLoop, StepProgress, LossTag, ProofChip, YouAre, PeakFlash, LoopSeam} from './Psych.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 30 fps → 600 Frames = 20 s
const HOOK = 100, LIST = 270, LOSS = 70, FIX = 110, CTA = 50;
const OPEN_Q = 'Wonach sucht er in diesen 14 Sekunden?';

// ---------- 1) Der Countdown ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.ceil(interpolate(f, [8, 62], [14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
  const pop = spring({frame: f - 4, fps: 30, config: {damping: 13, mass: 0.6}});
  const sub = spring({frame: f - 40, fps: 30, config: {damping: 15}});
  const proof = spring({frame: f - 64, fps: 30, config: {damping: 15}});
  const gone = spring({frame: f - 68, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, gap: 18}}>
      <PeakFlash at={64} color={C.red} strength={0.18} />
      <div style={{
        fontSize: 260, fontWeight: 900, color: n === 0 ? C.red : C.gold, lineHeight: 1,
        fontVariantNumeric: 'tabular-nums', transform: `scale(${0.9 + pop * 0.1})`,
      }}>{n}</div>
      <div style={{fontSize: 50, fontWeight: 900, color: C.ink, letterSpacing: 4, marginTop: -10}}>SEKUNDEN</div>
      <div style={{opacity: sub, fontSize: 35, fontWeight: 800, color: C.muted, lineHeight: 1.3, maxWidth: 890, marginTop: 8}}>
        entscheidet ein Bewerber, ob er<br />deine Stellenanzeige weiterliest
      </div>
      <div style={{opacity: proof, marginTop: 12}}>
        <ProofChip text="LinkedIn Talent Solutions" color={C.teal} />
      </div>
      <div style={{opacity: gone, fontSize: 32, fontWeight: 900, color: C.red, marginTop: 6}}>
        Dann ist er weg. 👀
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2) Die Speicher-Karte: 5 Punkte ----------
const ITEMS = [
  {at: 8,   want: 'Was verdiene ich?',       has: '„Vergütung nach Vereinbarung"'},
  {at: 54,  want: 'Wann muss ich arbeiten?', has: '„Vollzeit" – Schicht? Wochenende?'},
  {at: 100, want: 'Wo genau ist das?',       has: 'Nur der Firmensitz, kein Einsatzort'},
  {at: 146, want: 'Mit wem arbeite ich?',    has: 'Ein Logo. Kein einziges Gesicht.'},
  {at: 192, want: 'Wie bewerbe ich mich?',   has: '„Unterlagen per E-Mail" – am Handy'},
];

// Alle 5 Plätze stehen ab Frame 0 im Bild (leer, gedimmt) und füllen sich nacheinander.
// Zwei Gründe: die Karte füllt das 9:16-Format, und die sichtbaren Leerstellen verstärken
// den Goal-Gradient — man sieht, wie viel noch kommt, und bleibt für die Vollendung.
const ListRow = ({localF, it, i}) => {
  const s = spring({frame: localF - it.at, fps: 30, config: {damping: 16, mass: 0.75}});
  const flip = spring({frame: localF - it.at - 20, fps: 30, config: {damping: 15}});
  const filled = s > 0.02;
  return (
    <div style={{
      width: 930, minHeight: 168, boxSizing: 'border-box',
      background: filled ? C.card : 'transparent',
      border: `2px solid ${filled ? C.border : C.border + '80'}`,
      borderRadius: 18, padding: '22px 24px', textAlign: 'left',
      display: 'flex', gap: 20, alignItems: 'center',
    }}>
      <div style={{
        minWidth: 58, height: 58, borderRadius: 14,
        background: filled ? `${C.teal}22` : 'transparent',
        border: `2px solid ${C.teal}${filled ? '66' : '33'}`,
        color: filled ? C.teal : C.dim, fontSize: 29, fontWeight: 900,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{i + 1}</div>
      <div style={{flex: 1, opacity: s, transform: `translateX(${(1 - s) * 18}px)`}}>
        <div style={{fontSize: 36, fontWeight: 900, color: C.ink, lineHeight: 1.16}}>{it.want}</div>
        <div style={{
          opacity: flip, transform: `translateX(${(1 - flip) * 24}px)`,
          display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8,
        }}>
          <span style={{color: C.red, fontSize: 26, fontWeight: 900}}>steht da:</span>
          <span style={{fontSize: 28, fontWeight: 800, color: C.red}}>{it.has}</span>
        </div>
      </div>
    </div>
  );
};

const ListScene = () => {
  const f = useCurrentFrame();
  const done = ITEMS.filter(it => f > it.at + 20).length;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '250px 40px 56px', gap: 12}}>
      <StepProgress current={done} total={5} color={C.teal} />
      {/* minHeight + space-between, damit die Karte das 9:16-Format füllt statt oben zu kleben */}
      <div style={{
        display: 'flex', flexDirection: 'column', marginTop: 26,
        minHeight: 1330, justifyContent: 'space-between',
      }}>
        {ITEMS.map((it, i) => <ListRow key={i} localF={f} it={it} i={i} />)}
      </div>
      <PeakFlash at={192} color={C.red} strength={0.2} />
    </AbsoluteFill>
  );
};

// ---------- 3) Der Preis ----------
const LossScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 26}}>
      <div style={{opacity: a, fontSize: 55, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 920}}>
        Die Anzeige war nicht schlecht.<br />
        <span style={{color: C.gold}}>Sie war nur nicht beantwortbar.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Fünf offene Fragen = ein Wisch nach oben." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Auflösung ----------
const FixScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 28, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 60, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 74, gap: 22}}>
      <PeakFlash at={3} color={C.teal} strength={0.2} />
      <div style={{opacity: a, fontSize: 31, fontWeight: 900, color: C.teal, letterSpacing: 3, textTransform: 'uppercase'}}>
        Das sucht er – alle fünf
      </div>
      <div style={{opacity: a, fontSize: 50, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 920}}>
        Er will nicht mehr Text.<br />
        <span style={{color: C.gold}}>Er will eine Antwort.</span>
      </div>
      <div style={{opacity: b, display: 'flex', gap: 13, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 940, marginTop: 4}}>
        {['Alle 5 Punkte auf einer Seite', 'Bewerben in 60 Sekunden', 'Antwort sofort – auch nachts'].map((t, i) => (
          <div key={i} style={{
            background: C.card, border: `2px solid ${C.teal}55`, borderRadius: 999,
            padding: '12px 20px', fontSize: 25, fontWeight: 800, color: C.ink,
          }}>{t}</div>
        ))}
      </div>
      <div style={{opacity: c, maxWidth: 880, marginTop: 8}}>
        <YouAre text="Es scheitert selten am Gehalt." color={C.teal} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5) CTA: Speichern zuerst ----------
const CtaScene = () => {
  const f = useCurrentFrame();
  const q = spring({frame: f, fps: 30, config: {damping: 15}});
  const line = spring({frame: f - 14, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f / 7) * 0.02;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 14}}>
      <div style={{opacity: q, fontSize: 40, fontWeight: 900, color: C.gold, lineHeight: 1.22, maxWidth: 890}}>
        🔖 Speicher dir die 5 Punkte,<br />bevor du die nächste Anzeige schreibst.
      </div>
      <div style={{opacity: q, fontSize: 25, color: C.muted, fontWeight: 700}}>
        Und sag in den Kommentaren: an welchem Punkt scheitert eure?
      </div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{fontSize: 24, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 44, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
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

export const VierzehnSekunden = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(820px 820px at 540px 520px, rgba(52,227,208,0.08), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={LIST}><ListScene /></Sequence>
      <Sequence from={HOOK + LIST} durationInFrames={LOSS}><LossScene /></Sequence>
      <Sequence from={HOOK + LIST + LOSS} durationInFrames={FIX}><FixScene /></Sequence>
      <Sequence from={HOOK + LIST + LOSS + FIX} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + LIST + LOSS}>
        <OpenLoop text={OPEN_Q} hint="5 Punkte · Auflösung am Ende" color={C.teal} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
