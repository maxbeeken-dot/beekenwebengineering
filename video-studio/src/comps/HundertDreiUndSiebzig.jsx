// „173 Tage" — Säule 2 (Autonomous Recruiter).
// Belegte Zahl statt Behauptung: Fachkraft-Stellen bleiben in Deutschland im Schnitt
// 173 Tage unbesetzt (Bundesagentur für Arbeit, 2024; SHK-Handwerk über 240 Tage).
// Quelle wird im Bild genannt — Marken-Regel: keine leeren Zahlenversprechen.
//
// Neues Format im Bestand: Zahl-Reveal + Kettenreaktion (eine offene Stelle zieht die
// nächste nach). Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient)
// · LossTag · ProofChip (belegter Social Proof) · YouAre · PeakFlash · LoopSeam.
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
const NUM = 100, CHAIN = 260, LOSS = 80, ANSWER = 100, CTA = 60;
const OPEN_Q = 'Was passiert in diesen 173 Tagen?';

// ---------- 1) Die Zahl ----------
const NumberScene = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [6, 40], [0, 173], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const pop = spring({frame: f - 40, fps: 30, config: {damping: 12, mass: 0.6}});
  const sub = spring({frame: f - 52, fps: 30, config: {damping: 15}});
  const proof = spring({frame: f - 74, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, gap: 20}}>
      <div style={{
        fontSize: 250, fontWeight: 900, color: C.gold, lineHeight: 1,
        fontVariantNumeric: 'tabular-nums', transform: `scale(${0.9 + pop * 0.1})`,
      }}>{n}</div>
      <div style={{fontSize: 54, fontWeight: 900, color: C.ink, letterSpacing: 4, marginTop: -8}}>TAGE</div>
      <div style={{opacity: sub, fontSize: 36, fontWeight: 800, color: C.muted, lineHeight: 1.3, maxWidth: 880, marginTop: 10}}>
        bleibt eine Fachkraft-Stelle<br />in Deutschland im Schnitt unbesetzt
      </div>
      <div style={{opacity: proof, marginTop: 14}}>
        <ProofChip text="Bundesagentur für Arbeit" color={C.teal} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2) Die Kettenreaktion ----------
const LINKS = [
  {at: 14,  span: 'Tag 1–30',    t: 'Das Team fängt es auf.',        s: 'Überstunden. „Geht schon."',       tone: '#f5b945'},
  {at: 76,  span: 'Tag 31–90',   t: 'Überstunden werden normal.',    s: 'Niemand nennt es mehr Ausnahme.',   tone: '#f5b945'},
  {at: 138, span: 'Tag 91–150',  t: 'Der Beste rechnet nach.',       s: 'Und bewirbt sich woanders.',        tone: '#ff5468'},
  {at: 200, span: 'Tag 151–173', t: 'Jetzt sind es zwei Stellen.',   s: 'Die Kette hat sich gedreht.',       tone: '#ff5468'},
];

const ChainLink = ({localF, l}) => {
  const s = spring({frame: localF - l.at, fps: 30, config: {damping: 16, mass: 0.8}});
  if (s <= 0.001) return null;
  return (
    <div style={{
      opacity: s, transform: `translateX(${(1 - s) * -44}px)`, width: 920,
      background: C.card, border: `2px solid ${l.tone}44`, borderRadius: 18,
      padding: '20px 24px', textAlign: 'left', display: 'flex', gap: 20, alignItems: 'center',
    }}>
      <div style={{
        minWidth: 168, fontSize: 25, fontWeight: 900, color: l.tone, letterSpacing: 1,
        borderRight: `2px solid ${C.border}`, paddingRight: 16,
      }}>{l.span}</div>
      <div>
        <div style={{fontSize: 33, fontWeight: 900, color: C.ink, lineHeight: 1.2}}>{l.t}</div>
        <div style={{fontSize: 25, fontWeight: 700, color: C.muted, marginTop: 4}}>{l.s}</div>
      </div>
    </div>
  );
};

const ChainScene = () => {
  const f = useCurrentFrame();
  const done = LINKS.filter(l => f > l.at + 10).length;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '250px 40px 60px', gap: 16}}>
      <StepProgress current={done} total={4} color={C.gold} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 34}}>
        {LINKS.map((l, i) => <ChainLink key={i} localF={f} l={l} />)}
      </div>
      <PeakFlash at={200} color={C.red} strength={0.22} />
    </AbsoluteFill>
  );
};

// ---------- 3) Der eigentliche Preis ----------
const LossScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 28, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 26}}>
      <div style={{opacity: a, fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 920}}>
        Die offene Stelle war teuer.<br />
        <span style={{color: C.gold}}>Aber nicht wegen des Gehalts.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Aus einer offenen Stelle wurden zwei." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Auflösung ----------
const AnswerScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 52, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 74, gap: 24}}>
      <PeakFlash at={3} color={C.teal} strength={0.2} />
      <div style={{opacity: a, fontSize: 32, fontWeight: 900, color: C.teal, letterSpacing: 3, textTransform: 'uppercase'}}>
        Deshalb dauert es so lange
      </div>
      <div style={{opacity: a, fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 920}}>
        Der Engpass ist selten<br />der Arbeitsmarkt.<br />
        <span style={{color: C.gold}}>Meist der Weg zu euch.</span>
      </div>
      <div style={{opacity: b, display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6}}>
        {['Bewerben in 60 Sekunden', 'Antwort sofort – auch nachts', 'Vorqualifiziert im Dashboard'].map((t, i) => (
          <div key={i} style={{
            background: C.card, border: `2px solid ${C.teal}55`, borderRadius: 999,
            padding: '12px 20px', fontSize: 25, fontWeight: 800, color: C.ink,
          }}>{t}</div>
        ))}
      </div>
      <div style={{opacity: c, maxWidth: 880, marginTop: 8}}>
        <YouAre text="173 Tage sind ein Durchschnitt. Kein Naturgesetz." color={C.teal} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5) CTA ----------
const CtaScene = () => {
  const f = useCurrentFrame();
  const q = spring({frame: f, fps: 30, config: {damping: 15}});
  const line = spring({frame: f - 16, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f / 7) * 0.02;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, gap: 16}}>
      <div style={{opacity: q, fontSize: 38, fontWeight: 900, color: C.gold, lineHeight: 1.25, maxWidth: 890}}>
        👇 Wie lange ist eure<br />längste offene Stelle?
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700}}>Tage oder Monate in die Kommentare.</div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{fontSize: 25, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 46, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
          Der <span style={{color: C.teal}}>Autonomous Recruiter</span>
        </div>
      </div>
      <div style={{opacity: line, marginTop: 14}}>
        <div style={{transform: `scale(${pulse})`, padding: '18px 34px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 29, fontWeight: 900}}>
          beekenwebengineering.com/recruiter
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const HundertDreiUndSiebzig = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(820px 820px at 540px 520px, rgba(245,185,69,0.08), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={NUM}><NumberScene /></Sequence>
      <Sequence from={NUM} durationInFrames={CHAIN}><ChainScene /></Sequence>
      <Sequence from={NUM + CHAIN} durationInFrames={LOSS}><LossScene /></Sequence>
      <Sequence from={NUM + CHAIN + LOSS} durationInFrames={ANSWER}><AnswerScene /></Sequence>
      <Sequence from={NUM + CHAIN + LOSS + ANSWER} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={NUM + CHAIN + LOSS}>
        <OpenLoop text={OPEN_Q} hint="Auflösung am Ende" color={C.gold} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
