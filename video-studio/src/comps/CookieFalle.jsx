import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const SETUP = 60, BLOCK = 90, WEG = 90, RICHTIG = 150, INSIGHT = 90, CTA = 75; // 555

// Phone mit Kaufen-Button UNTEN im Body (damit der Cookie-Banner ihn physisch verdecken kann)
const Phone = ({buyColor = C.green, glow = true, tinyAblehnen = false, children}) => (
  <div style={{width: 500, height: 940, background: C.card, border: `3px solid ${C.border}`, borderRadius: 46, padding: 22, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
    <div style={{width: 130, height: 24, background: C.bg, borderRadius: 20, margin: '0 auto 16px'}} />
    <div style={{height: 240, background: `linear-gradient(135deg, ${C.border}, ${C.card})`, borderRadius: 16}} />
    <div style={{fontSize: 36, fontWeight: 900, color: C.ink, marginTop: 18}}>Sneaker · 49 €</div>
    <div style={{fontSize: 22, color: C.muted, marginTop: 6}}>★★★★★ · sofort lieferbar</div>
    <div style={{flex: 1}} />
    {tinyAblehnen && <div style={{position: 'absolute', right: 34, bottom: 250, fontSize: 15, color: C.dim, textDecoration: 'underline'}}>ablehnen</div>}
    <div style={{background: buyColor, color: '#04120f', borderRadius: 16, padding: '22px', fontSize: 34, fontWeight: 900, textAlign: 'center', boxShadow: glow ? `0 0 32px ${buyColor}66` : 'none'}}>JETZT KAUFEN</div>
    {children}
  </div>
);

const Cursor = ({x, y, color = C.ink}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 28, height: 28, borderRadius: 28, background: color, border: '3px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.55)', zIndex: 60}} />
);

const Stage = ({children}) => (
  <div style={{position: 'relative', width: 500, height: 940}}>{children}</div>
);

const SetupScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const cx = interpolate(f, [10, 55], [360, 250], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cy = interpolate(f, [10, 55], [880, 838], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '92px 40px 0', gap: 22}}>
      <div style={{fontSize: 46, fontWeight: 900, color: C.ink, opacity: a, textAlign: 'center'}}>So verlierst du Kunden<br />in 2 Sek. 🍪</div>
      <Stage><Phone /><Cursor x={cx} y={cy} /></Stage>
    </AbsoluteFill>
  );
};

const BlockScene = () => {
  const f = useCurrentFrame();
  const b1 = spring({frame: f - 4, fps: 30, config: {damping: 15, mass: 0.7}});
  const b2 = spring({frame: f - 22, fps: 30, config: {damping: 15, mass: 0.7}});
  const shake = f > 38 ? Math.sin(f * 1.5) * 5 : 0;
  const warn = spring({frame: f - 48, fps: 30, config: {damping: 12}});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '92px 40px 0', gap: 22}}>
      <div style={{fontSize: 42, fontWeight: 900, color: C.red, opacity: warn, transform: `scale(${0.9 + warn * 0.1})`}}>Wo ist „Ablehnen"?!</div>
      <Stage>
        <Phone />
        {/* Banner 1 SLAMt über den Kaufen-Button (unten) */}
        <div style={{position: 'absolute', left: 14, right: 14, bottom: 14, transform: `translateY(${(1 - b1) * 260}px) translateX(${shake}px)`, opacity: b1, background: '#101019', border: `2px solid ${C.border}`, borderRadius: 18, padding: 18, zIndex: 30}}>
          <div style={{fontSize: 24, color: C.muted, fontWeight: 700, marginBottom: 12}}>🍪 Wir nutzen Cookies</div>
          <div style={{background: C.violet, color: '#fff', borderRadius: 12, padding: '16px', fontSize: 27, fontWeight: 900, textAlign: 'center'}}>Alle akzeptieren</div>
        </div>
        {/* Banner 2 stapelt darüber */}
        <div style={{position: 'absolute', left: 14, right: 14, bottom: 176, transform: `translateY(${(1 - b2) * 320}px)`, opacity: b2 * 0.97, background: '#0c0c14', border: `2px solid ${C.border}`, borderRadius: 14, padding: '14px 18px', fontSize: 22, color: C.dim, fontWeight: 700, zIndex: 29}}>Einstellungen · 47 Partner ⚙️</div>
        <Cursor x={250} y={838} color={C.red} />
      </Stage>
    </AbsoluteFill>
  );
};

