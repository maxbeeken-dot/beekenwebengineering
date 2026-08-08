// „Wer zuerst antwortet" — Säule 2 (Autonomous Recruiter).
// Unbespieltes Thema: NICHT die Länge der Bewerbung (das war BewerbungsUhr), sondern was
// DANACH passiert — die Antwortzeit. Dieselbe Bewerberin schickt um 23:47 an drei Betriebe.
//
// Hook-Formel „Micro-Szenario" + „Clean Curiosity Gap" (Recherche 08.08.2026): der Algorithmus
// misst Intro-Retention — der Einstieg ist eine konkrete Szene, keine These.
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · LossTag · YouAre (Unity) · PeakFlash (Peak-End)
// · LoopSeam (Rewatch) · Kontrast (drei Betriebe nebeneinander).
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {OpenLoop, LossTag, YouAre, PeakFlash, LoopSeam} from './Psych.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 30 fps → 600 Frames = 20 s
const SCENE = 110, RACE = 240, DECIDE = 110, ANSWER = 80, CTA = 60;
const OPEN_Q = 'Bei wem fängt sie an?';

// ---------- 1) Micro-Szenario ----------
const SceneOne = () => {
  const f = useCurrentFrame();
  const phone = spring({frame: f - 8, fps: 30, config: {damping: 16}});
  const send = spring({frame: f - 46, fps: 30, config: {damping: 14}});
  const three = spring({frame: f - 70, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 70, gap: 24}}>
      <div style={{opacity: phone, fontSize: 30, letterSpacing: 5, color: C.teal, fontWeight: 900}}>
        23:47 UHR · NACH DER SPÄTSCHICHT
      </div>
      <div style={{
        opacity: phone, transform: `translateY(${(1 - phone) * 24}px)`,
        width: 620, background: C.card, border: `2px solid ${C.border}`, borderRadius: 30,
        padding: '34px 30px', textAlign: 'center',
      }}>
        <div style={{fontSize: 76, marginBottom: 12}}>📱</div>
        <div style={{fontSize: 40, fontWeight: 900, color: C.ink, lineHeight: 1.2}}>
          Pflegefachkraft,<br />34, sucht was Neues
        </div>
        <div style={{
          opacity: send, marginTop: 22, fontSize: 32, fontWeight: 900, color: C.green,
          background: 'rgba(61,220,132,0.12)', border: `2px solid ${C.green}55`,
          borderRadius: 14, padding: '14px 18px',
        }}>Bewerbung gesendet ✓</div>
      </div>
      <div style={{opacity: three, fontSize: 38, fontWeight: 900, color: C.ink, textAlign: 'center', lineHeight: 1.25}}>
        An <span style={{color: C.gold}}>drei</span> Betriebe.<br />
        <span style={{fontSize: 29, color: C.muted, fontWeight: 800}}>Gleichzeitig. Gleiche Stelle.</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2) Das Rennen um die Antwort ----------
const FIRMS = [
  {name: 'Betrieb A', reply: 'Montag, 09:14', wait: 'nach 58 Stunden', at: 90, tone: '#f5b945', icon: '📥'},
  {name: 'Betrieb B', reply: 'keine Antwort', wait: 'nie', at: 160, tone: '#ff5468', icon: '🕸️'},
  {name: 'Dein System', reply: '23:48 Uhr', wait: 'nach 60 Sekunden', at: 24, tone: '#34e3d0', icon: '⚡'},
];

const FirmCard = ({localF, f, order}) => {
  const s = spring({frame: localF - order * 8, fps: 30, config: {damping: 17}});
  const answered = localF > f.at;
  const pop = spring({frame: localF - f.at, fps: 30, config: {damping: 11, mass: 0.6}});
  return (
    <div style={{
      flex: 1, opacity: s, transform: `translateY(${(1 - s) * 26}px)`,
      background: C.card, border: `2px solid ${answered ? f.tone + '88' : C.border}`,
      borderRadius: 22, padding: '34px 18px', textAlign: 'center', minHeight: 1120,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 18,
    }}>
      <div style={{fontSize: 25, letterSpacing: 2, color: C.muted, fontWeight: 900, textTransform: 'uppercase'}}>{f.name}</div>
      <div style={{fontSize: 62, opacity: answered ? 1 : 0.25}}>{f.icon}</div>
      {answered ? (
        <div style={{transform: `scale(${0.7 + pop * 0.3})`}}>
          <div style={{fontSize: 32, fontWeight: 900, color: f.tone, lineHeight: 1.2}}>{f.reply}</div>
          <div style={{fontSize: 24, color: C.muted, fontWeight: 800, marginTop: 6}}>{f.wait}</div>
        </div>
      ) : (
        <div style={{fontSize: 28, color: C.dim, fontWeight: 800}}>wartet …</div>
      )}
    </div>
  );
};

