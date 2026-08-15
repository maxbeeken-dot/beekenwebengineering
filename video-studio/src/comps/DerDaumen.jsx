// „Der Daumen" — Säule 1 (Websites).
//
// NEUES FORMAT im Bestand: Handy-Silhouette mit echtem Reichweiten-Bogen (SVG-Kreisbogen),
// an dem vier Bedienelemente geprüft werden. Bisher gab es Karten, Zeitleisten, Bänder,
// Spalten, Suchleiste, Streichliste — aber nie eine geometrische Prüfung im Gerät.
//
// UNBESPIELTES THEMA: einhändige Bedienbarkeit. BlickHeatmap behandelt, WOHIN der Blick
// fällt; MobileFail, WIE die Seite aussieht. Hier geht es darum, was der Daumen physisch
// ERREICHT — ein anderer Mechanismus und eine andere Konsequenz.
//
// Keine erfundenen Statistiken: es wird keine Prozentzahl zur Einhandnutzung behauptet,
// der Punkt trägt sich über die Geometrie selbst.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 4 Prüfungen)
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
const HOOK = 100, ZONE = 280, TWIST = 80, FIX = 90, CTA = 50;
const OPEN_Q = 'Was erreicht sein Daumen davon?';

// ---------- 1) Hook ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 36, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 70, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 76, gap: 26}}>
      <div style={{opacity: a, fontSize: 100, lineHeight: 1}}>👍</div>
      <div style={{opacity: a, fontSize: 54, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 920}}>
        Dein Kunde hält das Handy<br />in einer Hand.
      </div>
      <div style={{
        opacity: b, background: C.card, border: `2px solid ${C.border}`, borderRadius: 18,
        padding: '20px 28px', fontSize: 31, color: C.muted, fontWeight: 700, lineHeight: 1.4, maxWidth: 880,
      }}>
        In der anderen: Einkauf, Kaffee,<br />Werkzeug, Kind.
      </div>
      <div style={{opacity: c, fontSize: 34, fontWeight: 900, color: C.gold}}>
        Nur ein Daumen ist frei. 👀
      </div>
      <PeakFlash at={70} color={C.gold} strength={0.13} />
    </AbsoluteFill>
  );
};

// ---------- 2) Die Prüfung am Gerät ----------
// y-Werte sind Anteile der Bildschirmhöhe (0 = oben), x Anteile der Breite.
const ELEMENTE = [
  {at: 10,  x: 0.86, y: 0.07, label: 'Telefonnummer',   ort: 'oben rechts',        ok: false, urteil: 'Kommt er nicht ran.'},
  {at: 76,  x: 0.88, y: 0.15, label: 'Menü',            ort: 'oben rechts',        ok: false, urteil: 'Umgreifen oder zweite Hand.'},
  {at: 142, x: 0.50, y: 0.46, label: 'Anfrageformular', ort: 'Bildmitte',          ok: false, urteil: 'Erst nach langem Scrollen.'},
  {at: 208, x: 0.50, y: 0.90, label: 'Anruf-Knopf',     ort: 'unten, mitlaufend',  ok: true,  urteil: 'Genau im Daumen.'},
];

const PHONE_W = 520, PHONE_H = 1000;

