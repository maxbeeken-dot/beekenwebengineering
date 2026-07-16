import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere} from './Cine.jsx';

// Cinematic: Riesen-Daumen am Handy. Desktop-Seite kämpft gegen den Daumen,
// responsive Seite schmiegt sich an. Kernbotschaft: mobile-first.
// 30fps → 60 + 195 + 180 + 60 + 75 = 570 = 19,0 s
const HOOK = 60, FIGHT = 195, FLOW = 180, LINE = 60, CTA = 75;

const PX = 300, PY = 360, PW = 480, PH = 940;

// Handy mit Mini-Website. responsive → passt; sonst überläuft/winzig.
const Phone = ({responsive, f = 0, tap = 0}) => {
  const accent = responsive ? C.teal : C.red;
  const contentScale = responsive ? 1 : 1.7;
  const shiftX = responsive ? 0 : Math.sin(f * 0.08) * 40 - 90;
  return (
    <div style={{position: 'absolute', left: PX, top: PY, width: PW, height: PH, borderRadius: 54, background: '#0c0b12', border: '10px solid #1c1b24', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
      {/* Notch */}
      <div style={{position: 'absolute', left: PW / 2 - 60, top: 14, width: 120, height: 24, borderRadius: 12, background: '#1c1b24', zIndex: 5}} />
      {/* Inhalt */}
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 30 + shiftX, top: 70, width: (PW - 60) * contentScale, transformOrigin: 'top left'}}>
          <div style={{height: 40, borderRadius: 8, background: accent, marginBottom: 20, width: '70%'}} />
          <div style={{height: 16, borderRadius: 5, background: '#fff', opacity: 0.5, marginBottom: 12}} />
          <div style={{height: 16, borderRadius: 5, background: '#fff', opacity: 0.4, marginBottom: 12, width: '86%'}} />
          <div style={{height: 16, borderRadius: 5, background: '#fff', opacity: 0.35, marginBottom: 30, width: '72%'}} />
          <div style={{height: responsive ? 92 : 40, width: responsive ? '100%' : '48%', borderRadius: 16, background: C.violet, boxShadow: `0 0 26px ${C.violet}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: responsive ? 30 : 18}}>
            {responsive ? 'ANFRAGEN' : 'Anfragen'}
          </div>
        </div>
      </div>
      {/* „zu breit"-Indikator */}
      {!responsive && (
        <div style={{position: 'absolute', right: 16, top: PH / 2, color: C.red, fontSize: 40, fontWeight: 900, opacity: 0.7 + Math.sin(f * 0.2) * 0.3}}>⇥</div>
      )}
      {/* Tap-Ripple */}
      {tap > 0.02 && responsive && (
        <div style={{position: 'absolute', left: PW / 2 - 60, top: 560, width: 120, height: 120, borderRadius: '50%', border: `4px solid ${C.teal}`, transform: `scale(${tap * 2.4})`, opacity: 1 - tap}} />
      )}
    </div>
  );
};

// Riesen-Daumen von unten.
const Thumb = ({f, tapY = 0, miss = false}) => {
  const x = miss ? PX + PW - 120 + Math.sin(f * 0.12) * 60 : PX + PW / 2 - 90;
  return (
    <div style={{position: 'absolute', left: x, top: 1120 + tapY, width: 260, height: 520, transform: 'rotate(-14deg)', transformOrigin: 'bottom center'}}>
      <div style={{position: 'absolute', left: 40, top: 0, width: 180, height: 230, borderRadius: '90px 90px 60px 60px', background: 'linear-gradient(180deg,#e8b892,#c98f68)', boxShadow: '0 -10px 30px rgba(0,0,0,0.4) inset'}} />
      {/* Nagel */}
      <div style={{position: 'absolute', left: 84, top: 26, width: 92, height: 70, borderRadius: '46px 46px 30px 30px', background: 'linear-gradient(180deg,#f6dcc7,#e8b892)'}} />
      <div style={{position: 'absolute', left: 60, top: 200, width: 140, height: 320, borderRadius: '40px', background: 'linear-gradient(180deg,#d89f76,#b07a54)'}} />
    </div>
  );
};

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.teal}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 62px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 25, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 10}}>{kicker}</div>}
    <div style={{fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <Phone responsive={false} f={f} />
      <Thumb f={f} tapY={40} />
      <Caption top={80} main={<><span style={{color: C.gold}}>8 von 10</span> Kunden<br />kommen übers Handy.</>} o={a} ty={(1 - a) * 20} kcol={C.gold} />
    </AbsoluteFill>
  );
};

const FightScene = () => {
  const f = useCurrentFrame();
  const tap = ((f % 60) / 60);
  const tapY = Math.sin(tap * Math.PI) * -70;
  const lab = spring({frame: f - 16, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Phone responsive={false} f={f} />
      <Thumb f={f} tapY={tapY} miss />
      <Caption top={80} kicker="KEIN PLATZ FÜR DEN DAUMEN" main={<>Die meisten Seiten<br /><span style={{color: C.red}}>kämpfen dagegen.</span></>} o={lab} ty={(1 - lab) * 16} kcol={C.red} />
    </AbsoluteFill>
  );
};

const FlowScene = () => {
  const f = useCurrentFrame();
  const reflow = spring({frame: f - 6, fps: 30, config: {damping: 15}});
  const tapCycle = ((f % 70) / 70);
  const tapY = Math.sin(Math.min(1, tapCycle * 2) * Math.PI) * -60;
  const tap = tapCycle > 0.5 ? (tapCycle - 0.5) * 2 : 0;
  const lab = spring({frame: f - 20, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <div style={{opacity: reflow}}><Phone responsive f={f} tap={tap} /></div>
      <Thumb f={f} tapY={tapY} />
      <Caption top={80} kicker="ANSCHMIEGEN STATT ANKÄMPFEN" main={<>Deine <span style={{color: C.teal}}>fließt</span><br />in die Hand.</>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const LineScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <div style={{opacity: a, transform: `scale(${0.92 + a * 0.08})`}}>
        <div style={{fontSize: 66, fontWeight: 900, color: C.ink, lineHeight: 1.14}}>Gebaut <span style={{color: C.teal}}>für</span> den Daumen.<br />Nicht <span style={{color: C.red}}>dagegen</span>.</div>
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
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Mobil, das sich anfühlt <span style={{color: C.teal}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 860, lineHeight: 1.3}}>Tippst du das gerade mit dem Daumen? 👍 ↓</div>
    </AbsoluteFill>
  );
};

export const HandInHand = () => (
  <AbsoluteFill style={{background: '#08080d', fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={FIGHT}><FightScene /></Sequence>
    <Sequence from={HOOK + FIGHT} durationInFrames={FLOW}><FlowScene /></Sequence>
    <Sequence from={HOOK + FIGHT + FLOW} durationInFrames={LINE}><LineScene /></Sequence>
    <Sequence from={HOOK + FIGHT + FLOW + LINE} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.075} vignette={0.8} gradeProps={{a: 'rgba(52,227,208,0.10)', b: 'rgba(124,92,255,0.09)'}} />
  </AbsoluteFill>
);
