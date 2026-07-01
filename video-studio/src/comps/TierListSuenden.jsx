import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const TIERS = [
  {key: 'S', color: '#34e3d0'},
  {key: 'A', color: '#63d98a'},
  {key: 'B', color: '#f5b945'},
  {key: 'C', color: '#f59545'},
  {key: 'D', color: '#ff7a5c'},
  {key: 'F', color: '#ff5468'},
];

// Bewusst plakativ: die Sünden landen alle unten — genau das triggert die Debatte.
const SINS = [
  {tier: 'F', icon: '🔊', text: 'Auto-Play-Musik', order: 0},
  {tier: 'F', icon: '🚫', text: 'Pop-up beim Laden', order: 1},
  {tier: 'D', icon: '🎠', text: 'Karussell-Slider', order: 2},
  {tier: 'D', icon: '🖋️', text: 'Comic Sans', order: 3},
  {tier: 'C', icon: '🤝', text: 'Stock-Foto-Handschlag', order: 4},
];

const FIRST = 22;
const STEP = 60;

const SinCard = ({icon, text, color, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 12, mass: 0.7}});
  const slam = interpolate(f - delay, [0, 6, 12], [1.35, 0.94, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{
      opacity: p, transform: `scale(${p * slam})`,
      display: 'flex', alignItems: 'center', gap: 12,
      background: C.cardHi, border: `1px solid ${color}`, borderRadius: 12,
      padding: '10px 18px', boxShadow: `0 8px 24px ${color}22`,
    }}>
      <span style={{fontSize: 34}}>{icon}</span>
      <span style={{color: C.ink, fontWeight: 800, fontSize: 30, whiteSpace: 'nowrap'}}>{text}</span>
    </div>
  );
};

const TierRow = ({tier, index}) => {
  const f = useCurrentFrame();
  const enter = spring({frame: f - index * 4, fps: 30, config: {damping: 18}});
  const cards = SINS.filter((s) => s.tier === tier.key);
  return (
    <div style={{
      opacity: enter, transform: `translateX(${(1 - enter) * -30}px)`,
      display: 'flex', alignItems: 'stretch', gap: 14, minHeight: 96,
    }}>
      <div style={{
        width: 96, flexShrink: 0, borderRadius: 14, background: tier.color,
        color: '#06110f', fontWeight: 900, fontSize: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{tier.key}</div>
      <div style={{
        flex: 1, borderRadius: 14, background: C.card, border: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexWrap: 'wrap',
      }}>
        {cards.map((s, i) => (
          <SinCard key={i} icon={s.icon} text={s.text} color={tier.color} delay={FIRST + s.order * STEP} />
        ))}
      </div>
    </div>
  );
};

const RankScene = () => {
  const f = useCurrentFrame();
  const title = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: '0 56px', gap: 22}}>
      <div style={{opacity: title, transform: `translateY(${(1 - title) * -30}px)`, textAlign: 'center', marginBottom: 6}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 800, letterSpacing: 3}}>TIER-LIST 🗑️</div>
        <div style={{fontSize: 66, color: C.ink, fontWeight: 900, lineHeight: 1.05, marginTop: 8}}>
          Web-Design-<span style={{color: C.red}}>Sünden</span>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
        {TIERS.map((t, i) => <TierRow key={t.key} tier={t} index={i} />)}
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 14}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 24}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 74, color: C.ink, fontWeight: 900, lineHeight: 1.08, marginBottom: 32}}>
          Was ist für <span style={{color: C.violet}}>DICH</span><br />F-Tier?
        </div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block'}}>
          <div style={{padding: '26px 50px', background: C.red, borderRadius: 18, color: '#fff', fontSize: 38, fontWeight: 900}}>👇 Verrat mir deine Nr. 1-Sünde</div>
        </div>
        <div style={{marginTop: 38, fontSize: 36, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const TierListSuenden = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 600], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${540 + bgGlowX}px 900px, rgba(255,84,104,0.12), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={500}><RankScene /></Sequence>
      <Sequence from={500} durationInFrames={100}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
