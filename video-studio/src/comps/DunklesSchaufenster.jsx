import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, rng} from './Cine.jsx';

// Cinematic: Nachtstraße. Dunkles Schaufenster (keine Website) vs. warm
// erleuchtetes (deine Website) – das Schaufenster, das nie schließt.
// 30fps → 75 + 195 + 210 + 90 + 60 = 630 = 21,0 s
const HOOK = 75, DARK = 195, LIT = 210, STREAM = 90, CTA = 60;

const NightStreet = () => (
  <>
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#0a0a12 0%,#0c0d17 55%,#08080e 100%)'}} />
    {/* Gehweg */}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 360, background: 'linear-gradient(180deg,#0e0f18,#08080d)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 356, height: 2, background: 'linear-gradient(90deg,transparent,#20222e,transparent)'}} />
    {/* nasse Reflexion */}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: 'linear-gradient(180deg,transparent,rgba(124,92,255,0.05))'}} />
  </>
);

// Ladenfassade. lit → warmes Fenster, sonst dunkel.
const Storefront = ({lit, glow = C.gold, showContent = false, f = 0}) => {
  const g = lit ? glow : '#111119';
  return (
    <div style={{position: 'absolute', left: 210, top: 560, width: 660, height: 760}}>
      {/* Fassade */}
      <div style={{position: 'absolute', inset: 0, background: '#111017', borderRadius: 10, border: '2px solid #20202a'}} />
      {/* Markise */}
      <div style={{position: 'absolute', left: -18, top: -6, width: 696, height: 58, background: lit ? 'repeating-linear-gradient(90deg,#2a2230 0 44px,#241d2a 44px 88px)' : 'repeating-linear-gradient(90deg,#17161d 0 44px,#131219 44px 88px)', borderRadius: 8, clipPath: 'polygon(3% 0,97% 0,100% 100%,0 100%)'}} />
      {/* Schild */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 74, textAlign: 'center', fontSize: 26, fontWeight: 800, letterSpacing: 4, color: lit ? glow : '#33313c'}}>{lit ? 'GEÖFFNET' : 'OFFLINE'}</div>
      {/* Schaufenster */}
      <div style={{position: 'absolute', left: 44, top: 130, width: 572, height: 520, borderRadius: 8, border: '3px solid #24242f', background: lit ? `linear-gradient(180deg, ${glow}55, ${glow}22 60%, ${glow}44)` : 'linear-gradient(180deg,#0c0c12,#0a0a10)', boxShadow: lit ? `0 0 90px 20px ${glow}55, inset 0 0 80px ${glow}44` : 'inset 0 0 40px #000'}}>
        {showContent && (
          <>
            <div style={{position: 'absolute', left: 40, top: 60, width: 220, height: 30, borderRadius: 6, background: `${glow}`, opacity: interpolate(f, [0, 24], [0, 0.9], {extrapolateRight: 'clamp'})}} />
            <div style={{position: 'absolute', left: 40, top: 112, width: 480, height: 14, borderRadius: 4, background: '#fff8', opacity: interpolate(f, [10, 34], [0, 0.7], {extrapolateRight: 'clamp'})}} />
            <div style={{position: 'absolute', left: 40, top: 138, width: 400, height: 14, borderRadius: 4, background: '#fff6', opacity: interpolate(f, [16, 40], [0, 0.6], {extrapolateRight: 'clamp'})}} />
            <div style={{position: 'absolute', left: 40, top: 300, width: 200, height: 64, borderRadius: 12, background: C.violet, opacity: interpolate(f, [24, 50], [0, 1], {extrapolateRight: 'clamp'}), boxShadow: `0 0 30px ${C.violet}88`}} />
          </>
        )}
      </div>
      {/* Tür */}
      <div style={{position: 'absolute', left: 270, top: 664, width: 120, height: 96, borderRadius: '6px 6px 0 0', background: lit ? `${glow}33` : '#0c0c12', border: '2px solid #24242f'}} />
      {/* Lichtwurf auf Gehweg */}
      {lit && <div style={{position: 'absolute', left: -40, top: 690, width: 740, height: 220, background: `radial-gradient(closest-side, ${glow}33, transparent 72%)`, filter: 'blur(24px)'}} />}
    </div>
  );
};

