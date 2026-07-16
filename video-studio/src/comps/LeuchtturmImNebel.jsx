import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, rng} from './Cine.jsx';

// Cinematic: Website = Leuchtturm im Nebel. Kunden (Schiffe) finden dich – oder
// fahren vorbei. Kernbotschaft: bei Google gefunden werden / Sichtbarkeit.
// 30fps → 75 + 180 + 195 + 135 + 75 = 660 = 22,0 s
const HOOK = 75, TOWER = 180, CONTRAST = 195, HARBOR = 135, CTA = 75;

const CX = 540; // Turm-Mittelachse

// Nebelbänke: mehrere weiche, horizontal driftende Bänder.
const Fog = ({f, tint = '255,255,255', base = 0.06}) => {
  const bands = [];
  for (let i = 0; i < 6; i++) {
    const y = 300 + i * 240;
    const dx = Math.sin((f + i * 60) * 0.012) * 120 + (i % 2 ? -60 : 60);
    const op = base + Math.abs(Math.sin((f + i * 40) * 0.02)) * 0.05;
    bands.push(
      <div key={i} style={{
        position: 'absolute', left: -200 + dx, top: y, width: 1600, height: 190,
        background: `radial-gradient(closest-side, rgba(${tint},${op}), transparent 72%)`,
        filter: 'blur(26px)',
      }} />
    );
  }
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{bands}</AbsoluteFill>;
};

// Der Turm: dunkle Silhouette + Laternenraum. lit = Licht an?
const Tower = ({lit, glow = C.teal}) => (
  <div style={{position: 'absolute', left: CX - 70, top: 760, width: 140, height: 620}}>
    {/* Fels */}
    <div style={{position: 'absolute', left: -120, top: 560, width: 380, height: 220, background: 'radial-gradient(closest-side, #17161d, transparent 70%)', filter: 'blur(8px)'}} />
    {/* Turmkörper (leicht konisch) */}
    <div style={{position: 'absolute', left: 22, top: 96, width: 96, height: 500, background: 'linear-gradient(90deg, #0d0d12, #23222c 50%, #0d0d12)', clipPath: 'polygon(18% 0, 82% 0, 100% 100%, 0 100%)', borderRadius: 6}} />
    {/* rote Ringe */}
    <div style={{position: 'absolute', left: 30, top: 210, width: 80, height: 34, background: 'repeating-linear-gradient(180deg,#2a2930 0 17px,#3a1420 17px 34px)', clipPath: 'polygon(20% 0,80% 0,88% 100%,12% 100%)', opacity: 0.8}} />
    {/* Laternenraum */}
    <div style={{position: 'absolute', left: 40, top: 58, width: 60, height: 48, borderRadius: 8, background: lit ? `radial-gradient(closest-side, #fff, ${glow})` : '#1a1a20', boxShadow: lit ? `0 0 40px 10px ${glow}, 0 0 120px 30px ${glow}88` : 'none', border: '2px solid #2a2930'}} />
    {/* Dach */}
    <div style={{position: 'absolute', left: 34, top: 34, width: 72, height: 30, background: '#26242f', clipPath: 'polygon(50% 0,100% 100%,0 100%)'}} />
  </div>
);

// Rotierender Lichtkegel aus dem Laternenraum.
const Beam = ({f, glow = C.teal, amp = 42, op = 0.5}) => {
  const ang = Math.sin(f * 0.03) * amp;
  return (
    <div style={{position: 'absolute', left: CX, top: 812, transformOrigin: 'left center', transform: `rotate(${ang}deg)`, opacity: op}}>
      <div style={{position: 'absolute', left: 0, top: -160, width: 1300, height: 320, background: `linear-gradient(90deg, ${glow}cc, ${glow}22 55%, transparent 80%)`, clipPath: 'polygon(0 46%, 100% 0, 100% 100%, 0 54%)', filter: 'blur(10px)'}} />
    </div>
  );
};

// Ein Schiff = kleines Licht auf der See, das driftet.
const Ship = ({x, y, on, toward, f, i}) => {
  const bob = Math.sin((f + i * 25) * 0.06) * 6;
  const dx = toward ? interpolate(f, [0, 120], [0, (CX - x) * 0.5], {extrapolateRight: 'clamp'}) : interpolate(f, [0, 120], [0, (x < CX ? -260 : 260)], {extrapolateRight: 'clamp'});
  const col = on ? C.gold : C.dim;
  return (
    <div style={{position: 'absolute', left: x + dx, top: y + bob}}>
      <div style={{width: 10, height: 10, borderRadius: '50%', background: col, boxShadow: `0 0 14px 3px ${col}`}} />
      <div style={{position: 'absolute', left: 3, top: -18, width: 3, height: 18, background: '#3a3946'}} />
    </div>
  );
};

const Sea = () => (
  <>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 62%, #06070c 78%, #04050a 100%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1320, height: 3, background: 'linear-gradient(90deg,transparent,#1a2230,transparent)', opacity: 0.6}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1440, height: 3, background: 'linear-gradient(90deg,transparent,#151c28,transparent)', opacity: 0.5}} />
  </>
);

