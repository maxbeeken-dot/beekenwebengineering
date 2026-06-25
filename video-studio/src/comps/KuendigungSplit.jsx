import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const MiniSite = ({dead}) => (
  <div style={{padding: 22, opacity: dead ? 0.25 : 1, filter: dead ? 'grayscale(1)' : 'none', transition: 'all'}}>
    <div style={{width: 110, height: 14, background: C.cardHi, borderRadius: 5, marginBottom: 18}} />
    <div style={{width: '88%', height: 22, background: C.cardHi, borderRadius: 6, marginBottom: 10}} />
    <div style={{width: '64%', height: 22, background: C.cardHi, borderRadius: 6, marginBottom: 20}} />
    <div style={{width: 150, height: 44, background: dead ? C.cardHi : C.violet, borderRadius: 10}} />
  </div>
);

const Panel = ({side, label, labelColor, dead, children, badge, badgeColor}) => (
  <div style={{flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26,
    background: side === 'l' ? 'rgba(255,84,104,0.04)' : 'rgba(52,227,208,0.04)', position: 'relative'}}>
    <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 2, color: labelColor}}>{label}</div>
    <div style={{width: 400, height: 300, background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, overflow: 'hidden', position: 'relative'}}>
      <div style={{height: 40, background: C.cardHi, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px'}}>
        {[0, 1, 2].map(i => <div key={i} style={{width: 12, height: 12, borderRadius: '50%', background: C.dim}} />)}
      </div>
      <div style={{position: 'relative', height: 260}}>
        {children}
      </div>
    </div>
    {badge}
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const shake = f > 40 ? Math.sin(f * 0.8) * 3 : 0;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.86 + pop * 0.14}) translateX(${shake}px)`, opacity: pop}}>
        <div style={{fontSize: 120}}>👀</div>
        <div style={{fontSize: 80, color: C.ink, fontWeight: 800, lineHeight: 1.08, marginTop: 16}}>
          Kündige mal dein<br /><span style={{color: C.red}}>Website-Abo.</span></div>
        <div style={{fontSize: 36, color: C.muted, marginTop: 24}}>Was bleibt dann von deiner Seite?</div>
      </div>
    </AbsoluteFill>
  );
};

const SplitScene = () => {
  const f = useCurrentFrame();
  const enter = spring({frame: f, fps: 30, config: {damping: 18}});
  const dead = f > 70;
  const o404 = interpolate(f, [70, 95], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const stayGlow = 0.25 + Math.sin(f * 0.12) * 0.1;
  const badgeP = spring({frame: f - 100, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill style={{opacity: enter}}>
      <div style={{position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', zIndex: 5}}>
        <div style={{display: 'inline-block', background: C.cardHi, color: C.ink, border: `1px solid ${C.border}`, borderRadius: 99, padding: '12px 30px', fontSize: 32, fontWeight: 700}}>Du hörst auf zu zahlen …</div>
      </div>
      <div style={{display: 'flex', width: '100%', height: '100%', paddingTop: 60}}>
        <Panel side="l" label="BAUKASTEN" labelColor={C.red} dead={dead}
          badge={<div style={{transform: `scale(${badgeP})`, opacity: badgeP, color: C.red, fontSize: 30, fontWeight: 800, textAlign: 'center', maxWidth: 360}}>Alles weg.<br />Besessen hast du nie etwas.</div>}>
          <MiniSite dead={dead} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: o404, background: 'rgba(8,8,11,0.86)'}}>
            <div style={{fontSize: 70, fontWeight: 900, color: C.red}}>404</div>
            <div style={{fontSize: 24, color: C.muted, marginTop: 6}}>Seite nicht verfügbar</div>
          </div>
        </Panel>
        <div style={{width: 2, background: C.border}} />
        <Panel side="r" label="HANDARBEIT · BWE" labelColor={C.teal} dead={false}
          badge={<div style={{transform: `scale(${badgeP})`, opacity: badgeP, color: C.teal, fontSize: 30, fontWeight: 800, textAlign: 'center', maxWidth: 360}}>Läuft weiter.<br />Gehört dir.</div>}>
          <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 60px rgba(52,227,208,${stayGlow})`, pointerEvents: 'none'}} />
          <MiniSite dead={false} />
        </Panel>
      </div>
    </AbsoluteFill>
  );
};

const PunchScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 80}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 76, color: C.ink, fontWeight: 800, lineHeight: 1.12}}>
          Deine Website sollte<br /><span style={{color: C.teal}}>dir</span> gehören –<br />nicht dem Anbieter.</div>
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
          Kein Mietmodell.<br /><span style={{color: C.violet}}>Dein Eigentum.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '26px 52px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 38, fontWeight: 800}}>Kommentier „MEINS" → so geht's</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const KuendigungSplit = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 800px, rgba(124,92,255,0.12), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={92}><HookScene /></Sequence>
      <Sequence from={92} durationInFrames={300}><SplitScene /></Sequence>
      <Sequence from={392} durationInFrames={188}><PunchScene /></Sequence>
      <Sequence from={580} durationInFrames={140}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
