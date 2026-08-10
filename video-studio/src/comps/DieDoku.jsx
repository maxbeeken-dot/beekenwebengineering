// „Die Doku" — Säule 1 (Websites).
// FORMAT-TREND (recherchiert 2026-08-10): Das „Netflix-Doku"-Interview (Stuhl-Sitz-Bit) ist
// diese Woche von TikTok zu Instagram übergeschwappt und trendet dort eigenständig — ein
// seltener Beleg für Haltbarkeit. Empfehlung der Quellen: nicht kopieren, sondern auf die
// eigene Nische drehen. Unser Dreh: die Befragte ist die WEBSITE DER KONKURRENZ, die
// erklärt, warum der Auftrag bei ihr landete. Diese Perspektive (Sicht der Gewinnerin)
// gibt es im Bestand noch nicht.
//
// Zweiter Befund desselben Laufs: Instagram wertet seit Q1 2026 SAVES/SHARES am stärksten.
// Deshalb ist der Mittelteil bewusst als mitschreibbare Liste gebaut und der CTA fordert
// zuerst zum Speichern auf.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 4 Aussagen)
// · LossTag · YouAre (Unity) · PeakFlash (Peak-End) · LoopSeam (Rewatch).
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
const OPEN = 95, TALK = 275, TWIST = 70, RECAP = 110, CTA = 50;
const OPEN_Q = 'Warum hat die andere den Auftrag bekommen?';

// ---------- Doku-Kamera-Rahmen (Ecken + REC + Timecode) ----------
const tc = (f) => {
  const total = Math.floor(f / 30);
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  const ff = String(f % 30).padStart(2, '0');
  return `00:${mm}:${ss}:${ff}`;
};

const CamFrame = ({globalF}) => {
  const blink = Math.floor(globalF / 15) % 2 === 0;
  const B = 44, L = 74;
  const corner = (extra) => ({
    position: 'absolute', width: L, height: L,
    borderColor: 'rgba(246,245,250,0.28)', borderStyle: 'solid', borderWidth: 0, ...extra,
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={corner({top: B, left: B, borderTopWidth: 4, borderLeftWidth: 4})} />
      <div style={corner({top: B, right: B, borderTopWidth: 4, borderRightWidth: 4})} />
      <div style={corner({bottom: B, left: B, borderBottomWidth: 4, borderLeftWidth: 4})} />
      <div style={corner({bottom: B, right: B, borderBottomWidth: 4, borderRightWidth: 4})} />
      <div style={{
        // unten links statt oben links — oben sitzt die OpenLoop-Frageleiste
        position: 'absolute', bottom: B + 18, left: B + 92, display: 'flex', alignItems: 'center', gap: 12,
        fontSize: 25, fontWeight: 800, color: 'rgba(246,245,250,0.5)', letterSpacing: 2,
      }}>
        <span style={{
          width: 16, height: 16, borderRadius: 999,
          background: blink ? C.red : 'transparent', border: `2px solid ${C.red}`,
        }} />
        REC
      </div>
      <div style={{
        position: 'absolute', bottom: B + 18, right: B + 92, fontSize: 25, fontWeight: 800,
        color: 'rgba(246,245,250,0.42)', letterSpacing: 2, fontVariantNumeric: 'tabular-nums',
      }}>{tc(globalF)}</div>
    </AbsoluteFill>
  );
};

// ---------- Namensschild (Lower Third) ----------
const LowerThird = ({name, role, color = C.teal, at = 0}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f - at, fps: 30, config: {damping: 17, mass: 0.8}});
  if (s <= 0.001) return null;
  return (
    <div style={{
      opacity: s, transform: `translateX(${(1 - s) * -60}px)`,
      display: 'flex', alignItems: 'stretch', gap: 16,
    }}>
      <div style={{width: 8, borderRadius: 4, background: color}} />
      <div style={{textAlign: 'left'}}>
        <div style={{fontSize: 40, fontWeight: 900, color: C.ink, lineHeight: 1.14}}>{name}</div>
        <div style={{fontSize: 26, fontWeight: 800, color, letterSpacing: 3, textTransform: 'uppercase', marginTop: 5}}>
          {role}
        </div>
      </div>
    </div>
  );
};

// ---------- 1) Cold Open ----------
const OpenScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 32, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 62, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 26}}>
      <div style={{
        opacity: a, fontSize: 27, fontWeight: 900, color: C.red,
        letterSpacing: 6, textTransform: 'uppercase',
      }}>Der Fall</div>
      <div style={{opacity: a, fontSize: 62, fontWeight: 900, color: C.ink, lineHeight: 1.16, maxWidth: 900}}>
        Der Auftrag ging<br />an jemand anderen.
      </div>
      <div style={{
        opacity: b, background: C.card, border: `2px solid ${C.border}`, borderRadius: 18,
        padding: '18px 26px', fontSize: 30, color: C.muted, fontWeight: 700, lineHeight: 1.4, maxWidth: 860,
      }}>
        Gleicher Ort. Gleiches Gewerk.<br />Gleicher Preis.
      </div>
      <div style={{opacity: c, fontSize: 33, fontWeight: 900, color: C.gold}}>
        Wir haben die Gewinnerin befragt. 🎙️
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2) Das Interview ----------
const QUOTES = [
  {at: 8,   text: 'Ich war offen, als er gesucht hat.',      sub: 'Halb zwölf nachts, auf dem Sofa.'},
  {at: 74,  text: 'Bei mir stand, was es ungefähr kostet.',   sub: 'Er musste nicht erst fragen.'},
  {at: 140, text: 'Er konnte tippen und telefonieren.',       sub: 'Ohne die Nummer zu suchen.'},
  {at: 206, text: 'Ich habe echte Arbeit gezeigt.',           sub: 'Drei eigene Fotos. Keine Stockbilder.'},
];