const WegScene = () => {
  const f = useCurrentFrame();
  const cx = interpolate(f, [0, 34, 62], [250, 400, 560], {extrapolateRight: 'clamp'});
  const cy = interpolate(f, [0, 34, 62], [838, 620, 260], {extrapolateRight: 'clamp'});
  const cOp = interpolate(f, [42, 70], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const stamp = spring({frame: f - 50, fps: 30, config: {damping: 10, mass: 0.5}});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '92px 40px 0', gap: 22}}>
      <div style={{fontSize: 40, fontWeight: 900, color: C.muted}}>Winziges „ablehnen" – versteckt.</div>
      <Stage>
        <Phone glow={false} tinyAblehnen>
          {/* Banner bleibt über dem Button */}
          <div style={{position: 'absolute', left: 14, right: 14, bottom: 14, background: '#101019', border: `2px solid ${C.border}`, borderRadius: 18, padding: 18, zIndex: 30}}>
            <div style={{fontSize: 24, color: C.muted, fontWeight: 700, marginBottom: 12}}>🍪 Wir nutzen Cookies</div>
            <div style={{background: C.violet, color: '#fff', borderRadius: 12, padding: '16px', fontSize: 27, fontWeight: 900, textAlign: 'center'}}>Alle akzeptieren</div>
          </div>
        </Phone>
        <div style={{opacity: cOp}}><Cursor x={cx} y={cy} color={C.red} /></div>
        {stamp > 0.01 && (
          <div style={{position: 'absolute', left: '50%', top: '44%', transform: `translate(-50%,-50%) rotate(-8deg) scale(${0.5 + stamp * 0.5})`, opacity: stamp, border: `5px solid ${C.red}`, color: C.red, fontSize: 46, fontWeight: 900, padding: '12px 28px', borderRadius: 14, background: 'rgba(8,8,11,0.86)', zIndex: 60}}>Kunde weg ❌</div>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

const RichtigScene = () => {
  const f = useCurrentFrame();
  const label = spring({frame: f, fps: 30, config: {damping: 14}});
  const tap = spring({frame: f - 58, fps: 30, config: {damping: 10, mass: 0.5}});
  const gone = interpolate(f, [66, 96], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const done = spring({frame: f - 112, fps: 30, config: {damping: 12}});
  const cx = interpolate(f, [16, 52, 112, 132], [360, 180, 180, 250], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cy = interpolate(f, [16, 52, 112, 132], [880, 820, 820, 838], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '80px 40px 0', gap: 18}}>
      <div style={{fontSize: 34, fontWeight: 900, color: C.teal, opacity: label, letterSpacing: 2}}>SO GEHT'S RICHTIG:</div>
      <Stage>
        <Phone buyColor={done > 0.3 ? C.teal : C.green} />
        {/* faires 2-Button-Banner, gleitet nach dem Tap weg */}
        <div style={{position: 'absolute', left: 14, right: 14, bottom: 14, opacity: 1 - gone, transform: `translateY(${gone * 300}px)`, background: '#101019', border: `2px solid ${C.border}`, borderRadius: 18, padding: 18, zIndex: 30}}>
          <div style={{fontSize: 22, color: C.muted, fontWeight: 700, marginBottom: 12}}>🍪 Cookies?</div>
          <div style={{display: 'flex', gap: 12}}>
            <div style={{flex: 1, background: tap > 0.3 ? C.teal : C.cardHi, color: tap > 0.3 ? '#04120f' : C.ink, borderRadius: 12, padding: '16px', fontSize: 25, fontWeight: 900, textAlign: 'center', border: `2px solid ${C.teal}66`}}>Ablehnen</div>
            <div style={{flex: 1, background: C.cardHi, color: C.ink, borderRadius: 12, padding: '16px', fontSize: 25, fontWeight: 900, textAlign: 'center', border: `2px solid ${C.border}`}}>Akzeptieren</div>
          </div>
        </div>
        <Cursor x={cx} y={cy} color={C.teal} />
        {done > 0.01 && (
          <div style={{position: 'absolute', left: '50%', top: '42%', transform: `translate(-50%,-50%) scale(${0.6 + done * 0.4})`, opacity: done, fontSize: 34, fontWeight: 900, color: C.green, background: 'rgba(8,8,11,0.86)', padding: '14px 24px', borderRadius: 14, border: `2px solid ${C.green}`, zIndex: 60}}>✅ Kauf abgeschlossen</div>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

const InsightScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{fontSize: 52, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.92 + a * 0.08})`, lineHeight: 1.22, maxWidth: 900}}>
        Cookie-Banner ist <span style={{color: C.gold}}>Pflicht</span>.<br /><span style={{fontSize: 40, color: C.muted}}>Fair gebaut kostet er dich <span style={{color: C.teal}}>KEINEN</span> Kunden.</span>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 18}}>
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -18}px)`, fontSize: 33, fontWeight: 800, color: C.gold, maxWidth: 880}}>🍪 Bei welchem Banner suchst du am längsten nach „Ablehnen"? 👇</div>
      <div style={{opacity: line, transform: `scale(${0.9 + line * 0.1})`, marginTop: 12}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 48, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 8}}>Rechtssicher <span style={{color: C.teal}}>UND</span> verkaufsstark.</div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`, marginTop: 22}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const CookieFalle = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(760px 760px at 540px 520px, rgba(245,185,69,0.07), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={SETUP}><SetupScene /></Sequence>
      <Sequence from={SETUP} durationInFrames={BLOCK}><BlockScene /></Sequence>
      <Sequence from={SETUP + BLOCK} durationInFrames={WEG}><WegScene /></Sequence>
      <Sequence from={SETUP + BLOCK + WEG} durationInFrames={RICHTIG}><RichtigScene /></Sequence>
      <Sequence from={SETUP + BLOCK + WEG + RICHTIG} durationInFrames={INSIGHT}><InsightScene /></Sequence>
      <Sequence from={SETUP + BLOCK + WEG + RICHTIG + INSIGHT} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
