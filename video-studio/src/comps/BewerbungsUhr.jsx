// R1 „45 Minuten vs. 60 Sekunden" — Säule 2 (Autonomous Recruiter).
// Splitscreen-Rennen: klassisches Bewerbungsformular (Timer läuft hoch, Felder stapeln sich,
// Kandidat bricht ab) gegen den 60-Sekunden-Funnel (Timer läuft runter, 5 Schritte, fertig).
// Hook liegt in Frame 1: beide Uhren laufen sofort.
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Szenen (30 fps) → 600 Frames = 20 s
const HOOK = 84, RACE = 246, BREAK = 96, LESSON = 84, CTA = 90;

const pad2 = (n) => String(Math.max(0, Math.floor(n))).padStart(2, '0');
const mmss = (sec) => `${pad2(sec / 60)}:${pad2(sec % 60)}`;

const Clock = ({sec, color, label, warn}) => (
  <div style={{textAlign: 'center'}}>
    <div style={{fontSize: 24, letterSpacing: 5, color: C.muted, fontWeight: 800, textTransform: 'uppercase'}}>{label}</div>
    <div style={{
      fontSize: 96, fontWeight: 900, color, lineHeight: 1.05, fontVariantNumeric: 'tabular-nums',
      transform: `scale(${warn ? 1.04 : 1})`,
    }}>{mmss(sec)}</div>
  </div>
);

const Panel = ({tone, title, children}) => (
  <div style={{
    flex: 1, background: C.card, border: `2px solid ${tone}44`, borderRadius: 26,
    padding: '30px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
    minHeight: 1440, // füllt das 9:16-Bild — sonst klafft die untere Hälfte leer
  }}>
    <div style={{
      fontSize: 30, fontWeight: 900, color: tone, background: `${tone}1a`,
      border: `2px solid ${tone}55`, borderRadius: 999, padding: '10px 22px', textAlign: 'center',
    }}>{title}</div>
    {children}
  </div>
);

// ---------- 1) HOOK ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 14, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 30, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 80, gap: 26}}>
      <div style={{opacity: a, transform: `translateY(${(1 - a) * -18}px)`, fontSize: 30, fontWeight: 900, letterSpacing: 6, color: C.teal, textTransform: 'uppercase'}}>
        Zwei Betriebe · eine Fachkraft
      </div>
      <div style={{opacity: b, fontSize: 78, fontWeight: 900, color: C.ink, lineHeight: 1.08, maxWidth: 900}}>
        Wer bekommt<br />die Bewerbung?
      </div>
      <div style={{opacity: c, display: 'flex', gap: 44, marginTop: 14}}>
        <Clock sec={0} color={C.red} label="Formular" />
        <Clock sec={60} color={C.teal} label="Funnel" />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2) RENNEN ----------
const FIELDS = [
  {at: 10, t: 'Anrede, Titel, Geburtsdatum'},
  {at: 40, t: 'Lebenslauf als PDF hochladen'},
  {at: 74, t: 'Anschreiben (Pflichtfeld)'},
  {at: 110, t: 'Zeugnisse 1–4 einzeln'},
  {at: 148, t: 'Konto anlegen + Passwort'},
  {at: 186, t: 'Alles nochmal abtippen' },
];
const STEPS = [
  {at: 16, t: 'Wo willst du arbeiten?'},
  {at: 54, t: 'Was kannst du?'},
  {at: 92, t: 'Wann kannst du starten?'},
  {at: 130, t: 'Handynummer'},
  {at: 168, t: 'Fertig ✓'},
];

const FieldRow = ({localF, at, t}) => {
  const s = spring({frame: localF - at, fps: 30, config: {damping: 16, mass: 0.7}});
  if (s <= 0.001) return null;
  return (
    <div style={{
      opacity: s, transform: `translateX(${(1 - s) * -40}px)`, width: '100%',
      background: C.cardHi, border: `2px solid ${C.red}33`, borderRadius: 14,
      padding: '14px 18px', fontSize: 27, fontWeight: 700, color: C.ink, textAlign: 'left',
    }}>{t}</div>
  );
};

const StepRow = ({localF, at, t}) => {
  const s = spring({frame: localF - at, fps: 30, config: {damping: 16, mass: 0.7}});
  if (s <= 0.001) return null;
  const done = localF > at + 20;
  return (
    <div style={{
      opacity: s, transform: `translateX(${(1 - s) * 40}px)`, width: '100%',
      background: done ? 'rgba(61,220,132,0.12)' : C.cardHi,
      border: `2px solid ${done ? C.green + '77' : C.border}`, borderRadius: 14,
      padding: '14px 18px', fontSize: 27, fontWeight: 700, color: C.ink,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    }}>
      <span>{t}</span>
      <span style={{color: C.green, fontSize: 26, opacity: done ? 1 : 0.15, fontWeight: 900}}>✓</span>
    </div>
  );
};

