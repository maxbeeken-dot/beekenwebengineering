import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 3 "Profile" zum Swipen. dir: 'left' (Nope) | 'right' (Like)
const CARDS = [
  {
    name: 'Baukasten-Bernd', age: '6,2 s', mockBg: '#241417', accent: C.red,
    traits: [{i: '🐌', t: 'lädt in 6,2 Sekunden'}, {i: '🎪', t: 'Pop-up beim Laden'}, {i: '📷', t: 'Stockfoto-Handschlag'}],
    dir: 'left', verdict: 'NOPE', why: 'Die Hälfte springt ab, bevor die Seite lädt.',
  },
  {
    name: 'Template-Tina', age: 'wie 1000 andere', mockBg: '#1b1a24', accent: C.gold,
    traits: [{i: '👯', t: 'sieht aus wie überall'}, {i: '❓', t: 'kein klarer Button'}, {i: '📱', t: 'kaputt auf dem Handy'}],
    dir: 'left', verdict: 'NOPE', why: 'Austauschbar = kein Grund, dich zu wählen.',
  },
  {
    name: 'Handgecodet ⚡', age: '0,9 s', mockBg: '#0e1a1c', accent: C.teal, isBWE: true,
    traits: [{i: '⚡', t: 'lädt in 0,9 Sekunden'}, {i: '🔒', t: 'DSGVO-sicher'}, {i: '🔑', t: 'gehört komplett dir'}],
    dir: 'right', verdict: 'MATCH', why: 'Schnell, klar, deins. Genau dein Typ.',
  },
];

const HOOK = 56;
const CARD_LEN = 124;
const CTA_LEN = 96;

