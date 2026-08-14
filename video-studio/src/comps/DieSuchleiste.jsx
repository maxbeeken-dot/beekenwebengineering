// „Die Suchleiste" — Säule 1 (Websites).
//
// NEUES FORMAT im Bestand: tippende Suchleiste mit Vorschlagsliste. Kein veröffentlichtes
// Video nutzt eine Eingabe-Animation. (Die alte Composition `GoogleSuche` zeigt eine
// ERGEBNISSEITE mit blauen Links und wurde nie gepostet — anderer Mechanismus,
// anderer Aufhänger.)
//
// UNBESPIELTES THEMA: die Sprachlücke. Nicht Sichtbarkeit (LeuchtturmImNebel), nicht die
// Karte (NaeheRadar), nicht Öffnungszeiten (DunklesSchaufenster) — sondern der Abstand
// zwischen dem, was der Kunde tippt, und dem, wie der Betrieb sich selbst nennt.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 4 Paare)
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
const HOOK = 115, PAIRS = 265, TWIST = 80, FIX = 90, CTA = 50;
const OPEN_Q = 'Warum findet er dich nicht?';

// Tippt `text` Zeichen für Zeichen aus; ab `from` mit `cps` Zeichen pro Sekunde
const tippen = (text, localF, from = 0, cps = 22) => {
  const n = Math.max(0, Math.floor(((localF - from) / 30) * cps));
  return text.slice(0, Math.min(text.length, n));
};

const SuchLeiste = ({wert, blink = true, ton = C.ink, breit = 900}) => {
  const f = useCurrentFrame();
  const cursor = blink && Math.floor(f / 12) % 2 === 0;
  return (
    <div style={{
      width: breit, boxSizing: 'border-box', background: C.cardHi,
      border: `2px solid ${C.border}`, borderRadius: 999,
      padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <span style={{fontSize: 32, opacity: 0.75}}>🔍</span>
      <span style={{fontSize: 33, fontWeight: 800, color: ton, lineHeight: 1.2}}>
        {wert}<span style={{opacity: cursor ? 1 : 0, color: C.teal}}>|</span>
      </span>
    </div>
  );
};

// ---------- 1) Hook ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const q = tippen('klo verstopft bad homburg', f, 12, 20);
  const a = spring({frame: f - 6, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 62, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 88, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 74, gap: 26}}>
      <div style={{opacity: a, fontSize: 34, fontWeight: 900, color: C.muted, letterSpacing: 3, textTransform: 'uppercase'}}>
        21:40 Uhr, Küche
      </div>
      <SuchLeiste wert={q} />
      <div style={{opacity: b, fontSize: 50, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 900, marginTop: 6}}>
        Du bist zwei Straßen weiter.
      </div>
      <div style={{opacity: c, fontSize: 34, fontWeight: 900, color: C.gold}}>
        Er findet dich trotzdem nicht. 👀
      </div>
      <PeakFlash at={88} color={C.gold} strength={0.13} />
    </AbsoluteFill>
  );
};

// ---------- 2) Die Paare ----------
const PAARE = [
  {at: 8,   tippt: 'klo verstopft bad homburg',         nennst: 'Meisterbetrieb für Sanitär-, Heizungs- und Klimatechnik',
   folge: 'Er landet beim Notdienst aus Frankfurt.'},
  {at: 72,  tippt: 'auto quietscht beim bremsen',        nennst: 'Kfz-Fachwerkstatt für Fahrwerks- und Bremsensysteme',
   folge: 'Er nimmt die Werkstatt mit dem einfacheren Namen.'},
  {at: 136, tippt: 'zahnarzt der sich zeit nimmt',       nennst: 'Zahnmedizinisches Versorgungszentrum',
   folge: 'Er klickt die Praxis, die genau das hinschreibt.'},
  {at: 200, tippt: 'wer streicht schnell meine wohnung', nennst: 'Maler- und Lackiererbetrieb seit 1987',
   folge: 'Er ruft den an, bei dem „Wohnung streichen“ steht.'},
];

