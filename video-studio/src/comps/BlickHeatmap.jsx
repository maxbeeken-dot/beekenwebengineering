import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Szenenlängen (30 fps) → gesamt 560 Frames = 18,67 s
const FLASH = 60, BLUR = 60, HEAT = 180, REBUILD = 150, CTA = 110;

// Mockup-Bühne (feste Position in allen Szenen → nahtlose Schnitte)
const MW = 680, MH = 800, STAGE_LEFT = 200, STAGE_TOP = 250;

const Stage = ({children}) => (
  <div style={{position: 'absolute', left: STAGE_LEFT, top: STAGE_TOP, width: MW, height: MH}}>{children}</div>
);

// Website-Mockup: Browser-Chrome, Header (Logo + Nav), großes Banner, Textzeilen, Button
const Mockup = ({blur = 0, dim = false, buttonBig = false, buttonPop = 1, buttonGlow = 0}) => {
  const co = dim ? 0.38 : 1;
  const line = (w, h, mb) => ({height: h, width: w, borderRadius: h, background: C.cardHi, marginBottom: mb});
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 26, overflow: 'hidden',
      background: C.card, border: `1px solid ${C.border}`, boxShadow: '0 34px 90px rgba(0,0,0,0.55)',
      filter: blur > 0.01 ? `blur(${blur}px)` : 'none',
    }}>
      <div style={{height: 48, background: C.bg, display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', borderBottom: `1px solid ${C.border}`}}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 13, height: 13, borderRadius: 13, background: c}} />)}
        <div style={{marginLeft: 14, height: 20, width: 300, borderRadius: 20, background: C.cardHi}} />
      </div>
      <div style={{opacity: co, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '26px 30px'}}>
        <div style={{width: 40, height: 40, borderRadius: 11, background: C.cardHi, border: `1px solid ${C.border}`}} />
        <div style={{display: 'flex', gap: 18}}>{[0, 1, 2].map((i) => <div key={i} style={{width: 54, height: 12, borderRadius: 12, background: C.cardHi}} />)}</div>
      </div>
      <div style={{opacity: co, margin: '0 30px', height: 330, borderRadius: 16, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(124,92,255,0.55), rgba(52,227,208,0.28))'}}>
        <div style={{width: 280, height: 22, borderRadius: 22, background: 'rgba(255,255,255,0.6)'}} />
      </div>
      <div style={{opacity: co, padding: '26px 30px 0'}}>
        <div style={line('72%', 16, 15)} />
        <div style={line('92%', 12, 11)} />
        <div style={line('82%', 12, 0)} />
      </div>
      {!buttonBig ? (
        <div style={{position: 'absolute', left: '50%', top: 690, transform: 'translateX(-50%)', width: 210, height: 60, borderRadius: 12, background: C.cardHi, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 22, fontWeight: 800}}>
          Jetzt anfragen
        </div>
      ) : (
        <div style={{position: 'absolute', left: '50%', top: 648, transform: `translateX(-50%) scale(${buttonPop})`, width: 384, height: 100, borderRadius: 18, background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.bg, fontSize: 34, fontWeight: 900, boxShadow: `0 0 ${34 + buttonGlow}px rgba(52,227,208,0.7)`}}>
          Jetzt anfragen →
        </div>
      )}
    </div>
  );
};

// Attention-Heatmap-Blob: goldener Außenschein + roter Hot-Core, additive (screen)
const HeatBlob = ({localF, at, cx, cy, r, intensity = 1}) => {
  const s = spring({frame: localF - at, fps: 30, config: {damping: 13, mass: 0.85}});
  if (s <= 0.002) return null;
  const breathe = 1 + Math.sin((localF - at) * 0.14 + cx * 0.01) * 0.05;
  const sc = (0.45 + s * 0.55) * breathe;
  return (
    <div style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, opacity: s, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', transform: `scale(${sc})`, mixBlendMode: 'screen', filter: 'blur(9px)',
        background: `radial-gradient(circle, rgba(255,120,60,${0.5 * intensity}) 0%, rgba(245,185,69,${0.32 * intensity}) 40%, rgba(245,185,69,0) 72%)`}} />
      <div style={{position: 'absolute', inset: '27%', borderRadius: '50%', transform: `scale(${sc})`, mixBlendMode: 'screen', filter: 'blur(5px)',
        background: `radial-gradient(circle, rgba(255,60,80,${0.92 * intensity}) 0%, rgba(255,84,104,${0.6 * intensity}) 45%, rgba(255,84,104,0) 74%)`}} />
    </div>
  );
};

// Nach oben zeigender „gezeichneter“ Pfeil (SVG, draw-on)
const UpArrow = ({localF, at, cx, yTop, yBot, color}) => {
  const d = interpolate(localF - at, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (d <= 0.001) return null;
  const bob = Math.sin(localF * 0.2) * 5;
  const h = yBot - yTop, len = h - 24;
  return (
    <svg width={70} height={h + 20} style={{position: 'absolute', left: cx - 35, top: yTop - 10, overflow: 'visible', transform: `translateY(${bob}px)`, opacity: d}}>
      <line x1={35} y1={h + 10} x2={35} y2={24} stroke={color} strokeWidth={7} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - d)} />
      <polygon points="35,2 17,32 53,32" fill={color} opacity={d > 0.75 ? 1 : 0} />
    </svg>
  );
};