const PhoneScene = () => {
  const f = useCurrentFrame();
  const idx = Math.max(0, ELEMENTE.filter(e => f >= e.at).length - 1);
  const done = ELEMENTE.filter(e => f > e.at + 26).length;
  const bogen = spring({frame: f - 6, fps: 30, config: {damping: 18}});
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '246px 40px 60px'}}>
      <StepProgress current={done} total={4} color={C.teal} />
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26,
        minHeight: 1440, justifyContent: 'flex-start', marginTop: 24,
      }}>
        {/* Gerät */}
        <div style={{
          position: 'relative', width: PHONE_W, height: PHONE_H,
          background: C.cardHi, border: `3px solid ${C.border}`, borderRadius: 46,
        }}>
          {/* Reichweite des Daumens: Viertelkreis um die untere rechte Ecke */}
          <svg width={PHONE_W} height={PHONE_H} style={{position: 'absolute', inset: 0}}>
            <defs>
              {/* kräftig genug, dass die Reichweite die Kernaussage trägt */}
              <radialGradient id="reach" cx="88%" cy="94%" r="78%">
                <stop offset="0%" stopColor={C.teal} stopOpacity="0.55" />
                <stop offset="65%" stopColor={C.teal} stopOpacity="0.26" />
                <stop offset="100%" stopColor={C.teal} stopOpacity="0.04" />
              </radialGradient>
            </defs>
            <circle
              cx={PHONE_W * 0.88} cy={PHONE_H * 0.94} r={PHONE_W * 1.02 * bogen}
              fill="url(#reach)" stroke={C.teal} strokeOpacity="0.55" strokeWidth="3"
              strokeDasharray="10 10"
            />
          </svg>
          {/* Beschriftung der Zone, damit der Bogen selbsterklärend ist */}
          <div style={{
            position: 'absolute', left: 22, bottom: 20, opacity: bogen,
            fontSize: 22, fontWeight: 900, color: C.teal, letterSpacing: 2, textTransform: 'uppercase',
          }}>Daumen-Reichweite</div>

          {/* Geprüfte Elemente */}
          {ELEMENTE.map((e, i) => {
            const s = spring({frame: f - e.at, fps: 30, config: {damping: 16, mass: 0.8}});
            if (s <= 0.02) return null;
            const aktiv = i === idx;
            const ton = e.ok ? C.green : C.red;
            return (
              <div key={i} style={{
                position: 'absolute',
                left: PHONE_W * e.x, top: PHONE_H * e.y,
                transform: `translate(-50%,-50%) scale(${aktiv ? 1 : 0.9})`,
                opacity: aktiv ? 1 : 0.5,
                background: C.card, border: `3px solid ${ton}`, borderRadius: 999,
                padding: '10px 16px', whiteSpace: 'nowrap',
                fontSize: 24, fontWeight: 900, color: ton,
              }}>{e.ok ? '✓' : '✕'} {e.label}</div>
            );
          })}
        </div>

        {/* Urteil zum aktuellen Element */}
        {(() => {
          const e = ELEMENTE[idx];
          const s = spring({frame: f - e.at - 16, fps: 30, config: {damping: 15}});
          const ton = e.ok ? C.green : C.red;
          return (
            <div style={{
              opacity: s, transform: `translateY(${(1 - s) * 18}px)`, width: 930,
              background: C.card, border: `2px solid ${ton}55`, borderRadius: 20,
              padding: '22px 26px', textAlign: 'left',
            }}>
              <div style={{fontSize: 25, fontWeight: 900, color: ton, letterSpacing: 3, textTransform: 'uppercase'}}>
                {e.label} · {e.ort}
              </div>
              <div style={{fontSize: 38, fontWeight: 900, color: C.ink, marginTop: 8}}>{e.urteil}</div>
            </div>
          );
        })()}
      </div>
      <PeakFlash at={208} color={C.green} strength={0.16} />
    </AbsoluteFill>
  );
};

// ---------- 3) Die Wendung ----------
const TwistScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 38, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 26}}>
      <PeakFlash at={2} color={C.gold} strength={0.2} />
      <div style={{opacity: a, fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.22, maxWidth: 930}}>
        Das Wichtigste steht oben.<br />
        <span style={{color: C.gold}}>Der Daumen ist aber unten.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Er gibt nicht auf, weil er nicht will. Er kommt nicht hin." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Auflösung ----------
const FIXES = [
  {at: 4,  t: 'Anruf-Knopf unten fixieren, immer sichtbar'},
  {at: 26, t: 'Wichtigste Aktion in die untere Bildhälfte'},
  {at: 48, t: 'Oben nur Logo – dort greift niemand hin'},
];

const FixScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 20}}>
      <PeakFlash at={2} color={C.green} strength={0.18} />
      <div style={{opacity: a, fontSize: 32, fontWeight: 900, color: C.green, letterSpacing: 3, textTransform: 'uppercase'}}>
        Drei Handgriffe
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
        <YouAre text="Bequem ist kein Luxus. Bequem ist der Anruf." color={C.green} />
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
        👇 Handy in EINE Hand,<br />deine Seite öffnen.
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700, maxWidth: 860}}>
        Kommst du an die Telefonnummer? Ja oder nein in die Kommentare. 🔖
      </div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{fontSize: 24, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 45, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
          Websites, die<br /><span style={{color: C.teal}}>in eine Hand passen</span>
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

export const DerDaumen = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(860px 860px at 540px 560px, rgba(52,227,208,0.08), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={ZONE}><PhoneScene /></Sequence>
      <Sequence from={HOOK + ZONE} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={HOOK + ZONE + TWIST} durationInFrames={FIX}><FixScene /></Sequence>
      <Sequence from={HOOK + ZONE + TWIST + FIX} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + ZONE + TWIST}>
        <OpenLoop text={OPEN_Q} hint="4 Elemente · Auflösung am Ende" color={C.teal} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