const TalkScene = () => {
  const f = useCurrentFrame();
  const done = QUOTES.filter(q => f > q.at + 14).length;
  const active = QUOTES.filter(q => f >= q.at).length - 1;
  const cur = QUOTES[Math.max(0, active)];
  const local = f - cur.at;
  const s = spring({frame: local, fps: 30, config: {damping: 17, mass: 0.8}});
  const subS = spring({frame: local - 16, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{padding: '250px 66px 150px', display: 'flex', flexDirection: 'column'}}>
      <StepProgress current={done} total={4} color={C.gold} />
      {/* Zitat mittig — jeder Schnitt ist ein Pattern Interrupt */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22}}>
        <div style={{
          opacity: s, transform: `translateY(${(1 - s) * 26}px)`,
          fontSize: 62, fontWeight: 900, color: C.ink, lineHeight: 1.2, textAlign: 'left',
        }}>„{cur.text}"</div>
        <div style={{
          opacity: subS, transform: `translateX(${(1 - subS) * 26}px)`,
          fontSize: 34, fontWeight: 800, color: C.gold, lineHeight: 1.3, textAlign: 'left',
        }}>{cur.sub}</div>
      </div>
      {/* Namensschild unten wie in der Doku */}
      <LowerThird name="Die andere Website" role="Hat den Auftrag bekommen" color={C.teal} at={4} />
      <PeakFlash at={206} color={C.gold} strength={0.16} />
    </AbsoluteFill>
  );
};

// ---------- 3) Die Wendung ----------
const TwistScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 28, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 26}}>
      <PeakFlash at={3} color={C.red} strength={0.2} />
      <div style={{opacity: a, fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 920}}>
        Sie war nicht schöner<br />als deine.<br />
        <span style={{color: C.gold}}>Sie war beantwortbar.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Der Kunde hat nicht verglichen. Er hat aufgehört zu suchen." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Das Protokoll (speicherbar) ----------
const RECAP_ITEMS = [
  {at: 6,  t: 'Erreichbar, wenn er sucht – auch nachts'},
  {at: 28, t: 'Preisrahmen sichtbar, nicht auf Anfrage'},
  {at: 50, t: 'Anrufen mit einem Fingertipp'},
  {at: 72, t: 'Eigene Fotos statt Stockbilder'},
];

const RecapScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, gap: 20}}>
      <PeakFlash at={2} color={C.green} strength={0.18} />
      <div style={{opacity: a, fontSize: 32, fontWeight: 900, color: C.green, letterSpacing: 3, textTransform: 'uppercase'}}>
        Das Protokoll
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 6}}>
        {RECAP_ITEMS.map((x, i) => {
          const s = spring({frame: f - x.at, fps: 30, config: {damping: 16}});
          if (s <= 0.001) return null;
          return (
            <div key={i} style={{
              opacity: s, transform: `translateX(${(1 - s) * -28}px)`, width: 900,
              background: C.card, border: `2px solid ${C.green}55`, borderRadius: 16,
              padding: '20px 24px', fontSize: 33, fontWeight: 800, color: C.ink, textAlign: 'left',
            }}>✓ {x.t}</div>
          );
        })}
      </div>
      <div style={{opacity: spring({frame: f - 88, fps: 30, config: {damping: 15}}), maxWidth: 880, marginTop: 10}}>
        <YouAre text="Vier Punkte. Keiner davon ist Design." color={C.green} />
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
        🔖 Speicher dir die vier Punkte<br />und geh deine Seite durch.
      </div>
      <div style={{opacity: q, fontSize: 25, color: C.muted, fontWeight: 700}}>
        Wie viele davon erfüllt sie? Schreib die Zahl in die Kommentare.
      </div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{fontSize: 24, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 45, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
          Websites, die<br /><span style={{color: C.teal}}>antworten</span>
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

// ---------- Wurzel ----------
const Inner = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Sequence from={0} durationInFrames={OPEN}><OpenScene /></Sequence>
      <Sequence from={OPEN} durationInFrames={TALK}><TalkScene /></Sequence>
      <Sequence from={OPEN + TALK} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={OPEN + TALK + TWIST} durationInFrames={RECAP}><RecapScene /></Sequence>
      <Sequence from={OPEN + TALK + TWIST + RECAP} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={OPEN + TALK + TWIST}>
        <OpenLoop text={OPEN_Q} hint="4 Aussagen · Auflösung am Ende" color={C.gold} />
      </Sequence>
      {/* Doku-Rahmen liegt über allem und läuft durchgehend */}
      <CamFrame globalF={f} />
    </>
  );
};

export const DieDoku = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(880px 880px at 540px 560px, rgba(245,185,69,0.07), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Inner />
    </LoopSeam>
  </AbsoluteFill>
);