// 1) FLASH — Merk-Aufforderung + Mockup blitzt auf
const FlashScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const mock = spring({frame: f - 12, fps: 30, config: {damping: 11, mass: 0.6}});
  const flash = interpolate(f, [12, 18, 34], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 92, left: 60, right: 60, textAlign: 'center', fontSize: 58, fontWeight: 900, color: C.ink, lineHeight: 1.12, opacity: head, transform: `translateY(${(1 - head) * -20}px)`}}>
        Schau <span style={{color: C.teal}}>1 Sekunde</span><br />auf diese Seite. 👀
      </div>
      <Stage>
        <div style={{position: 'absolute', inset: 0, opacity: mock, transform: `scale(${0.9 + mock * 0.1})`}}>
          <Mockup />
          <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: '#fff', opacity: flash, mixBlendMode: 'screen'}} />
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

// 2) UNSCHÄRFE — kurz klar, dann Blur + Verdunklung, Frage erscheint
const BlurScene = () => {
  const f = useCurrentFrame();
  const blur = interpolate(f, [30, 56], [0, 15], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dark = interpolate(f, [30, 56], [0, 0.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const q = spring({frame: f - 36, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill>
      <Stage>
        <Mockup blur={blur} />
        <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: C.bg, opacity: dark}} />
      </Stage>
      <div style={{position: 'absolute', top: 520, left: 70, right: 70, textAlign: 'center', fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1.15, opacity: q, transform: `translateY(${(1 - q) * 22}px)`}}>
        Wo ist dein Blick<br /><span style={{color: C.teal}}>zuerst</span> gelandet?
      </div>
    </AbsoluteFill>
  );
};

// 3) HEATMAP — Blobs blühen auf Banner + Logo, NICHTS auf dem Button
const HeatScene = () => {
  const f = useCurrentFrame();
  const label = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.6}});
  const callout = spring({frame: f - 74, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 108, left: 60, right: 60, textAlign: 'center', fontSize: 46, fontWeight: 900, color: C.ink, opacity: label, transform: `translateY(${(1 - label) * -16}px)`}}>
        So schauen <span style={{color: C.gold}}>echte Besucher</span>.
      </div>
      <Stage>
        <Mockup />
        <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: C.bg, opacity: 0.34}} />
        <HeatBlob localF={f} at={10} cx={340} cy={305} r={232} intensity={1} />
        <HeatBlob localF={f} at={34} cx={50} cy={94} r={88} intensity={0.85} />
        <UpArrow localF={f} at={74} cx={340} yTop={752} yBot={822} color={C.teal} />
        <div style={{position: 'absolute', left: -80, right: -80, top: 838, textAlign: 'center', opacity: callout, transform: `translateY(${(1 - callout) * 18}px)`}}>
          <div style={{fontSize: 32, fontWeight: 800, color: C.muted}}>Der Button, der Kunden bringt?</div>
          <div style={{fontSize: 40, fontWeight: 900, color: C.red, marginTop: 6}}>Null Blicke. 🔵</div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

// 4) UMBAU — Button wird groß + teal, Heat blüht jetzt genau dort, Rest ruhig
const RebuildScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f - 6, fps: 30, config: {damping: 12, mass: 0.7}});
  const glow = interpolate(f, [30, 90], [0, 46], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) + Math.sin(f * 0.2) * 6;
  const eyebrow = spring({frame: f, fps: 30, config: {damping: 15}});
  const msg = spring({frame: f - 40, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 118, left: 60, right: 60, textAlign: 'center', fontSize: 30, fontWeight: 800, color: C.teal, letterSpacing: 3, opacity: eyebrow}}>
        JETZT FÜHRT DIE SEITE DEN BLICK
      </div>
      <Stage>
        <Mockup dim buttonBig buttonPop={0.4 + pop * 0.6} buttonGlow={glow} />
        <HeatBlob localF={f} at={18} cx={340} cy={697} r={168} intensity={1} />
      </Stage>
      <div style={{position: 'absolute', top: 1120, left: 70, right: 70, textAlign: 'center', fontSize: 40, fontWeight: 800, color: C.ink, lineHeight: 1.28, opacity: msg, transform: `translateY(${(1 - msg) * 20}px)`}}>
        Eine geführte Seite lenkt den Blick dorthin,<br /><span style={{color: C.teal}}>wo geklickt wird.</span>
      </div>
    </AbsoluteFill>
  );
};

// 5) CTA
const CtaScene = () => {
  const f = useCurrentFrame();
  const bait = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 18}}>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * -18}px)`, fontSize: 34, fontWeight: 800, color: C.gold, maxWidth: 880, lineHeight: 1.28}}>
        Wo ist <span style={{color: C.ink}}>DEIN</span> Blick zuerst gelandet 👀<br />
        <span style={{fontSize: 28, color: C.muted}}>Bild, Logo oder Button? Schreib es in die Kommentare.</span>
      </div>
      <div style={{opacity: line, transform: `scale(${0.9 + line * 0.1})`, marginTop: 14}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 50, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 8, maxWidth: 860}}>
          Deine Seite führt den Blick <span style={{color: C.teal}}>zum Klick</span>.
        </div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`, marginTop: 22}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BlickHeatmap = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(760px 760px at 540px 560px, rgba(124,92,255,0.10), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={FLASH}><FlashScene /></Sequence>
      <Sequence from={FLASH} durationInFrames={BLUR}><BlurScene /></Sequence>
      <Sequence from={FLASH + BLUR} durationInFrames={HEAT}><HeatScene /></Sequence>
      <Sequence from={FLASH + BLUR + HEAT} durationInFrames={REBUILD}><RebuildScene /></Sequence>
      <Sequence from={FLASH + BLUR + HEAT + REBUILD} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