const RaceScene = () => {
  const f = useCurrentFrame();
  // links: 0 → 45 Min (beschleunigt), rechts: 60 s → 0
  const leftSec = interpolate(f, [0, RACE], [0, 45 * 60], {extrapolateRight: 'clamp'});
  const rightSec = interpolate(f, [0, 190], [60, 0], {extrapolateRight: 'clamp'});
  const tick = Math.floor(f / 3) % 2 === 0;
  return (
    <AbsoluteFill style={{padding: '150px 44px 60px', gap: 26}}>
      <div style={{display: 'flex', gap: 22, alignItems: 'stretch'}}>
        <Panel tone={C.red} title="Klassische Bewerbung">
          <Clock sec={leftSec} color={C.red} label="läuft" warn={tick} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 11, width: '100%', marginTop: 4}}>
            {FIELDS.map((x, i) => <FieldRow key={i} localF={f} {...x} />)}
          </div>
        </Panel>
        <Panel tone={C.teal} title="60-Sekunden-Funnel">
          <Clock sec={rightSec} color={rightSec > 0 ? C.teal : C.green} label={rightSec > 0 ? 'übrig' : 'fertig'} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 11, width: '100%', marginTop: 4}}>
            {STEPS.map((x, i) => <StepRow key={i} localF={f} {...x} />)}
          </div>
        </Panel>
      </div>
      <div style={{textAlign: 'center', fontSize: 30, fontWeight: 800, color: C.muted}}>
        Gleiche Stelle. Gleiches Gehalt. <span style={{color: C.ink}}>Anderer Weg rein.</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3) ABBRUCH ----------
const BreakScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill style={{padding: '44px', gap: 26, justifyContent: 'center'}}>
      <div style={{display: 'flex', gap: 22}}>
        <div style={{
          flex: 1, background: C.card, border: `2px solid ${C.red}66`, borderRadius: 26,
          padding: 34, textAlign: 'center', opacity: a, transform: `scale(${0.94 + a * 0.06})`,
        }}>
          <div style={{fontSize: 84, marginBottom: 10}}>👻</div>
          <div style={{fontSize: 40, fontWeight: 900, color: C.red, lineHeight: 1.15}}>Abgebrochen</div>
          <div style={{fontSize: 27, color: C.muted, marginTop: 12, lineHeight: 1.35}}>
            Bei Feld 7 war sie weg —<br />und zwar zur Konkurrenz.
          </div>
        </div>
        <div style={{
          flex: 1, background: C.card, border: `2px solid ${C.green}66`, borderRadius: 26,
          padding: 34, textAlign: 'center', opacity: b, transform: `scale(${0.94 + b * 0.06})`,
        }}>
          <div style={{fontSize: 84, marginBottom: 10}}>📨</div>
          <div style={{fontSize: 40, fontWeight: 900, color: C.green, lineHeight: 1.15}}>Bewerbung da</div>
          <div style={{fontSize: 27, color: C.muted, marginTop: 12, lineHeight: 1.35}}>
            Vorqualifiziert im Dashboard.<br />Nach 58 Sekunden.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) EINSICHT ----------
const LessonScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 90, gap: 26}}>
      <div style={{opacity: a, fontSize: 62, fontWeight: 900, color: C.ink, lineHeight: 1.14, maxWidth: 900}}>
        Die beste Fachkraft<br />hat die <span style={{color: C.gold}}>wenigste Geduld</span>.
      </div>
      <div style={{opacity: b, fontSize: 33, color: C.muted, fontWeight: 700, maxWidth: 820, lineHeight: 1.35}}>
        Sie vergleicht nicht dein Gehalt.<br />Sie vergleicht, wie leicht sie sich bewerben kann.
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5) CTA ----------
const CtaScene = () => {
  const f = useCurrentFrame();
  const q = spring({frame: f, fps: 30, config: {damping: 15}});
  const line = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f / 7) * 0.02;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 80, gap: 20}}>
      <div style={{opacity: q, transform: `translateY(${(1 - q) * -18}px)`, fontSize: 36, fontWeight: 800, color: C.gold, maxWidth: 880, lineHeight: 1.25}}>
        👇 Wie lange hat deine längste<br />Bewerbung gedauert?
        <div style={{fontSize: 27, color: C.muted, marginTop: 10}}>Schreib die Minuten in die Kommentare.</div>
      </div>
      <div style={{opacity: line, marginTop: 10}}>
        <div style={{fontSize: 26, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 50, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 8}}>
          Bewerben in <span style={{color: C.teal}}>60 Sekunden</span>
        </div>
      </div>
      <div style={{opacity: line, marginTop: 18}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 32, fontWeight: 900}}>
          beekenwebengineering.com/recruiter
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BewerbungsUhr = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(820px 820px at 540px 560px, rgba(124,92,255,0.10), transparent 70%)'}} />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={RACE}><RaceScene /></Sequence>
    <Sequence from={HOOK + RACE} durationInFrames={BREAK}><BreakScene /></Sequence>
    <Sequence from={HOOK + RACE + BREAK} durationInFrames={LESSON}><LessonScene /></Sequence>
    <Sequence from={HOOK + RACE + BREAK + LESSON} durationInFrames={CTA}><CtaScene /></Sequence>
  </AbsoluteFill>
);
