// Gestaltete Vorschaubilder (Cover/Thumbnail) — ersetzen den dunklen Auto-Frame der Plattformen.
// Zwei Formate aus EINER Gestaltung:
//   Cover916 → 1080×1920 (TikTok, Instagram, Pinterest)
//   Cover169 → 1280×720  (YouTube-Thumbnail)
// Props (inputProps): { headline, kicker, accent, badge }
//
// Designregeln (bewusst, nicht dekorativ):
//  - Deutlich heller als das Video selbst: die Videos liegen bei Luminanz ~14/255, ein Cover
//    muss im dunklen Feed als Fläche lesbar sein → große helle Typo + Akzentflächen.
//  - Kein Neon-Glow (Marken-Anti-Pattern), stattdessen Tiefe über Verlauf, Kante, Kontrast.
//  - SAFE ZONE: Kernaussage liegt im mittleren Quadrat, weil Feeds 9:16-Cover auf 1:1
//    beschneiden (Profil-Raster) — sonst wird die Headline abgeschnitten.
import {AbsoluteFill} from 'remotion';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99',
  violet: '#7c5cff', teal: '#34e3d0', card: '#15141d', border: '#2a2836',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const ACCENTS = { violet: C.violet, teal: C.teal, red: '#ff5468', gold: '#f5b945', green: '#3ddc84' };

// Schriftgröße an Textlänge koppeln, damit lange Headlines nicht aus dem Bild laufen
const fitSize = (text, base, min) => {
  const n = (text || '').length;
  if (n <= 22) return base;
  if (n <= 34) return Math.round(base * 0.82);
  if (n <= 48) return Math.round(base * 0.68);
  if (n <= 64) return Math.round(base * 0.56);
  return min;
};

const Backdrop = ({accent}) => (
  <>
    <AbsoluteFill style={{background: C.bg}} />
    {/* Tiefe: zwei weiche Verläufe statt flacher Fläche */}
    <AbsoluteFill style={{
      background: `radial-gradient(120% 80% at 18% 8%, ${accent}22 0%, transparent 55%),
                   radial-gradient(120% 90% at 88% 96%, ${C.teal}18 0%, transparent 60%)`,
    }} />
    {/* feine Textur, damit die Fläche nicht digital-leer wirkt */}
    <AbsoluteFill style={{
      backgroundImage: `repeating-linear-gradient(115deg, rgba(255,255,255,0.020) 0 1px, transparent 1px 4px)`,
      opacity: 0.5,
    }} />
  </>
);

const Wordmark = ({scale = 1}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14 * scale}}>
    <div style={{
      width: 40 * scale, height: 40 * scale, borderRadius: 11 * scale,
      background: `linear-gradient(140deg, ${C.violet}, ${C.teal})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#0b0a0f', fontWeight: 900, fontSize: 22 * scale, fontFamily: FONT,
    }}>b</div>
    <div style={{color: C.muted, fontFamily: FONT, fontWeight: 700, fontSize: 24 * scale, letterSpacing: 0.4}}>
      beekenwebengineering.com
    </div>
  </div>
);

// ---------- 9:16 (TikTok / Instagram / Pinterest) ----------
export const Cover916 = ({headline = 'Headline fehlt', kicker = '', accent = 'violet', badge = ''}) => {
  const A = ACCENTS[accent] || accent;
  const size = fitSize(headline, 132, 66);
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Backdrop accent={A} />
      {/* SAFE-ZONE-Block: mittleres Quadrat, übersteht den 1:1-Crop im Profilraster */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 92px'}}>
        <div style={{width: '100%', maxWidth: 900}}>
          {kicker ? (
            <div style={{
              display: 'inline-block', color: A, fontWeight: 900, fontSize: 34,
              letterSpacing: 6, textTransform: 'uppercase', marginBottom: 30,
              padding: '12px 22px', borderRadius: 999,
              background: `${A}1f`, border: `2px solid ${A}55`,
            }}>{kicker}</div>
          ) : null}

          <div style={{
            color: C.ink, fontWeight: 900, fontSize: size, lineHeight: 1.03,
            letterSpacing: -1.5, textWrap: 'balance',
          }}>{headline}</div>

          {/* Akzentbalken statt Glow: gibt Kante und Markenfarbe ohne Neon */}
          <div style={{
            marginTop: 42, height: 12, width: 260, borderRadius: 999,
            background: `linear-gradient(90deg, ${A}, ${C.teal})`,
          }} />

          {badge ? (
            <div style={{
              marginTop: 40, display: 'inline-block', color: C.ink, fontWeight: 800, fontSize: 36,
              padding: '16px 26px', borderRadius: 18,
              background: C.card, border: `2px solid ${C.border}`,
            }}>{badge}</div>
          ) : null}
        </div>
      </AbsoluteFill>

      <div style={{position: 'absolute', left: 92, bottom: 96}}><Wordmark scale={1.15} /></div>
    </AbsoluteFill>
  );
};

// ---------- 16:9 (YouTube-Thumbnail) ----------
export const Cover169 = ({headline = 'Headline fehlt', kicker = '', accent = 'violet', badge = ''}) => {
  const A = ACCENTS[accent] || accent;
  const size = fitSize(headline, 104, 52);
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Backdrop accent={A} />
      <AbsoluteFill style={{justifyContent: 'center', padding: '0 78px'}}>
        <div style={{maxWidth: 1000}}>
          {kicker ? (
            <div style={{
              display: 'inline-block', color: A, fontWeight: 900, fontSize: 26,
              letterSpacing: 5, textTransform: 'uppercase', marginBottom: 20,
              padding: '9px 18px', borderRadius: 999,
              background: `${A}1f`, border: `2px solid ${A}55`,
            }}>{kicker}</div>
          ) : null}
          <div style={{
            color: C.ink, fontWeight: 900, fontSize: size, lineHeight: 1.04,
            letterSpacing: -1.2, textWrap: 'balance',
          }}>{headline}</div>
          <div style={{
            marginTop: 28, height: 10, width: 200, borderRadius: 999,
            background: `linear-gradient(90deg, ${A}, ${C.teal})`,
          }} />
        </div>
      </AbsoluteFill>
      {badge ? (
        <div style={{
          position: 'absolute', right: 78, top: 70, color: C.ink, fontWeight: 900, fontSize: 40,
          padding: '18px 26px', borderRadius: 18, background: C.card, border: `2px solid ${C.border}`,
        }}>{badge}</div>
      ) : null}
      <div style={{position: 'absolute', left: 78, bottom: 58}}><Wordmark scale={0.95} /></div>
    </AbsoluteFill>
  );
};
