import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const AddressBar = ({secure, label}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, width: 780, background: C.cardHi, border: `1px solid ${C.border}`, borderRadius: 40, padding: '16px 30px'}}>
    <span style={{fontSize: 34}}>{secure ? '🔒' : '🔓'}</span>
    <span style={{fontSize: 30, fontWeight: 800, color: secure ? C.teal : C.red}}>{label}</span>
    <span style={{fontSize: 30, fontWeight: 600, color: C.muted}}>deine-seite.de</span>
  </div>
);

const Point = ({ok, text, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  return (
    <div style={{opacity: p, transform: `translateX(${(1 - p) * -36}px)`,
      display: 'flex', alignItems: 'center', gap: 16, width: 780,
      background: C.card, border: `1px solid ${C.border}`, borderLeft: `5px solid ${ok ? C.teal : C.red}`, borderRadius: 14, padding: '15px 22px'}}>
      <span style={{color: ok ? C.teal : C.red, fontWeight: 900, fontSize: 30}}>{ok ? '✓' : '✗'}</span>
      <span style={{flex: 1, color: C.ink, fontWeight: 700, fontSize: 31, textAlign: 'left'}}>{text}</span>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.86 + pop * 0.14})`, opacity: pop}}>
        <div style={{fontSize: 120}}>🔒</div>
        <div style={{fontSize: 76, color: C.ink, fontWeight: 800, lineHeight: 1.1, marginTop: 6}}>
          Das kleine <span style={{color: C.teal}}>Schloss</span></div>
        <div style={{marginTop: 26, fontSize: 42, color: C.muted, fontWeight: 700}}>entscheidet, ob man dir traut.</div>
      </div>
    </AbsoluteFill>
  );
};

const WithoutScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 18}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 48, fontWeight: 800, color: C.ink, marginBottom: 6}}>Ohne SSL <span style={{color: C.red}}>🔓</span></div>
      <AddressBar secure={false} label="Nicht sicher" />
      <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8}}>
        <Point ok={false} text="Daten werden offen übertragen" delay={18} />
        <Point ok={false} text="Browser warnt: „Nicht sicher“" delay={40} />
        <Point ok={false} text="Besucher springen ab" delay={62} />
      </div>
    </AbsoluteFill>
  );
};

const WithScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 18}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 48, fontWeight: 800, color: C.ink, marginBottom: 6}}>Mit SSL <span style={{color: C.teal}}>🔒</span></div>
      <AddressBar secure={true} label="https://" />
      <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8}}>
        <Point ok={true} text="Alles verschlüsselt übertragen" delay={18} />
        <Point ok={true} text="Google bevorzugt deine Seite" delay={40} />
        <Point ok={true} text="Besucher vertrauen dir" delay={62} />
      </div>
    </AbsoluteFill>
  );
};

const GoodNewsScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{opacity: a, transform: `scale(${0.9 + a * 0.1})`, fontSize: 48, color: C.muted, fontWeight: 700}}>Die gute Nachricht:</div>
      <div style={{marginTop: 24, opacity: b, transform: `translateY(${(1 - b) * 20}px)`, fontSize: 64, color: C.ink, fontWeight: 800, lineHeight: 1.15}}>
        Ein SSL-Zertifikat gibt's<br />heute oft <span style={{color: C.teal}}>gratis.</span></div>
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
        <div style={{fontSize: 80, color: C.ink, fontWeight: 800, lineHeight: 1.08, marginBottom: 30}}>
          Kein Schloss?<br /><span style={{color: C.red}}>Kein Vertrauen.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '24px 50px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 800}}>🔖 Speichern für später</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const HttpsSchloss = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={96}><HookScene /></Sequence>
      <Sequence from={96} durationInFrames={204}><WithoutScene /></Sequence>
      <Sequence from={300} durationInFrames={210}><WithScene /></Sequence>
      <Sequence from={510} durationInFrames={100}><GoodNewsScene /></Sequence>
      <Sequence from={610} durationInFrames={110}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
