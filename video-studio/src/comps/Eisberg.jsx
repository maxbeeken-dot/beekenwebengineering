import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, rng} from './Cine.jsx';

// Cinematic: Eisberg. Die sichtbare Spitze = die hübsche Website. Unter Wasser =
// die echte Arbeit (Code, Speed, SEO, DSGVO, mobil, barrierefrei).
// Kernbotschaft: Qualität unter der Haube.
// 30fps → 75 + 195 + 180 + 75 + 75 = 600 = 20,0 s
const HOOK = 75, DIVE = 195, PROOF = 180, PULL = 75, CTA = 75;

const WATER_Y = 560;
const CX = 540;

const Bubbles = ({f}) => {
  const b = [];
  for (let i = 0; i < 22; i++) {
    const x = rng(i) * 1080;
    const y = WATER_Y + ((rng(i * 3 + 1) * 1300 - f * (1.2 + rng(i) * 1.6)) % 1300 + 1300) % 1300;
    const r = rng(i * 7) * 6 + 2;
    b.push(<div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: '50%', border: '1.5px solid rgba(120,200,220,0.4)', opacity: 0.5}} />);
  }
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{b}</AbsoluteFill>;
};

// Welt: Himmel/Wasser + Eisberg (Spitze über, Masse unter Wasser). labels = Glühen.
const World = ({camY, labelGlow = 0, f = 0}) => {
  const LABELS = ['Sauberer Code', 'Blitzschnell', 'SEO', 'DSGVO-sicher', 'Mobil', 'Barrierefrei'];
  return (
    <AbsoluteFill style={{transform: `translateY(${-camY}px)`}}>
      {/* Himmel */}
      <div style={{position: 'absolute', left: 0, right: 0, top: -400, height: WATER_Y + 400, background: 'linear-gradient(180deg,#0a0c14,#0e131f)'}} />
      {/* Wasser */}
      <div style={{position: 'absolute', left: 0, right: 0, top: WATER_Y, height: 1600, background: 'linear-gradient(180deg,#0b2733,#0a1a24 40%,#061019)'}} />
      {/* Wasserlinie */}
      <div style={{position: 'absolute', left: 0, right: 0, top: WATER_Y - 3, height: 6, background: `linear-gradient(90deg,transparent,${C.teal}88,transparent)`, boxShadow: `0 0 24px ${C.teal}`}} />
      {/* Spitze (über Wasser) */}
      <div style={{position: 'absolute', left: CX - 170, top: WATER_Y - 200, width: 340, height: 210, background: 'linear-gradient(180deg,#eafcff,#bfeef3)', clipPath: 'polygon(50% 0, 74% 55%, 100% 100%, 0 100%, 26% 55%)', boxShadow: `0 0 50px ${C.teal}55`}}>
        {/* Mini-Website auf der Spitze */}
      </div>
      <div style={{position: 'absolute', left: CX - 78, top: WATER_Y - 150, width: 156, textAlign: 'center'}}>
        <div style={{height: 12, width: 90, margin: '0 auto 8px', borderRadius: 4, background: C.violet}} />
        <div style={{height: 7, width: 130, margin: '0 auto 5px', borderRadius: 3, background: '#3a4a55'}} />
        <div style={{height: 7, width: 100, margin: '0 auto', borderRadius: 3, background: '#3a4a55'}} />
      </div>
      {/* Masse (unter Wasser) */}
      <div style={{position: 'absolute', left: CX - 340, top: WATER_Y, width: 680, height: 1180, background: 'linear-gradient(180deg,#8fd6df,#3f8a97 40%,#1f5560)', opacity: 0.9, clipPath: 'polygon(20% 0, 80% 0, 96% 22%, 84% 52%, 92% 78%, 60% 100%, 30% 100%, 8% 74%, 16% 40%, 6% 20%)', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.4)'}} />
      {/* Labels auf der Masse */}
      {LABELS.map((t, i) => {
        const gy = WATER_Y + 120 + i * 165;
        const on = interpolate(labelGlow, [i / 6, i / 6 + 0.24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div key={i} style={{position: 'absolute', left: CX - 130, top: gy, width: 260, textAlign: 'center', padding: '10px 0', borderRadius: 12, background: on > 0.1 ? 'rgba(8,20,26,0.75)' : 'transparent', border: on > 0.1 ? `2px solid ${C.teal}` : '2px solid transparent', color: on > 0.1 ? C.ink : '#0c2a30', fontSize: 27, fontWeight: 900, opacity: 0.35 + on * 0.65, boxShadow: on > 0.5 ? `0 0 24px ${C.teal}55` : 'none'}}>
            {t} {on > 0.6 ? '✓' : ''}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.teal}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 62px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 25, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 10}}>{kicker}</div>}
    <div style={{fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em', textShadow: '0 2px 20px rgba(0,0,0,0.6)'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <World camY={0} f={f} />
      <Bubbles f={f} />
      <Caption top={120} main={<>Was Kunden sehen,<br />ist nur die <span style={{color: C.teal}}>Spitze</span>.</>} o={a} ty={(1 - a) * 20} />
    </AbsoluteFill>
  );
};

const DiveScene = () => {
  const f = useCurrentFrame();
  const camY = interpolate(f, [0, 180], [0, 640], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lab = spring({frame: f - 16, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <World camY={camY} labelGlow={interpolate(f, [40, 180], [0, 0.4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} f={f} />
      <Bubbles f={f} />
      <Caption top={140} kicker="UNTER DER WASSERLINIE" main={<>Darunter liegt<br /><span style={{color: C.teal}}>die echte Arbeit.</span></>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const ProofScene = () => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [0, 160], [0.35, 1.1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lab = spring({frame: f - 8, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <World camY={640} labelGlow={glow} f={f} />
      <Bubbles f={f} />
      <Caption top={150} kicker="9 VON 10 SIEHT NIEMAND" main={<>Aber jeder Kunde<br /><span style={{color: C.teal}}>spürt es.</span></>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const PullScene = () => {
  const f = useCurrentFrame();
  const camY = interpolate(f, [0, 60], [640, 200], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const a = spring({frame: f - 10, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill>
      <World camY={camY} labelGlow={1.1} f={f} />
      <Bubbles f={f} />
      <div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', opacity: a, transform: `translateY(${(1 - a) * 16}px)`}}>
        <div style={{fontSize: 58, fontWeight: 900, color: C.ink, lineHeight: 1.14, textShadow: '0 2px 20px rgba(0,0,0,0.6)'}}>Wir bauen den<br /><span style={{color: C.teal}}>ganzen Eisberg</span>.</div>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 14, fps: 30, config: {damping: 15}});
  const bait = spring({frame: f - 26, fps: 30, config: {damping: 16}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 20}}>
      <Bubbles f={f} />
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Tiefe, die man spürt <span style={{color: C.teal}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 860, lineHeight: 1.3}}>Was gehört für DICH unter die Wasserlinie? ↓</div>
    </AbsoluteFill>
  );
};

export const Eisberg = () => (
  <AbsoluteFill style={{background: '#061019', fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={DIVE}><DiveScene /></Sequence>
    <Sequence from={HOOK + DIVE} durationInFrames={PROOF}><ProofScene /></Sequence>
    <Sequence from={HOOK + DIVE + PROOF} durationInFrames={PULL}><PullScene /></Sequence>
    <Sequence from={HOOK + DIVE + PROOF + PULL} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.07} vignette={0.78} gradeProps={{a: 'rgba(52,227,208,0.10)', b: 'rgba(31,85,96,0.12)'}} />
  </AbsoluteFill>
);