const RaceScene = () => {
  const f = useCurrentFrame();
  // Uhr läuft von 23:47 über Nacht/Wochenende
  const stamps = [
    {at: 0, t: 'Fr 23:47'}, {at: 40, t: 'Sa 02:10'}, {at: 90, t: 'Mo 09:14'},
    {at: 150, t: 'Di 16:40'}, {at: 200, t: 'Mi 11:05'},
  ];
  const cur = stamps.filter(s => f >= s.at).pop() || stamps[0];
  return (
    <AbsoluteFill style={{padding: '236px 36px 60px', gap: 22}}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: 26, letterSpacing: 5, color: C.muted, fontWeight: 900}}>DIE UHR LÄUFT</div>
        <div style={{fontSize: 66, fontWeight: 900, color: C.ink, fontVariantNumeric: 'tabular-nums'}}>{cur.t}</div>
      </div>
      <div style={{display: 'flex', gap: 16, alignItems: 'stretch'}}>
        {FIRMS.map((x, i) => <FirmCard key={i} localF={f} f={x} order={i} />)}
      </div>
      <PeakFlash at={24} color={C.teal} strength={0.16} />
    </AbsoluteFill>
  );
};

// ---------- 3) Ihre Entscheidung ----------
const DecideScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 30, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 60, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 74, gap: 26}}>
      <PeakFlash at={4} color={C.green} strength={0.22} />
      <div style={{opacity: a, fontSize: 34, fontWeight: 900, color: C.teal, letterSpacing: 3, textTransform: 'uppercase'}}>
        Sie hat zugesagt
      </div>
      <div style={{
        opacity: b, transform: `scale(${0.94 + b * 0.06})`,
        background: C.card, border: `2px solid ${C.green}66`, borderRadius: 24,
        padding: '30px 34px', maxWidth: 880,
      }}>
        <div style={{fontSize: 54, fontWeight: 900, color: C.ink, lineHeight: 1.18}}>
          Nicht dem besten Lohn.<br />
          <span style={{color: C.green}}>Der ersten Antwort.</span>
        </div>
      </div>
      <div style={{opacity: c}}>
        <LossTag text="Betrieb A war 58 Stunden zu spät." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Auflösung der offenen Frage ----------
const AnswerScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 24, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 80, gap: 26}}>
      <div style={{opacity: a, fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1.18, maxWidth: 900}}>
        Die Stelle war nie<br />das Problem.<br />
        <span style={{color: C.gold}}>Die Wartezeit war es.</span>
      </div>
      <div style={{opacity: b, maxWidth: 880, marginTop: 4}}>
        <YouAre text="Wer nachts um 3 antwortet, muss dafür nicht wach sein." color={C.teal} />
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
        👇 Wie lange braucht ihr,<br />bis eine Bewerbung Antwort kriegt?
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700}}>Ehrliche Stunden in die Kommentare.</div>
      <div style={{opacity: line, marginTop: 14}}>
        <div style={{fontSize: 25, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 46, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 6}}>
          Antwort in <span style={{color: C.teal}}>60 Sekunden</span><br />– auch nachts
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

export const AntwortRennen = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(820px 820px at 540px 540px, rgba(52,227,208,0.08), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={SCENE}><SceneOne /></Sequence>
      <Sequence from={SCENE} durationInFrames={RACE}><RaceScene /></Sequence>
      <Sequence from={SCENE + RACE} durationInFrames={DECIDE}><DecideScene /></Sequence>
      <Sequence from={SCENE + RACE + DECIDE} durationInFrames={ANSWER}><AnswerScene /></Sequence>
      <Sequence from={SCENE + RACE + DECIDE + ANSWER} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Entscheidung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={SCENE + RACE}>
        <OpenLoop text={OPEN_Q} hint="Auflösung am Ende" color={C.teal} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