const PairScene = () => {
  const f = useCurrentFrame();
  const idx = Math.max(0, PAARE.filter(p => f >= p.at).length - 1);
  const p = PAARE[idx];
  const local = f - p.at;
  const q = tippen(p.tippt, local, 4, 26);
  const zeig = spring({frame: local - 30, fps: 30, config: {damping: 16}});
  const folge = spring({frame: local - 46, fps: 30, config: {damping: 15}});
  const done = PAARE.filter(x => f > x.at + 30).length;
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '250px 40px 70px'}}>
      <StepProgress current={done} total={4} color={C.teal} />
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        minHeight: 1470, justifyContent: 'center', gap: 60,
      }}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
          <div style={{fontSize: 27, fontWeight: 900, color: C.teal, letterSpacing: 4, textTransform: 'uppercase'}}>
            Er tippt
          </div>
          <SuchLeiste wert={q} breit={930} />
        </div>

        <div style={{opacity: zeig, fontSize: 54, color: C.dim, fontWeight: 900}}>↓</div>

        <div style={{
          opacity: zeig, transform: `translateY(${(1 - zeig) * 24}px)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 930,
        }}>
          <div style={{fontSize: 27, fontWeight: 900, color: C.red, letterSpacing: 4, textTransform: 'uppercase'}}>
            So nennst du dich
          </div>
          <div style={{
            width: '100%', boxSizing: 'border-box', background: C.card,
            border: `2px solid ${C.red}55`, borderRadius: 20, padding: '26px 28px',
            fontSize: 36, fontWeight: 900, color: C.ink, lineHeight: 1.22, textAlign: 'left',
          }}>{p.nennst}</div>
        </div>

        {/* Konsequenz: macht den Abstand greifbar und füllt das 9:16 */}
        <div style={{
          opacity: folge, transform: `translateY(${(1 - folge) * 20}px)`,
          width: 930, background: `${C.gold}12`, border: `2px solid ${C.gold}44`,
          borderRadius: 18, padding: '22px 26px', textAlign: 'left',
          fontSize: 32, fontWeight: 800, color: C.gold, lineHeight: 1.25,
        }}>→ {p.folge}</div>
      </div>
      <PeakFlash at={200} color={C.red} strength={0.16} />
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
      <PeakFlash at={2} color={C.gold} strength={0.2} />
      <div style={{opacity: a, fontSize: 54, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 930}}>
        Du wirst gesucht.<br />
        <span style={{color: C.gold}}>Nur nicht so, wie du dich nennst.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Kunden suchen ihr Problem – nicht deine Branche." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Auflösung ----------
const FIXES = [
  {at: 4,  t: 'Schreib die Sätze, die Kunden am Telefon sagen'},
  {at: 26, t: 'Eine Seite pro Problem, nicht pro Fachbegriff'},
  {at: 48, t: 'Ort dazu – „in Bad Homburg", nicht „regional"'},
];

const FixScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 20}}>
      <PeakFlash at={2} color={C.green} strength={0.18} />
      <div style={{opacity: a, fontSize: 32, fontWeight: 900, color: C.green, letterSpacing: 3, textTransform: 'uppercase'}}>
        Sprich wie dein Kunde
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
        {/* Als JS-Ausdruck, nicht als Attribut-String: das Zitat enthält Anführungszeichen */}
        <YouAre text={'Niemand googelt „Meisterbetrieb“. Alle googeln ihr Problem.'} color={C.green} />
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
        👇 Was tippt dein Kunde,<br />wenn er dich sucht?
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700, maxWidth: 860}}>
        Schreib den Satz in die Kommentare. 🔖 Und speicher dir die drei Punkte.
      </div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{fontSize: 24, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 45, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
          Websites, die<br /><span style={{color: C.teal}}>gefunden werden</span>
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

export const DieSuchleiste = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(860px 860px at 540px 540px, rgba(52,227,208,0.08), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={PAIRS}><PairScene /></Sequence>
      <Sequence from={HOOK + PAIRS} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={HOOK + PAIRS + TWIST} durationInFrames={FIX}><FixScene /></Sequence>
      <Sequence from={HOOK + PAIRS + TWIST + FIX} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + PAIRS + TWIST}>
        <OpenLoop text={OPEN_Q} hint="4 Beispiele · Auflösung am Ende" color={C.teal} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
