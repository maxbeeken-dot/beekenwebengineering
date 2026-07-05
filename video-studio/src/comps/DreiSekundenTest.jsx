import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";
const HOOK = 56, SCENE = 176, CTA_LEN = 110;

const Phone = ({children, glow}) => (
  <div style={{width: 440, height: 760, borderRadius: 52, background: '#050507', border: `10px solid #17161d`, boxShadow: glow ? `0 0 60px ${glow}55` : '0 30px 70px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden'}}>
    <div style={{position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 120, height: 26, background: '#17161d', borderRadius: 20, zIndex: 5}} />
    {children}
  </div>
);

// Ladebalken-Site
const SiteContent = ({progress, isFast}) => {
  const loaded = progress >= 0.99;
  return (
    <AbsoluteFill style={{background: loaded ? (isFast ? '#0e1a1c' : '#241417') : '#0b0b0e'}}>
      {/* Browserzeile */}
      <div style={{height: 54, background: '#00000040', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 8, marginTop: 44}}>
        <div style={{width: 10, height: 10, borderRadius: 10, background: '#ff5f57'}} />
        <div style={{width: 10, height: 10, borderRadius: 10, background: '#febc2e'}} />
        <div style={{width: 10, height: 10, borderRadius: 10, background: '#28c840'}} />
      </div>
      {/* Ladebalken */}
      <div style={{height: 6, background: '#ffffff12'}}>
        <div style={{height: '100%', width: `${Math.min(progress, 1) * 100}%`, background: isFast ? C.teal : C.gold}} />
      </div>
      {/* Inhalt erscheint erst wenn geladen */}
      {loaded ? (
        <div style={{padding: 30, display: 'flex', flexDirection: 'column', gap: 18}}>
          <div style={{width: 100, height: 100, borderRadius: 18, background: isFast ? 'rgba(52,227,208,0.2)' : '#ffffff10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50}}>{isFast ? '⚡' : '🐌'}</div>
          <div style={{width: '80%', height: 22, borderRadius: 10, background: isFast ? '#2a3b3d' : '#3a2a2e'}} />
          <div style={{width: '60%', height: 22, borderRadius: 10, background: isFast ? '#2a3b3d' : '#3a2a2e'}} />
          {isFast && <div style={{marginTop: 10, padding: '16px 0', textAlign: 'center', background: C.teal, borderRadius: 12, color: '#04120f', fontWeight: 900, fontSize: 26}}>Jetzt anfragen →</div>}
        </div>
      ) : (
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16}}>
          <div style={{width: 46, height: 46, borderRadius: 46, border: `5px solid ${C.gold}`, borderTopColor: 'transparent', transform: `rotate(${progress * 2200}deg)`}} />
          <div style={{fontSize: 24, color: C.dim, fontWeight: 700}}>lädt…</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const SceneTest = ({isFast}) => {
  const f = useCurrentFrame();
  // Countdown 3..2..1
  const cd = Math.max(0, 3 - Math.floor(f / 30));
  // langsam: bei f=90 erst ~35% geladen; schnell: bei f=27 (0,9s) 100%
  const progress = isFast
    ? interpolate(f, [8, 35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : interpolate(f, [8, 150], [0, 0.55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const decidedAt = isFast ? 46 : 96;
  const decided = f >= decidedAt;
  const stamp = spring({frame: f - decidedAt, fps: 30, config: {damping: 11, mass: 0.7}});
  const color = isFast ? C.teal : C.red;
  // Besucher-Reaktion
  const visitorX = isFast ? 0 : interpolate(f, [decidedAt, decidedAt + 30], [0, 320], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const intro = spring({frame: f, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 50, gap: 22}}>
      <div style={{opacity: intro, fontSize: 34, fontWeight: 900, color: isFast ? C.teal : C.gold, letterSpacing: 1}}>{isFast ? '⚡ HANDGECODET' : '🐌 BAUKASTEN-SEITE'}</div>
      {/* Countdown + Phone */}
      <div style={{position: 'relative'}}>
        <div style={{transform: `scale(${intro})`}}>
          <Phone glow={decided ? color : null}><SiteContent progress={progress} isFast={isFast} /></Phone>
        </div>
        {/* Countdown-Zahl */}
        {!decided && cd > 0 && (
          <div style={{position: 'absolute', top: -30, right: -30, width: 110, height: 110, borderRadius: 110, background: 'rgba(0,0,0,0.7)', border: `4px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 900, color: C.gold}}>{cd}</div>
        )}
        {/* Besucher */}
        <div style={{position: 'absolute', bottom: 20, left: '50%', transform: `translateX(calc(-50% + ${visitorX}px)) scaleX(${isFast ? 1 : -1})`, fontSize: 76}}>{isFast ? '😍' : '🏃'}</div>
        {/* Stempel */}
        {decided && (
          <div style={{position: 'absolute', top: '42%', left: '50%', transform: `translate(-50%,-50%) rotate(${isFast ? -10 : 8}deg) scale(${stamp})`, opacity: stamp,
            border: `7px solid ${color}`, color, padding: '10px 26px', borderRadius: 16, fontSize: 60, fontWeight: 900, letterSpacing: 2, background: 'rgba(0,0,0,0.4)'}}>
            {isFast ? 'BLEIBT ✅' : 'WEG ❌'}
          </div>
        )}
      </div>
      {/* Fazit */}
      {decided && (
        <div style={{opacity: stamp, fontSize: 30, fontWeight: 700, color: C.ink, textAlign: 'center', maxWidth: 720}}>
          {isFast ? 'Geladen in 0,9 s — der Kunde bleibt & klickt.' : 'Über 3 s = 53 % sind weg. Für immer.'}
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
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 26}}>
      <div style={{fontSize: 96, transform: `scale(${a})`}}>⏱️</div>
      <div style={{fontSize: 72, fontWeight: 900, color: C.ink, lineHeight: 1.06, opacity: a}}>Der <span style={{color: C.gold}}>3-Sekunden</span>-Test</div>
      <div style={{fontSize: 32, fontWeight: 700, color: C.muted, opacity: b, transform: `translateY(${(1 - b) * 24}px)`}}>Bleibt der Kunde – oder ist er weg? 👇</div>
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
        <div style={{fontSize: 62, color: C.ink, fontWeight: 900, lineHeight: 1.12}}>Handgecodet lädt in<br /><span style={{color: C.teal}}>unter 1 Sekunde</span>.</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 42}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 44px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>👇 Besteht DEINE Seite den Test?</div>
        </div>
        <div style={{marginTop: 32, fontSize: 34, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const DreiSekundenTest = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={SCENE}><SceneTest isFast={false} /></Sequence>
      <Sequence from={HOOK + SCENE} durationInFrames={SCENE}><SceneTest isFast={true} /></Sequence>
      <Sequence from={HOOK + SCENE * 2} durationInFrames={CTA_LEN}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
