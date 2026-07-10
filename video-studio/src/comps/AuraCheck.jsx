import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Szenenlängen (30 fps) → gesamt 552 Frames = 18,4 s
const GREEN = 150, FLIP = 30, RED = 150, SPLIT = 90, MSG = 66, CTA = 66;

// Tausender-Punkt (de) + Vorzeichen (echtes Minus U+2212)
const group = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtSigned = (v) => {
  const r = Math.round(v);
  if (r === 0) return '0';
  return (r < 0 ? '−' : '+') + group(Math.abs(r));
};

const AuraCounter = ({value, color, glow, shake}) => (
  <div style={{textAlign: 'center', transform: `translate(${shake?.x || 0}px, ${shake?.y || 0}px)`}}>
    <div style={{fontSize: 34, letterSpacing: 16, color: C.muted, fontWeight: 800, marginLeft: 16}}>AURA</div>
    <div style={{fontSize: 176, fontWeight: 900, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 ${glow}px ${color}`}}>
      {fmtSigned(value)}
    </div>
  </div>
);

const Slab = ({localF, at, emoji, label, pts, color}) => {
  const s = spring({frame: localF - at, fps: 30, config: {damping: 15, mass: 0.7}});
  if (s <= 0.001) return null;
  const pop = spring({frame: localF - at, fps: 30, config: {damping: 8, mass: 0.5}});
  return (
    <div style={{
      opacity: s, transform: `translateX(${(1 - s) * 90}px)`, width: 780,
      background: C.card, border: `2px solid ${color}55`, borderRadius: 18, padding: '18px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      boxShadow: `0 0 34px ${color}22`,
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
        <div style={{fontSize: 48}}>{emoji}</div>
        <div style={{fontSize: 35, fontWeight: 800, color: C.ink}}>{label}</div>
      </div>
      <div style={{fontSize: 48, fontWeight: 900, color, transform: `scale(${0.55 + pop * 0.45})`, fontVariantNumeric: 'tabular-nums'}}>{pts}</div>
    </div>
  );
};

const Banner = ({localF, at, text, color, tint}) => {
  const s = spring({frame: localF - at, fps: 30, config: {damping: 16}});
  return (
    <div style={{
      opacity: s, transform: `translateY(${(1 - s) * -22}px)`, fontSize: 37, fontWeight: 900, color,
      background: tint, border: `2px solid ${color}66`, borderRadius: 14, padding: '11px 26px',
    }}>{text}</div>
  );
};

const GAINS = [
  {at: 6, emoji: '⚡', label: 'Lädt in unter 1 Sek.', pts: '+500'},
  {at: 40, emoji: '📱', label: 'Perfekt am Handy', pts: '+400'},
  {at: 72, emoji: '🔝', label: 'Ganz oben bei Google', pts: '+600'},
  {at: 104, emoji: '👔', label: 'Wirkt wie ein Profi', pts: '+500'},
];

const GreenScene = () => {
  const f = useCurrentFrame();
  const value = interpolate(
    f,
    [10, 32, 44, 64, 76, 96, 108, 128],
    [0, 500, 500, 900, 900, 1500, 1500, 2000],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const pulse = GAINS.reduce((a, g) => a + Math.max(0, 1 - Math.abs(f - (g.at + 8)) / 9), 0);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '132px 40px 0', gap: 26}}>
      <Banner localF={f} at={16} text="✅ Firma MIT guter Website" color={C.green} tint="rgba(61,220,132,0.12)" />
      <AuraCounter value={value} color={C.teal} glow={24 + pulse * 34} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8}}>
        {GAINS.map((g, i) => <Slab key={i} localF={f} {...g} color={C.green} />)}
      </div>
    </AbsoluteFill>
  );
};

const FlipScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const arrow = spring({frame: f - 8, fps: 30, config: {damping: 12}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, gap: 22, background: 'rgba(0,0,0,0.35)'}}>
      <div style={{fontSize: 58, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.9 + a * 0.1})`, lineHeight: 1.12}}>
        Und jetzt<br />die <span style={{color: C.red}}>andere</span> Firma…
      </div>
      <div style={{fontSize: 72, opacity: arrow, transform: `translateY(${(1 - arrow) * -20}px)`}}>👇</div>
    </AbsoluteFill>
  );
};

const LOSSES = [
  {at: 8, emoji: '🐌', label: '3 Sekunden Ladezeit', pts: '−900'},
  {at: 44, emoji: '📱', label: 'Am Handy zerschossen', pts: '−700'},
  {at: 80, emoji: '🚫', label: 'Auf Seite 4 versteckt', pts: '−800'},
  {at: 112, emoji: '👻', label: 'Bewerber springen ab', pts: '−600'},
];