const Caption = ({top, kicker, main, mainCol = C.ink, o = 1, ty = 0}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 70px', opacity: o, transform: `translateY(${ty}px)`}}>
    {kicker && <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 6, color: C.teal, marginBottom: 12}}>{kicker}</div>}
    <div style={{fontSize: 58, fontWeight: 900, color: mainCol, lineHeight: 1.12, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  const b = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  const pulse = 0.4 + Math.abs(Math.sin(f * 0.05)) * 0.6;
  return (
    <AbsoluteFill>
      <Sea />
      <Fog f={f} base={0.08} />
      {/* fernes, schwaches Licht */}
      <div style={{position: 'absolute', left: CX - 8, top: 900, width: 16, height: 16, borderRadius: '50%', background: C.teal, opacity: pulse, boxShadow: `0 0 30px 8px ${C.teal}`, filter: 'blur(1px)'}} />
      <Caption top={430} main={<>Deine Kunden suchen dich<br />gerade <span style={{color: C.teal}}>im Nebel</span>.</>} o={a} ty={(1 - a) * 24} />
      <div style={{position: 'absolute', top: 660, left: 0, right: 0, textAlign: 'center', opacity: b, transform: `translateY(${(1 - b) * 16}px)`}}>
        <div style={{fontSize: 34, fontWeight: 800, color: C.gold}}>Finden sie dich? ↓</div>
      </div>
    </AbsoluteFill>
  );
};

const TowerScene = () => {
  const f = useCurrentFrame();
  const push = 1 + interpolate(f, [0, TOWER], [0, 0.06], {extrapolateRight: 'clamp'});
  const lab = spring({frame: f - 20, fps: 30, config: {damping: 16}});
  const on = f > 30;
  return (
    <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 60%'}}>
      <Sea />
      <Beam f={f} op={interpolate(f, [24, 60], [0, 0.55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      <Fog f={f} base={0.06} />
      <Tower lit={on} />
      <Ship x={230} y={1360} on={on} toward f={f} i={1} />
      <Ship x={840} y={1420} on={on} toward f={f} i={2} />
      <Ship x={410} y={1470} on={on} toward f={f} i={3} />
      <Caption top={300} kicker="ZEIGEN STATT ERZÄHLEN" main={<>Deine Website ist dein <span style={{color: C.teal}}>Leuchtturm</span>.</>} o={lab} ty={(1 - lab) * 18} />
    </AbsoluteFill>
  );
};

const ContrastScene = () => {
  const f = useCurrentFrame();
  const dark = f < 96;
  const flip = spring({frame: f - 96, fps: 30, config: {damping: 13, mass: 0.7}});
  const redO = interpolate(f, [10, 40, 86, 96], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tealO = interpolate(f, [100, 130], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Sea />
      {!dark && <Beam f={f - 96} op={0.55 * flip} />}
      <Fog f={f} base={0.07} tint={dark ? '255,90,110' : '52,227,208'} />
      <Tower lit={!dark} glow={C.teal} />
      <Ship x={210} y={1360} on={!dark} toward={!dark} f={dark ? f : f - 96} i={1} />
      <Ship x={860} y={1410} on={!dark} toward={!dark} f={dark ? f : f - 96} i={2} />
      <Ship x={470} y={1480} on={!dark} toward={!dark} f={dark ? f : f - 96} i={4} />
      <Caption top={300} kicker={dark ? 'UNSICHTBAR' : 'SICHTBAR'} main={dark ? <>Ohne? Sie <span style={{color: C.red}}>fahren vorbei</span>.</> : <>Mit? Sie steuern <span style={{color: C.teal}}>auf dich zu</span>.</>} mainCol={C.ink} o={dark ? redO : tealO} ty={dark ? 0 : (1 - flip) * 18} />
    </AbsoluteFill>
  );
};

const HarborScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 10, fps: 30, config: {damping: 16}});
  const cluster = interpolate(f, [0, 90], [0, 1], {extrapolateRight: 'clamp'});
  const lights = [];
  for (let i = 0; i < 9; i++) {
    const ex = 300 + rng(i) * 480;
    const ey = 1360 + rng(i * 3 + 1) * 130;
    const x = ex + (CX - ex) * 0.28 * cluster;
    const bob = Math.sin((f + i * 22) * 0.06) * 5;
    lights.push(<div key={i} style={{position: 'absolute', left: x, top: ey + bob, width: 10, height: 10, borderRadius: '50%', background: C.gold, boxShadow: `0 0 14px 3px ${C.gold}`}} />);
  }
  return (
    <AbsoluteFill>
      <Sea />
      <Beam f={f} op={0.45} />
      <Fog f={f} base={0.05} />
      <Tower lit glow={C.teal} />
      {lights}
      <Caption top={330} kicker="GEFUNDEN · ANGESTEUERT" main={<>Sichtbar bei Google.<br /><span style={{color: C.teal}}>Genau dafür bauen wir.</span></>} o={a} ty={(1 - a) * 18} />
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
      <Sea />
      <div style={{position: 'absolute', left: CX - 8, top: 250, width: 16, height: 16, borderRadius: '50%', background: C.teal, boxShadow: `0 0 40px 12px ${C.teal}`, opacity: pop}} />
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Dein Leuchtturm im Netz <span style={{color: C.teal}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 840, lineHeight: 1.3}}>Wie hell leuchtet deine Website? 🔦 in die Kommentare.</div>
    </AbsoluteFill>
  );
};

export const LeuchtturmImNebel = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={TOWER}><TowerScene /></Sequence>
    <Sequence from={HOOK + TOWER} durationInFrames={CONTRAST}><ContrastScene /></Sequence>
    <Sequence from={HOOK + TOWER + CONTRAST} durationInFrames={HARBOR}><HarborScene /></Sequence>
    <Sequence from={HOOK + TOWER + CONTRAST + HARBOR} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.08} vignette={0.8} motes={16} gradeProps={{a: 'rgba(52,227,208,0.12)', b: 'rgba(124,92,255,0.10)'}} />
  </AbsoluteFill>
);
