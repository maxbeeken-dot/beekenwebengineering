import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const Pill = ({children, color, bg, delay = 0}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 14, mass: 0.6}});
  return (
    <div style={{transform: `translateX(${(1 - p) * -30}px)`, opacity: p,
      display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 30px', borderRadius: 16,
      background: bg, color, fontSize: 34, fontWeight: 700, fontFamily: FONT, border: `1px solid ${color}33`}}>
      {children}
    </div>
  );
};

const Browser = ({tint, lockO, children}) => (
  <div style={{width: 620, height: 400, background: C.card, borderRadius: 20, overflow: 'hidden',
    border: `1px solid ${C.border}`, boxShadow: '0 30px 80px rgba(0,0,0,0.5)', position: 'relative'}}>
    <div style={{height: 52, background: C.cardHi, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', borderBottom: `1px solid ${C.border}`}}>
      {[C.red, '#f5b133', C.teal].map((c, i) => <div key={i} style={{width: 16, height: 16, borderRadius: '50%', background: c, opacity: 0.85}} />)}
      <div style={{flex: 1, height: 26, background: C.bg, borderRadius: 8, marginLeft: 14}} />
    </div>
    <div style={{position: 'relative', height: 348}}>
      {children}
      <div style={{position: 'absolute', inset: 0, background: tint, opacity: 0.5}} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 150, opacity: lockO}}>🔒</div>
    </div>
  </div>
);

const SiteSkeleton = () => (
  <div style={{padding: 26}}>
    <div style={{width: 140, height: 18, background: C.cardHi, borderRadius: 6, marginBottom: 22}} />
    <div style={{width: '85%', height: 30, background: C.cardHi, borderRadius: 8, marginBottom: 12}} />
    <div style={{width: '60%', height: 30, background: C.cardHi, borderRadius: 8, marginBottom: 26}} />
    <div style={{display: 'flex', gap: 16}}>
      <div style={{width: 180, height: 56, background: C.cardHi, borderRadius: 12}} />
      <div style={{width: 130, height: 56, background: C.cardHi, borderRadius: 12}} />
    </div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.86 + pop * 0.14})`, opacity: pop}}>
        <div style={{fontSize: 130}}>🔑</div>
        <div style={{fontSize: 78, color: C.ink, fontWeight: 800, lineHeight: 1.08, marginTop: 16}}>
          Wem gehört deine<br />Website <span style={{color: C.violet}}>wirklich?</span></div>
        <div style={{fontSize: 36, color: C.muted, marginTop: 24}}>Dir – oder dem Baukasten?</div>
      </div>
    </AbsoluteFill>
  );
};

const RentScene = () => {
  const f = useCurrentFrame();
  const enter = spring({frame: f, fps: 30, config: {damping: 16}});
  const lockO = interpolate(f, [20, 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 50}}>
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center'}}>
        <Pill color={C.red} bg="rgba(255,84,104,0.12)">⛔ Baukasten = Mietmodell</Pill>
      </div>
      <div style={{transform: `translateY(${(1 - enter) * 40}px) scale(0.96)`, opacity: enter, marginTop: 60}}>
        <Browser tint={C.red} lockO={lockO}><SiteSkeleton /></Browser>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
        <Pill color={C.red} bg={C.card} delay={28}>Du mietest nur</Pill>
        <Pill color={C.red} bg={C.card} delay={42}>Zahlung stoppt → Seite weg</Pill>
        <Pill color={C.red} bg={C.card} delay={56}>Kein Zugriff auf den Code</Pill>
      </div>
    </AbsoluteFill>
  );
};

const OwnScene = () => {
  const f = useCurrentFrame();
  const enter = spring({frame: f - 6, fps: 30, config: {damping: 16}});
  const keyX = interpolate(f, [0, 30], [-160, 0], {extrapolateRight: 'clamp'});
  const keyRot = interpolate(f, [30, 50], [0, 90], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const glow = 0.3 + Math.sin(f * 0.12) * 0.12;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 50}}>
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center'}}>
        <Pill color={C.teal} bg="rgba(52,227,208,0.12)">✅ Handarbeit = Eigentum</Pill>
      </div>
      <div style={{position: 'relative', transform: `translateY(${(1 - enter) * 40}px)`, opacity: enter, marginTop: 60}}>
        <div style={{borderRadius: 20, boxShadow: `0 0 70px rgba(52,227,208,${glow})`}}>
          <Browser tint="transparent" lockO={0}><SiteSkeleton /></Browser>
        </div>
        <div style={{position: 'absolute', left: -40, top: 150, fontSize: 90, transform: `translateX(${keyX}px) rotate(${keyRot}deg)`}}>🔑</div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
        <Pill color={C.teal} bg={C.card} delay={30}>Der Code gehört dir</Pill>
        <Pill color={C.teal} bg={C.card} delay={44}>Frei hostbar – überall</Pill>
        <Pill color={C.teal} bg={C.card} delay={58}>Pflege? Optional, kein Muss</Pill>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 14}});
  const pulse = 1 + Math.sin(f * 0.18) * 0.03;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 26}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 86, color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 30}}>
          Deine Website.<br /><span style={{color: C.violet}}>Dein Eigentum.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '26px 52px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 38, fontWeight: 800}}>Kommentier „MEINS" → so geht's</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const EigentumKeys = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 800px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={96}><HookScene /></Sequence>
      <Sequence from={96} durationInFrames={250}><RentScene /></Sequence>
      <Sequence from={346} durationInFrames={250}><OwnScene /></Sequence>
      <Sequence from={596} durationInFrames={124}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
