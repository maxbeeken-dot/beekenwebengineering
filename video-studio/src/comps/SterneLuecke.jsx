// „Die Sterne-Lücke" — Säule 1 (Websites).
// Trend-Anschluss (Recherche 07.08.2026): Transition-/Reveal-Formate dominieren gerade.
// Unbespieltes Thema: Diskrepanz zwischen sehr gutem Ruf (Google-Bewertungen) und dem
// Webauftritt. Lobt die Arbeit des Zuschauers und schiebt das Problem auf die Situation
// (Fundamental Attribution Error vermeiden) — er soll nicht aus Trotz wegwischen.
//
// Psychologie (Psych.jsx): OpenLoop (Zeigarnik, PFLICHT) · LossTag (Loss Aversion) ·
// YouAre (Unity) · PeakFlash (Peak-End) · LoopSeam (Rewatch) · Kontrast (Ruf vs. Auftritt).
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
const GOOGLE = 120, TAP = 60, SITE = 150, GAP = 120, ANSWER = 90, CTA = 60;

const OPEN_Q = 'Warum ruft er trotzdem nicht an?';

const Stars = ({value, size = 40, color = C.gold}) => (
  <div style={{display: 'flex', gap: 4, fontSize: size, lineHeight: 1}}>
    {[0, 1, 2, 3, 4].map(i => (
      <span key={i} style={{color: i < Math.round(value) ? color : C.dim}}>★</span>
    ))}
  </div>
);

// ---------- 1) Google-Treffer: der gute Ruf ----------
const GoogleScene = () => {
  const f = useCurrentFrame();
  const card = spring({frame: f - 6, fps: 30, config: {damping: 16}});
  const line = spring({frame: f - 40, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 60}}>
      <div style={{
        width: 900, background: C.card, border: `2px solid ${C.border}`, borderRadius: 24,
        padding: 40, opacity: card, transform: `translateY(${(1 - card) * 26}px)`,
      }}>
        <div style={{fontSize: 26, color: C.muted, fontWeight: 700, marginBottom: 12}}>google.de</div>
        <div style={{fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.12}}>
          Meisterbetrieb Sander
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 20}}>
          <Stars value={5} size={44} />
          <span style={{fontSize: 46, fontWeight: 900, color: C.gold, fontVariantNumeric: 'tabular-nums'}}>4,9</span>
          <span style={{fontSize: 30, color: C.muted, fontWeight: 700}}>· 127 Bewertungen</span>
        </div>
        <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12}}>
          {['„Saubere Arbeit, pünktlich."', '„Nie wieder wer anders."', '„Absolut empfehlenswert."'].map((t, i) => (
            <div key={i} style={{
              opacity: spring({frame: f - 46 - i * 12, fps: 30, config: {damping: 18}}),
              fontSize: 28, color: C.ink, fontWeight: 700,
              background: C.cardHi, border: `2px solid ${C.border}`, borderRadius: 12, padding: '12px 18px',
            }}>{t}</div>
          ))}
        </div>
      </div>
      <div style={{opacity: line, marginTop: 30, fontSize: 34, fontWeight: 800, color: C.green}}>
        Die Arbeit stimmt. ✓
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2) Der Klick (Transition) ----------
const TapScene = () => {
  const f = useCurrentFrame();
  const press = spring({frame: f - 10, fps: 30, config: {damping: 11, mass: 0.5}});
  const wipe = interpolate(f, [26, 52], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: 36, fontWeight: 800, color: C.muted, marginBottom: 24}}>
          Dann klickt er auf deine Website.
        </div>
        <div style={{
          fontSize: 96, transform: `scale(${1 - press * 0.18})`,
        }}>👆</div>
      </div>
      {/* harter Wisch als Übergang — Reveal-Trend */}
      <div style={{
        position: 'absolute', inset: 0, background: C.bg,
        clipPath: `inset(0 0 ${100 - wipe}% 0)`,
      }} />
      <PeakFlash at={30} color={C.red} strength={0.28} />
    </AbsoluteFill>
  );
};

// ---------- 3) Die Website: der Bruch ----------
const FLAWS = [
  {at: 22, t: 'Lädt seit 6 Sekunden'},
  {at: 54, t: 'Am Handy nicht bedienbar'},
  {at: 86, t: 'Letzte Änderung: 2011'},
  {at: 116, t: 'Kontakt? Irgendwo unten'},
];

