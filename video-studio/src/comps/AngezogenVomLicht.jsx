import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, rng} from './Cine.jsx';

// Cinematic: Motten fliegen zum Licht. Eine leuchtende Website zieht Fachkräfte
// an. Kernbotschaft: Talente / Bewerber gewinnen.
// 30fps → 75 + 195 + 180 + 75 + 75 = 600 = 20,0 s
const HOOK = 75, LIGHTON = 195, LAND = 180, LINE = 75, CTA = 75;

const CX = 540, CY = 720;

const Bulb = ({on, f = 0}) => {
  const flick = on ? 0.9 + Math.sin(f * 0.4) * 0.06 : 0;
  return (
    <div style={{position: 'absolute', left: CX - 90, top: CY - 90, width: 180, height: 180}}>
      {on && <div style={{position: 'absolute', left: -220, top: -220, width: 620, height: 620, borderRadius: '50%', background: `radial-gradient(closest-side, ${C.gold}55, ${C.gold}18 40%, transparent 72%)`, opacity: flick}} />}
      <div style={{position: 'absolute', left: 40, top: 0, width: 100, height: 116, borderRadius: '50% 50% 46% 46%', background: on ? `radial-gradient(circle at 50% 40%, #fff, ${C.gold})` : '#17161d', border: '2px solid #2a2833', boxShadow: on ? `0 0 60px 12px ${C.gold}` : 'none'}} />
      {/* Filament */}
      <div style={{position: 'absolute', left: 82, top: 40, width: 16, height: 40, border: `2px solid ${on ? '#fff' : '#33313c'}`, borderTop: 'none', borderRadius: '0 0 10px 10px'}} />
      {/* Sockel */}
      <div style={{position: 'absolute', left: 62, top: 112, width: 56, height: 34, background: 'repeating-linear-gradient(180deg,#2a2833 0 5px,#1c1b24 5px 10px)', borderRadius: 4}} />
    </div>
  );
};

// Eine Motte = Fachkraft, spiralt zum Licht und umkreist es.
const Moth = ({i, f, landed = false, col = C.teal}) => {
  const orbitR = 140 + (i % 4) * 55;
  const introT = Math.max(0, Math.min(1, (f - i * 3) / 80));
  const ease = 1 - Math.pow(1 - introT, 3);
  const startR = 620 + rng(i) * 420;
  const r = startR + (orbitR - startR) * ease;
  const dir = i % 2 ? 1 : -0.75;
  const ang = rng(i) * 6.283 + f * 0.03 * dir;
  const flut = Math.sin(f * 0.55 + i) * 8;
  const x = landed ? CX + Math.cos(rng(i) * 6.283) * (orbitR + 20) : CX + Math.cos(ang) * r + flut;
  const y = landed ? CY + Math.sin(rng(i) * 6.283) * (orbitR * 0.7 + 20) : CY + Math.sin(ang) * r * 0.7 + Math.cos(f * 0.5 + i) * 6;
  const wing = 0.5 + Math.abs(Math.sin(f * 0.6 + i)) * 0.5;
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{position: 'absolute', left: -10, top: -4, width: 12, height: 8, borderRadius: '50%', background: col, opacity: 0.85, transform: `scaleX(${wing}) rotate(-24deg)`, boxShadow: `0 0 8px ${col}`}} />
      <div style={{position: 'absolute', left: 2, top: -4, width: 12, height: 8, borderRadius: '50%', background: col, opacity: 0.85, transform: `scaleX(${wing}) rotate(24deg)`, boxShadow: `0 0 8px ${col}`}} />
      <div style={{position: 'absolute', left: -2, top: -3, width: 6, height: 12, borderRadius: 4, background: '#0c0c12'}} />
    </div>
  );
};

const Moths = ({f, n = 14, landed = false}) => {
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(<Moth key={i} i={i} f={f} landed={landed} col={i % 3 === 0 ? C.gold : C.teal} />);
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{arr}</AbsoluteFill>;
};

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.gold}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 66px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 12}}>{kicker}</div>}
    <div style={{fontSize: 55, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <Bulb on={false} />
      <Caption top={430} main={<>Gute Leute finden dich<br /><span style={{color: C.red}}>nicht im Dunkeln</span>.</>} o={a} ty={(1 - a) * 22} kcol={C.red} />
    </AbsoluteFill>
  );
};

const LightOnScene = () => {
  const f = useCurrentFrame();
  const on = f > 12;
  const lab = spring({frame: f - 30, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      {f < 12 && <AbsoluteFill style={{background: '#000'}} />}
      <Bulb on={on} f={f} />
      {on && <Moths f={f - 12} n={14} />}
      <Caption top={1230} kicker="ZEIGEN STATT ERZÄHLEN" main={<>Eine starke Website<br />ist dein <span style={{color: C.gold}}>Licht</span>.</>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const LandScene = () => {
  const f = useCurrentFrame();
  const landed = f > 90;
  const count = Math.min(5, 1 + Math.floor(interpolate(f, [30, 150], [0, 4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
  const lab = spring({frame: f - 10, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Bulb on f={f} />
      <Moths f={f + 120} n={16} landed={landed} />
      <div style={{position: 'absolute', top: 1120, left: 0, right: 0, textAlign: 'center', opacity: lab}}>
        <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.teal}}>BEWERBUNGEN</div>
        <div style={{fontSize: 110, fontWeight: 900, color: C.ink, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums'}}>{count}</div>
      </div>
      <Caption top={1360} main={<>Fachkräfte kommen<br /><span style={{color: C.teal}}>zum Licht</span>.</>} o={lab} ty={0} />
    </AbsoluteFill>
  );
};

const LineScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <Bulb on f={f} />
      <div style={{opacity: a, transform: `translateY(${(1 - a) * 16}px)`, marginTop: 260}}>
        <div style={{fontSize: 62, fontWeight: 900, color: C.ink, lineHeight: 1.14}}>Sichtbar sein zieht<br />die <span style={{color: C.gold}}>Besten</span> an.</div>
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
      <Moths f={f} n={8} />
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.gold, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Werde sichtbar für Talente <span style={{color: C.gold}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 860, lineHeight: 1.3}}>Suchst du gerade Leute? 🙋 in die Kommentare.</div>
    </AbsoluteFill>
  );
};

export const AngezogenVomLicht = () => (
  <AbsoluteFill style={{background: '#050506', fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={LIGHTON}><LightOnScene /></Sequence>
    <Sequence from={HOOK + LIGHTON} durationInFrames={LAND}><LandScene /></Sequence>
    <Sequence from={HOOK + LIGHTON + LAND} durationInFrames={LINE}><LineScene /></Sequence>
    <Sequence from={HOOK + LIGHTON + LAND + LINE} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.08} vignette={0.86} gradeProps={{a: 'rgba(245,185,69,0.11)', b: 'rgba(52,227,208,0.09)'}} />
  </AbsoluteFill>
);