// Mini-Website-Mockup in der Karte
const Mock = ({data}) => {
  const bars = data.isBWE
    ? [{w: '52%', c: C.teal}, {w: '78%', c: '#2a3b3d'}, {w: '64%', c: '#2a3b3d'}]
    : [{w: '70%', c: '#3a2a2e'}, {w: '44%', c: '#3a2a2e'}, {w: '82%', c: '#3a2a2e'}];
  return (
    <div style={{height: 300, borderRadius: 18, background: data.mockBg, overflow: 'hidden', position: 'relative', border: `1px solid ${C.border}`}}>
      <div style={{height: 34, background: '#00000030', display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px'}}>
        <div style={{width: 9, height: 9, borderRadius: 9, background: '#ff5f57'}} />
        <div style={{width: 9, height: 9, borderRadius: 9, background: '#febc2e'}} />
        <div style={{width: 9, height: 9, borderRadius: 9, background: '#28c840'}} />
      </div>
      <div style={{padding: 22, display: 'flex', flexDirection: 'column', gap: 14}}>
        <div style={{width: 90, height: 90, borderRadius: 14, background: data.isBWE ? 'rgba(52,227,208,0.18)' : '#ffffff10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46}}>{data.isBWE ? '⚡' : (data.name[0])}</div>
        {bars.map((b, i) => (<div key={i} style={{width: b.w, height: 16, borderRadius: 8, background: b.c}} />))}
      </div>
      {!data.isBWE && <div style={{position: 'absolute', right: 14, bottom: 12, fontSize: 30}}>{data.name.includes('Bernd') ? '🎪' : '👯'}</div>}
    </div>
  );
};

const CardScene = ({data, index}) => {
  const f = useCurrentFrame();
  const enter = spring({frame: f, fps: 30, config: {damping: 15, mass: 0.7}});
  const swipeStart = 92;
  const isRight = data.dir === 'right';
  const swipe = interpolate(f, [swipeStart, swipeStart + 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = swipe * (isRight ? 900 : -900);
  const rot = swipe * (isRight ? 22 : -22);
  const stamp = spring({frame: f - (swipeStart - 6), fps: 30, config: {damping: 11, mass: 0.6}});
  const enterY = (1 - enter) * 60;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 60}}>
      <div style={{fontSize: 26, fontWeight: 800, color: C.muted, letterSpacing: 2, marginBottom: 24, opacity: enter}}>PROFIL {index + 1} / 3</div>
      <div style={{position: 'relative', width: 720, opacity: enter, transform: `translateX(${x}px) translateY(${enterY}px) rotate(${rot}deg)`}}>
        {/* Karte */}
        <div style={{background: C.card, borderRadius: 30, border: `1px solid ${C.border}`, padding: 26, boxShadow: '0 30px 80px rgba(0,0,0,0.55)'}}>
          <Mock data={data} />
          <div style={{display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 22}}>
            <div style={{fontSize: 46, fontWeight: 900, color: C.ink}}>{data.name}</div>
            <div style={{fontSize: 28, fontWeight: 700, color: data.accent}}>{data.age}</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18}}>
            {data.traits.map((tr, i) => {
              const show = spring({frame: f - (18 + i * 12), fps: 30, config: {damping: 16}});
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: show, transform: `translateX(${(1 - show) * -20}px)`}}>
                  <div style={{fontSize: 32}}>{tr.i}</div>
                  <div style={{fontSize: 30, fontWeight: 600, color: C.ink}}>{tr.t}</div>
                </div>
              );
            })}
          </div>
          {/* Warum – in der Karte, swipet mit weg */}
          <div style={{marginTop: 20, padding: '14px 18px', borderRadius: 14, background: `${data.accent}1e`, borderLeft: `4px solid ${data.accent}`,
            opacity: spring({frame: f - 56, fps: 30, config: {damping: 16}}), fontSize: 26, fontWeight: 600, color: C.ink}}>
            {data.why}
          </div>
        </div>
        {/* Stempel */}
        <div style={{position: 'absolute', top: 40, left: isRight ? 'auto' : 40, right: isRight ? 40 : 'auto',
          transform: `rotate(${isRight ? -16 : 16}deg) scale(${stamp})`, opacity: stamp,
          border: `6px solid ${isRight ? C.teal : C.red}`, color: isRight ? C.teal : C.red,
          padding: '8px 22px', borderRadius: 16, fontSize: 52, fontWeight: 900, letterSpacing: 2}}>
          {data.verdict === 'MATCH' ? 'MATCH 💚' : 'NOPE'}
        </div>
      </div>
      {/* Swipe-Buttons */}
      <div style={{display: 'flex', gap: 60, marginTop: 40, opacity: enter}}>
        <div style={{width: 92, height: 92, borderRadius: 92, border: `3px solid ${!isRight ? C.red : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, background: !isRight && swipe > 0.2 ? 'rgba(255,84,104,0.15)' : 'transparent'}}>❌</div>
        <div style={{width: 92, height: 92, borderRadius: 92, border: `3px solid ${isRight ? C.teal : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, background: isRight && swipe > 0.2 ? 'rgba(52,227,208,0.15)' : 'transparent'}}>💚</div>
      </div>
    </AbsoluteFill>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const b = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 26}}>
      <div style={{fontSize: 96, transform: `scale(${a})`}}>🔥</div>
      <div style={{fontSize: 74, fontWeight: 900, color: C.ink, lineHeight: 1.05, opacity: a}}>Website-<span style={{color: C.violet}}>Tinder</span></div>
      <div style={{fontSize: 34, fontWeight: 700, color: C.muted, opacity: b, transform: `translateY(${(1 - b) * 24}px)`}}>Swipe <span style={{color: C.red}}>links</span> oder <span style={{color: C.teal}}>rechts</span>? 👇</div>
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
        <div style={{fontSize: 80, marginBottom: 6}}>💚</div>
        <div style={{fontSize: 60, color: C.ink, fontWeight: 900, lineHeight: 1.1}}>It's a <span style={{color: C.teal}}>Match</span>.</div>
        <div style={{fontSize: 28, color: C.teal, fontWeight: 700, letterSpacing: 4, marginTop: 16}}>BEEKEN WEB ENGINEERING</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 42}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 44px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>👇 Swipt DEINE Seite nach rechts?</div>
        </div>
        <div style={{marginTop: 32, fontSize: 34, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebsiteTinder = () => {
  const f = useCurrentFrame();
  const glowX = interpolate(f, [0, 560], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + glowX}px 780px, rgba(124,92,255,0.14), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      {CARDS.map((c, i) => (
        <Sequence key={i} from={HOOK + i * CARD_LEN} durationInFrames={CARD_LEN}>
          <CardScene data={c} index={i} />
        </Sequence>
      ))}
      <Sequence from={HOOK + CARDS.length * CARD_LEN} durationInFrames={CTA_LEN}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