const SiteScene = () => {
  const f = useCurrentFrame();
  // Sternewert der WEBSITE fällt sichtbar ab — Kontrast zum Ruf
  const rating = interpolate(f, [10, 30, 60, 92, 124], [4.9, 3.6, 2.9, 2.3, 2.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 56, gap: 26}}>
      <div style={{fontSize: 28, letterSpacing: 5, color: C.muted, fontWeight: 900, textTransform: 'uppercase'}}>
        Der erste Eindruck online
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <Stars value={rating} size={54} color={C.red} />
        <span style={{fontSize: 76, fontWeight: 900, color: C.red, fontVariantNumeric: 'tabular-nums'}}>
          {rating.toFixed(1).replace('.', ',')}
        </span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14, width: 860, marginTop: 6}}>
        {FLAWS.map((x, i) => {
          const s = spring({frame: f - x.at, fps: 30, config: {damping: 16, mass: 0.7}});
          if (s <= 0.001) return null;
          return (
            <div key={i} style={{
              opacity: s, transform: `translateX(${(1 - s) * -36}px)`,
              background: C.card, border: `2px solid ${C.red}33`, borderRadius: 14,
              padding: '16px 22px', fontSize: 30, fontWeight: 700, color: C.ink,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span style={{color: C.red, fontWeight: 900}}>✕</span>{x.t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Lücke ----------
const GapScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 18, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 44, fps: 30, config: {damping: 15}});
  const Col = ({label, value, color, sub, o}) => (
    <div style={{
      flex: 1, background: C.card, border: `2px solid ${color}55`, borderRadius: 22,
      padding: '30px 22px', textAlign: 'center', opacity: o, transform: `scale(${0.94 + o * 0.06})`,
    }}>
      <div style={{fontSize: 25, letterSpacing: 3, color: C.muted, fontWeight: 900, textTransform: 'uppercase'}}>{label}</div>
      <div style={{fontSize: 88, fontWeight: 900, color, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums'}}>{value}</div>
      <div style={{fontSize: 25, color: C.muted, fontWeight: 700, marginTop: 6}}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 52, gap: 30}}>
      <div style={{display: 'flex', gap: 20, width: '100%'}}>
        <Col label="Dein Ruf" value="4,9" color={C.gold} sub="127 Bewertungen" o={a} />
        <Col label="Deine Website" value="2,0" color={C.red} sub="in 3 Sekunden" o={b} />
      </div>
      <div style={{opacity: c}}>
        <LossTag text="Diese Lücke kostet dich den Anruf." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5) Auflösung der offenen Frage ----------
const AnswerScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 80, gap: 28}}>
      <PeakFlash at={2} color={C.teal} strength={0.2} />
      <div style={{opacity: a, fontSize: 34, fontWeight: 900, color: C.teal, letterSpacing: 3, textTransform: 'uppercase'}}>
        Deshalb ruft er nicht an
      </div>
      <div style={{opacity: a, fontSize: 58, fontWeight: 900, color: C.ink, lineHeight: 1.16, maxWidth: 900}}>
        Vertrauen bricht<br />am <span style={{color: C.gold}}>schwächsten Glied</span>.
      </div>
      <div style={{opacity: b, maxWidth: 860, marginTop: 6}}>
        <YouAre text="Deine Arbeit ist 4,9 wert. Dein Auftritt sollte es auch sein." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6) CTA ----------
const CtaScene = () => {
  const f = useCurrentFrame();
  const q = spring({frame: f, fps: 30, config: {damping: 15}});
  const line = spring({frame: f - 16, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f / 7) * 0.02;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, gap: 18}}>
      <div style={{opacity: q, fontSize: 38, fontWeight: 900, color: C.gold, lineHeight: 1.25, maxWidth: 880}}>
        👇 Wie viele Sterne hätte<br />DEINE Website – ehrlich?
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700}}>Schreib die Zahl in die Kommentare.</div>
      <div style={{opacity: line, marginTop: 14}}>
        <div style={{fontSize: 25, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 46, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 6}}>
          Ein Auftritt, der zu<br />deinem <span style={{color: C.gold}}>Ruf</span> passt
        </div>
      </div>
      <div style={{opacity: line, marginTop: 14}}>
        <div style={{transform: `scale(${pulse})`, padding: '18px 36px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 30, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SterneLuecke = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(820px 820px at 540px 560px, rgba(245,185,69,0.08), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={GOOGLE}><GoogleScene /></Sequence>
      <Sequence from={GOOGLE} durationInFrames={TAP}><TapScene /></Sequence>
      <Sequence from={GOOGLE + TAP} durationInFrames={SITE}><SiteScene /></Sequence>
      <Sequence from={GOOGLE + TAP + SITE} durationInFrames={GAP}><GapScene /></Sequence>
      <Sequence from={GOOGLE + TAP + SITE + GAP} durationInFrames={ANSWER}><AnswerScene /></Sequence>
      <Sequence from={GOOGLE + TAP + SITE + GAP + ANSWER} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife läuft mit, bis die Auflösung kommt (Zeigarnik) */}
      <Sequence from={0} durationInFrames={GOOGLE + TAP + SITE + GAP}>
        <OpenLoop text={OPEN_Q} hint="Auflösung am Ende" />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
