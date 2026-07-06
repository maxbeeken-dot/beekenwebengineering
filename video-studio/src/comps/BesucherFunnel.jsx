import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";
const HOOK = 56, SCENE = 210, CTA_LEN = 104;

const counterAt = (f, steps) => {
  let v = 100;
  for (const s of steps) {
    if (f >= s.at) {
      const t = interpolate(f, [s.at, s.at + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      v -= s.sub * t;
    }
  }
  return Math.round(v);
};

const FunnelScene = ({isFast}) => {
  const f = useCurrentFrame();
  const intro = spring({frame: f, fps: 30, config: {damping: 15}});
  const steps = isFast
    ? [{at: 46, sub: 5, icon: '⚡', label: 'lädt in 0,9 s — fast alle bleiben'}, {at: 96, sub: 0, icon: '🎯', label: 'klarer Button ✓'}, {at: 146, sub: 0, icon: '📱', label: 'perfekt am Handy ✓'}]
    : [{at: 46, sub: 53, icon: '⏱️', label: '−53 · Ladezeit über 3 s'}, {at: 96, sub: 20, icon: '🎯', label: '−20 · kein klarer Button'}, {at: 146, sub: 22, icon: '📱', label: '−22 · mies am Handy'}];
  const val = counterAt(f, steps);
  const accent = isFast ? C.teal : C.red;
  const finalAt = 176;
  const finalV = isFast ? 30 : 5;
  const showFinal = f >= finalAt;
  const finalPop = spring({frame: f - finalAt, fps: 30, config: {damping: 12, mass: 0.7}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 56, gap: 26}}>
      <div style={{opacity: intro, fontSize: 40, fontWeight: 900, color: isFast ? C.teal : C.gold, letterSpacing: 1, textAlign: 'center'}}>
        {isFast ? '⚡ Handgecodet' : '🐌 Baukasten-Seite'}
      </div>
      {/* Großer Zähler */}
      <div style={{transform: `scale(${intro})`, position: 'relative', width: 320, height: 320, borderRadius: 320, border: `8px solid ${accent}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 60px ${accent}44`, background: C.card}}>
        <div style={{fontSize: 130, fontWeight: 900, color: C.ink, lineHeight: 1}}>{val}</div>
        <div style={{fontSize: 26, fontWeight: 700, color: C.muted}}>von 100 bleiben</div>
      </div>
      {/* Abzüge / Häkchen */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 12, minHeight: 150}}>
        {steps.map((s, i) => {
          const show = spring({frame: f - s.at, fps: 30, config: {damping: 16}});
          if (show <= 0.01) return null;
          const isCut = s.sub > 0;
          return (
            <div key={i} style={{opacity: show, transform: `translateX(${(1 - show) * -20}px)`, display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, fontWeight: 700, color: isCut ? C.red : C.teal}}>
              <span style={{fontSize: 32}}>{s.icon}</span>{s.label}
            </div>
          );
        })}
      </div>
      {showFinal && (
        <div style={{transform: `scale(${finalPop})`, opacity: finalPop, marginTop: 6, padding: '12px 32px', borderRadius: 14, border: `4px solid ${accent}`, color: accent, fontSize: 40, fontWeight: 900}}>
          = {finalV}{isFast ? '+' : ''} Anfragen{isFast ? '*' : ''}
        </div>
      )}
    </AbsoluteFill>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const b = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 24}}>
      <div style={{fontSize: 96, transform: `scale(${a})`}}>📉</div>
      <div style={{fontSize: 66, fontWeight: 900, color: C.ink, lineHeight: 1.08, opacity: a}}>Von <span style={{color: C.gold}}>100 Besuchern</span> —<br />wie viele fragen an?</div>
      <div style={{fontSize: 32, fontWeight: 700, color: C.muted, opacity: b, transform: `translateY(${(1 - b) * 24}px)`}}>Die meisten unterschätzen es 👇</div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line2 = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 16}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12}}>Jeder Besucher zählt.<br /><span style={{color: C.teal}}>Verliere keinen</span>.</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 42}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 44px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>👇 Wie viele verlierst DU?</div>
        </div>
        <div style={{marginTop: 30, fontSize: 26, color: C.dim}}>*Rechenbeispiel · beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const BesucherFunnel = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at 540px 820px, rgba(124,92,255,0.12), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={SCENE}><FunnelScene isFast={false} /></Sequence>
      <Sequence from={HOOK + SCENE} durationInFrames={SCENE}><FunnelScene isFast={true} /></Sequence>
      <Sequence from={HOOK + SCENE * 2} durationInFrames={CTA_LEN}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
