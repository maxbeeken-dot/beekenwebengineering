// Psychologie-Bausteine für Retention — jede Komponente setzt EIN belegtes Prinzip um.
// Ziel: Menschen schauen weiter, nicht: Menschen werden ausgetrickst. Alle Mechaniken
// müssen inhaltlich eingelöst werden (offene Frage wird beantwortet, Zähler zählt echt).
//
// Warum das zählt: Watch-Time/Completion ist Ranking-Faktor #1, die Bleib-Entscheidung
// fällt in ~1,7 s. Retention ist damit kein Deko-Thema, sondern der Reichweiten-Hebel.
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

const C = {
  ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

/**
 * ZEIGARNIK-EFFEKT (offene Schleife)
 * Unerledigtes bleibt im Kopf. Eine im Bild stehende, noch unbeantwortete Frage erzeugt
 * Spannung, die erst mit der Auflösung endet — der stärkste Retention-Hebel für Kurzvideo.
 * PFLICHT: Die Frage MUSS im Video beantwortet werden, sonst ist es Clickbait.
 * Einsatz: dauerhaft im oberen Bilddrittel ab Frame 0.
 */
export const OpenLoop = ({text, hint = 'Auflösung am Ende', color = C.gold}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <div style={{
      position: 'absolute', top: 54, left: 0, right: 0, display: 'flex',
      justifyContent: 'center', opacity: s, transform: `translateY(${(1 - s) * -16}px)`,
      fontFamily: FONT, pointerEvents: 'none',
    }}>
      <div style={{
        maxWidth: 900, textAlign: 'center', background: 'rgba(21,20,29,0.86)',
        border: `2px solid ${color}55`, borderRadius: 18, padding: '14px 26px',
      }}>
        <div style={{fontSize: 34, fontWeight: 900, color: C.ink, lineHeight: 1.18}}>{text}</div>
        <div style={{fontSize: 23, fontWeight: 800, color, letterSpacing: 2, marginTop: 6}}>{hint}</div>
      </div>
    </div>
  );
};

/**
 * GOAL-GRADIENT-EFFEKT
 * Je sichtbarer das Ziel näher rückt, desto stärker der Drang durchzuhalten.
 * Ein „3 von 5"-Zähler macht das Ende greifbar — der Zuschauer will die Reihe vollenden.
 */
export const StepProgress = ({current, total, color = C.teal}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f - 4, fps: 30, config: {damping: 18}});
  return (
    <div style={{
      position: 'absolute', top: 168, left: 0, right: 0, display: 'flex',
      flexDirection: 'column', alignItems: 'center', gap: 10, opacity: s, fontFamily: FONT,
    }}>
      <div style={{display: 'flex', gap: 10}}>
        {Array.from({length: total}).map((_, i) => (
          <div key={i} style={{
            width: i < current ? 42 : 22, height: 10, borderRadius: 999,
            background: i < current ? color : C.dim, transition: 'none',
          }} />
        ))}
      </div>
      <div style={{fontSize: 22, fontWeight: 800, color: C.muted, letterSpacing: 3}}>
        {current} VON {total}
      </div>
    </div>
  );
};

/**
 * PEAK-END-RULE
 * Erinnert wird der stärkste Moment und das Ende — nicht der Durchschnitt.
 * Kurzer, harter Betonungs-Blitz für den Höhepunkt (z.B. die Auflösung).
 */
export const PeakFlash = ({at, color = C.teal, strength = 0.5}) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < 0 || d > 12) return null;
  const o = interpolate(d, [0, 3, 12], [0, strength, 0], {extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', inset: 0, background: color, opacity: o, pointerEvents: 'none'}} />;
};

/**
 * PATTERN INTERRUPT
 * Das Gehirn blendet Gleichförmiges aus. Ein Bruch (Ruck/Wechsel) alle ~2–3 s setzt die
 * Aufmerksamkeit zurück und verhindert das Wegwischen in der Mitte.
 * Legt eine kurze Verschiebung über den Inhalt — sparsam einsetzen.
 */
export const PatternInterrupt = ({every = 80, children}) => {
  const f = useCurrentFrame();
  const phase = f % every;
  const kick = phase < 5 ? interpolate(phase, [0, 2, 5], [0, 1, 0]) : 0;
  return (
    <div style={{transform: `translateX(${kick * 9}px) scale(${1 + kick * 0.012})`}}>
      {children}
    </div>
  );
};

/**
 * LOSS AVERSION (Prospect Theory)
 * Verluste wiegen etwa doppelt so schwer wie gleich große Gewinne. „Das kostet dich X"
 * hält länger am Bildschirm als „Das bringt dir X".
 * Gegenmittel zur FUNDAMENTAL ATTRIBUTION ERROR: die Formulierung beschuldigt die
 * Situation, nicht den Zuschauer — sonst steigt er aus Trotz aus.
 */
export const LossTag = ({text, color = C.red}) => (
  <div style={{
    display: 'inline-block', fontFamily: FONT, fontSize: 30, fontWeight: 900, color,
    background: `${color}1a`, border: `2px solid ${color}55`, borderRadius: 12, padding: '10px 20px',
  }}>{text}</div>
);

/**
 * UNITY / SELBST-IDENTIFIKATION
 * „Einer von uns" bindet. Wer sich direkt angesprochen fühlt („Wenn du Handwerker bist…"),
 * bleibt — der Rest wischt weg, was der Verweildauer sogar nutzt (sauberes Zielsignal).
 */
export const YouAre = ({text, color = C.violet}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f, fps: 30, config: {damping: 15}});
  return (
    <div style={{
      opacity: s, transform: `scale(${0.94 + s * 0.06})`, fontFamily: FONT,
      fontSize: 40, fontWeight: 900, color: C.ink, textAlign: 'center', lineHeight: 1.2,
      borderLeft: `8px solid ${color}`, paddingLeft: 22, textAlign: 'left',
    }}>{text}</div>
  );
};

/**
 * NAHTLOSER LOOP (Rewatch = zusätzliche Watch-Time)
 * Wenn das Ende optisch an den Anfang anschließt, startet das Video „unbemerkt" neu.
 * Rewatches zählen voll auf die Watch-Time ein und sind bei Reels ein starkes Signal.
 * Einsatz: letzte ~15 Frames auf den Look des ersten Frames zurückblenden.
 */
export const LoopSeam = ({frames = 15, children}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const start = durationInFrames - frames;
  const o = f < start ? 1 : interpolate(f, [start, durationInFrames - 1], [1, 0], {extrapolateRight: 'clamp'});
  return <div style={{opacity: o}}>{children}</div>;
};

/**
 * SOCIAL PROOF / BANDWAGON
 * Zahlen aus dem echten Umfeld senken das wahrgenommene Risiko. NUR mit belegbaren
 * Angaben verwenden — erfundene Zahlen widersprechen der Marke („keine leeren Zahlen").
 */
export const ProofChip = ({text, color = C.green}) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: FONT,
    fontSize: 26, fontWeight: 800, color: C.ink,
    background: C.card, border: `2px solid ${color}55`, borderRadius: 999, padding: '10px 20px',
  }}>
    <span style={{color, fontSize: 22}}>●</span>{text}
  </div>
);