// Passant-Silhouette, die über die Straße läuft.
const Walker = ({x, scale = 1, dim = false, f, i = 0, pause = null}) => {
  const bob = Math.abs(Math.sin((f + i * 10) * 0.22)) * 6;
  const col = dim ? '#1a1a22' : '#050507';
  return (
    <div style={{position: 'absolute', left: x, top: 1180 - bob, transform: `scale(${scale})`, transformOrigin: 'bottom center', opacity: 0.96}}>
      <div style={{width: 46, height: 46, borderRadius: '50%', background: col, margin: '0 auto'}} />
      <div style={{width: 78, height: 150, borderRadius: '38px 38px 20px 20px', background: col, marginTop: -6}} />
    </div>
  );
};

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.teal}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 66px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 12}}>{kicker}</div>}
    <div style={{fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <AbsoluteFill>
      <NightStreet />
      <Storefront lit={false} />
      <Walker x={120} scale={1} f={f} i={2} />
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center', opacity: a}}>
        <div style={{fontSize: 40, fontWeight: 900, color: C.gold, fontVariantNumeric: 'tabular-nums'}}>23:4{blink ? '1' : '2'} Uhr</div>
      </div>
      <Caption top={340} main={<>Ein Kunde sucht<br />gerade <span style={{color: C.teal}}>genau dich</span>.</>} o={a} ty={(1 - a) * 22} />
    </AbsoluteFill>
  );
};

const DarkScene = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 150], [-120, 1160], {extrapolateRight: 'clamp'});
  // kurzer Halt vor dem dunklen Fenster, dann weiter
  const paused = f > 60 && f < 96;
  const wx = paused ? 470 : x;
  const lab = spring({frame: f - 30, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <NightStreet />
      <Storefront lit={false} />
      <Walker x={wx} scale={1.05} f={f} i={1} />
      <Caption top={300} kicker="KEINE WEBSITE = DUNKEL" main={<>Er steht davor.<br /><span style={{color: C.red}}>Und geht weiter.</span></>} o={lab} ty={(1 - lab) * 18} kcol={C.red} />
    </AbsoluteFill>
  );
};

const LitScene = () => {
  const f = useCurrentFrame();
  const on = spring({frame: f - 6, fps: 30, config: {damping: 12}});
  const x = interpolate(f, [40, 150], [-120, 430], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const enter = interpolate(f, [150, 190], [430, 470], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wx = f < 150 ? x : enter;
  const fade = interpolate(f, [175, 200], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lab = spring({frame: f - 40, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <NightStreet />
      <div style={{opacity: on}}><Storefront lit glow={C.gold} showContent f={f} /></div>
      <Walker x={wx} scale={1.05} f={f} i={3} pause />
      <div style={{opacity: fade}}><Walker x={wx} scale={1.05} f={f} i={3} /></div>
      <Caption top={280} kicker="IMMER GEÖFFNET" main={<>Deine Website:<br />das Schaufenster, das<br /><span style={{color: C.teal}}>nie schließt</span>.</>} o={lab} ty={(1 - lab) * 18} />
    </AbsoluteFill>
  );
};

const StreamScene = () => {
  const f = useCurrentFrame();
  const walkers = [];
  for (let i = 0; i < 6; i++) {
    const start = -140 - i * 190;
    const wx = start + interpolate(f, [0, 90], [0, 700], {extrapolateRight: 'clamp'});
    walkers.push(<Walker key={i} x={Math.min(wx, 430 + i * 8)} scale={0.85 + rng(i) * 0.35} f={f} i={i} />);
  }
  const a = spring({frame: f - 8, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <NightStreet />
      <Storefront lit glow={C.gold} showContent f={f + 40} />
      {walkers}
      <Caption top={300} main={<>Immer offen.<br />Immer sichtbar. <span style={{color: C.teal}}>Immer du.</span></>} o={a} ty={(1 - a) * 16} />
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
      <NightStreet />
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Dein Schaufenster im Netz <span style={{color: C.gold}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 840, lineHeight: 1.3}}>Wann warst DU zuletzt nachts auf einer Website? 🌙</div>
    </AbsoluteFill>
  );
};

export const DunklesSchaufenster = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={DARK}><DarkScene /></Sequence>
    <Sequence from={HOOK + DARK} durationInFrames={LIT}><LitScene /></Sequence>
    <Sequence from={HOOK + DARK + LIT} durationInFrames={STREAM}><StreamScene /></Sequence>
    <Sequence from={HOOK + DARK + LIT + STREAM} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.08} vignette={0.82} motes={14} gradeProps={{a: 'rgba(245,185,69,0.10)', b: 'rgba(124,92,255,0.10)'}} />
  </AbsoluteFill>
);