const RedScene = () => {
  const f = useCurrentFrame();
  const value = interpolate(
    f,
    [12, 34, 48, 68, 84, 104, 116, 136],
    [0, -900, -900, -1600, -1600, -2400, -2400, -3000],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const hits = [12, 48, 84, 116];
  const shake = hits.reduce((acc, h) => {
    const d = f - h;
    if (d >= 0 && d < 11) {
      const amp = (1 - d / 11) * 15;
      return {x: acc.x + Math.sin(d * 2.6) * amp, y: acc.y + Math.cos(d * 3.2) * amp};
    }
    return acc;
  }, {x: 0, y: 0});
  const pulse = LOSSES.reduce((a, g) => a + Math.max(0, 1 - Math.abs(f - (g.at + 8)) / 9), 0);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '132px 40px 0', gap: 26, transform: `translate(${shake.x}px, ${shake.y}px)`}}>
      <Banner localF={f} at={6} text="❌ Firma OHNE gute Website" color={C.red} tint="rgba(255,84,104,0.12)" />
      <AuraCounter value={value} color={C.red} glow={22 + pulse * 30} shake={{x: shake.x * 0.4, y: shake.y * 0.4}} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8}}>
        {LOSSES.map((g, i) => <Slab key={i} localF={f} {...g} color={C.red} />)}
      </div>
    </AbsoluteFill>
  );
};

const SplitCard = ({side, color, tint, tag, value, emoji, delay}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f - delay, fps: 30, config: {damping: 16, mass: 0.8}});
  const dir = side === 'left' ? -1 : 1;
  const jitter = side === 'right' ? Math.sin(f * 1.4) * (2 + Math.max(0, 1 - f / 30) * 6) : 0;
  return (
    <div style={{
      flex: 1, opacity: s, transform: `translateX(${(1 - s) * dir * 160 + jitter}px)`,
      background: tint, border: `2px solid ${color}55`, borderRadius: 22, margin: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 30,
    }}>
      <div style={{fontSize: 74}}>{emoji}</div>
      <div style={{fontSize: 66, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 26px ${color}66`}}>{value}</div>
      <div style={{fontSize: 27, fontWeight: 700, color: C.muted, textAlign: 'center', lineHeight: 1.25, maxWidth: 400}}>{tag}</div>
    </div>
  );
};

const SplitScene = () => {
  const f = useCurrentFrame();
  const vs = spring({frame: f - 20, fps: 30, config: {damping: 11, mass: 0.5}});
  return (
    <AbsoluteFill style={{padding: '150px 34px', flexDirection: 'row', alignItems: 'stretch'}}>
      <SplitCard side="left" color={C.teal} tint="rgba(52,227,208,0.10)" emoji="✨" value="+2.000" tag="Gewinnt Kunden & Bewerber" delay={0} />
      <SplitCard side="right" color={C.red} tint="rgba(255,84,104,0.10)" emoji="💀" value={'−3.000'} tag="Verliert beide – täglich" delay={8} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%,-50%) scale(${0.5 + vs * 0.5})`, opacity: vs,
        fontSize: 58, fontWeight: 900, color: C.ink, background: C.bg, border: `3px solid ${C.border}`,
        borderRadius: 100, width: 128, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>VS</div>
    </AbsoluteFill>
  );
};

const MessageScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.6}});
  const b = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 24}}>
      <div style={{fontSize: 62, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.92 + a * 0.08})`, lineHeight: 1.12}}>
        Aura = <span style={{color: C.teal}}>Kunden</span><br />UND <span style={{color: C.gold}}>Bewerber</span> 🧲
      </div>
      <div style={{fontSize: 36, fontWeight: 700, color: C.muted, opacity: b, transform: `translateY(${(1 - b) * 22}px)`, maxWidth: 820, lineHeight: 1.3}}>
        Beide klicken <span style={{color: C.ink}}>zuerst</span> auf deine Website.
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 24, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 18}}>
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -18}px)`, fontSize: 33, fontWeight: 800, color: C.gold, maxWidth: 860, lineHeight: 1.25}}>
        👇 Wie viel Aura hat <span style={{color: C.ink}}>DEINE</span> Website?<br /><span style={{fontSize: 27, color: C.muted}}>Kommentier deine Zahl.</span>
      </div>
      <div style={{opacity: line, transform: `scale(${0.9 + line * 0.1})`, marginTop: 12}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 52, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 8}}>
          Zeit fürs <span style={{color: C.teal}}>Aura-Upgrade</span> 🚀
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

export const AuraCheck = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(760px 760px at 540px 520px, rgba(124,92,255,0.10), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={GREEN}><GreenScene /></Sequence>
      <Sequence from={GREEN} durationInFrames={FLIP}><FlipScene /></Sequence>
      <Sequence from={GREEN + FLIP} durationInFrames={RED}><RedScene /></Sequence>
      <Sequence from={GREEN + FLIP + RED} durationInFrames={SPLIT}><SplitScene /></Sequence>
      <Sequence from={GREEN + FLIP + RED + SPLIT} durationInFrames={MSG}><MessageScene /></Sequence>
      <Sequence from={GREEN + FLIP + RED + SPLIT + MSG} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
