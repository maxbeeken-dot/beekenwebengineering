import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, rng} from './Cine.jsx';

// Cinematic: echtes Dipol-Magnetfeld ordnet Eisenspäne. Eine starke Website ist
// der Magnet – zieht Kunden UND Fachkräfte an. Kernbotschaft: dual (Kunden+Talente).
// 30fps → 75 + 210 + 195 + 75 + 75 = 630 = 21,0 s
const HOOK = 75, SNAP = 210, STREAMS = 195, OFF = 75, CTA = 75;

const CX = 540, CY = 880;

// Dipol-Feldrichtung (Superposition zweier Monopole).
const fieldAngle = (x, y) => {
  const nx = CX - 150, ny = CY, sx = CX + 150, sy = CY;
  const dnx = x - nx, dny = y - ny, dn = Math.hypot(dnx, dny) + 6;
  const dsx = x - sx, dsy = y - sy, ds = Math.hypot(dsx, dsy) + 6;
  const ex = dnx / (dn * dn * dn) - dsx / (ds * ds * ds);
  const ey = dny / (dn * dn * dn) - dsy / (ds * ds * ds);
  return Math.atan2(ey, ex);
};

// Eisenspäne-Feld: Gitter kurzer Segmente, ausgerichtet am Feld. align ∈ [0,1].
const Filings = ({align}) => {
  const segs = [];
  let k = 0;
  for (let y = 540; y <= 1280; y += 58) {
    for (let x = 40; x <= 1040; x += 58) {
      const dist = Math.hypot(x - CX, y - CY);
      if (dist < 120) continue; // Magnetkörper aussparen
      const ang = fieldAngle(x, y);
      const scatter = rng(k) * Math.PI;
      const a = ang * align + scatter * (1 - align);
      const op = Math.max(0.05, Math.min(1, 1 - dist / 640)) * (0.25 + align * 0.75);
      segs.push(
        <div key={k} style={{position: 'absolute', left: x, top: y, width: 26, height: 4, marginLeft: -13, marginTop: -2, borderRadius: 2, background: C.muted, opacity: op, transform: `rotate(${a}rad)`}} />
      );
      k++;
    }
  }
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{segs}</AbsoluteFill>;
};

// Stabmagnet (N rot / S teal), glüht wenn on.
const Magnet = ({on = true, weak = false}) => {
  const glow = weak ? 0.2 : (on ? 1 : 0);
  return (
    <div style={{position: 'absolute', left: CX - 170, top: CY - 54, width: 340, height: 108}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 170, height: 108, background: 'linear-gradient(180deg,#ff6b7d,#c0293c)', borderRadius: '14px 0 0 14px', boxShadow: `0 0 ${40 * glow}px ${8 * glow}px ${C.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 48, fontWeight: 900}}>N</div>
      <div style={{position: 'absolute', left: 170, top: 0, width: 170, height: 108, background: 'linear-gradient(180deg,#5ef0e0,#159c8f)', borderRadius: '0 14px 14px 0', boxShadow: `0 0 ${40 * glow}px ${8 * glow}px ${C.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04201d', fontSize: 48, fontWeight: 900}}>S</div>
    </div>
  );
};

// Zentrums-Knoten = die Website.
const SiteNode = ({o = 1}) => (
  <div style={{position: 'absolute', left: CX - 60, top: CY - 60, width: 120, height: 120, borderRadius: 22, background: '#151320', border: `3px solid ${C.violet}`, boxShadow: `0 0 60px ${C.violet}`, opacity: o, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52}}>🌐</div>
);

const Stream = ({f, side, color, count = 10}) => {
  const parts = [];
  const startX = side === 'left' ? -60 : 1140;
  for (let i = 0; i < count; i++) {
    const phase = (f * 0.012 + i / count) % 1;
    const sy = 300 + rng(i * 3 + (side === 'left' ? 1 : 9)) * 1180;
    const x = startX + (CX - startX) * phase;
    const arc = Math.sin(phase * Math.PI) * (side === 'left' ? -120 : 120);
    const y = sy + (CY - sy) * phase + arc;
    const op = Math.sin(phase * Math.PI);
    const r = 9 - phase * 4;
    parts.push(<div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: '50%', background: color, boxShadow: `0 0 14px 3px ${color}`, opacity: op}} />);
  }
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{parts}</AbsoluteFill>;
};

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.teal}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 66px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 12}}>{kicker}</div>}
    <div style={{fontSize: 54, fontWeight: 900, color: C.ink, lineHeight: 1.15, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <Filings align={0} />
      <Caption top={360} main={<>Warum ziehen manche Firmen<br /><span style={{color: C.teal}}>einfach alle an?</span></>} o={a} ty={(1 - a) * 22} />
    </AbsoluteFill>
  );
};

const SnapScene = () => {
  const f = useCurrentFrame();
  const align = spring({frame: f - 8, fps: 30, config: {damping: 16, mass: 1.1}});
  const mag = spring({frame: f, fps: 30, config: {damping: 12}});
  const lab = spring({frame: f - 40, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Filings align={align} />
      <div style={{transform: `scale(${0.7 + mag * 0.3})`, transformOrigin: `${CX}px ${CY}px`}}><Magnet on /></div>
      <Caption top={280} kicker="ZEIGEN STATT ERZÄHLEN" main={<>Eine starke Website<br />ist ein <span style={{color: C.teal}}>Magnet</span>.</>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const StreamsScene = () => {
  const f = useCurrentFrame();
  const lab = spring({frame: f - 10, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Filings align={1} />
      <Stream f={f} side="left" color={C.gold} />
      <Stream f={f} side="right" color={C.teal} />
      <SiteNode />
      <div style={{position: 'absolute', left: 70, top: 500, fontSize: 30, fontWeight: 900, color: C.gold, opacity: lab}}>Kunden →</div>
      <div style={{position: 'absolute', right: 70, top: 1280, fontSize: 30, fontWeight: 900, color: C.teal, opacity: lab, textAlign: 'right'}}>← Fachkräfte</div>
      <Caption top={250} kicker="ZWEI, DIE DU BRAUCHST" main={<>Zieht <span style={{color: C.gold}}>Kunden</span> an.<br />Und <span style={{color: C.teal}}>Fachkräfte</span>.</>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const OffScene = () => {
  const f = useCurrentFrame();
  const align = interpolate(f, [0, 45], [1, 0.06], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const a = spring({frame: f - 6, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(70% 50% at 50% 46%, ${C.red}12, transparent 70%)`}} />
      <Filings align={align} />
      <Magnet on={false} weak />
      <Caption top={300} kicker="OHNE MAGNET" main={<>Unsichtbar?<br /><span style={{color: C.red}}>Beide ziehen weiter.</span></>} o={a} ty={(1 - a) * 16} kcol={C.red} />
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
      <Stream f={f} side="left" color={C.gold} count={6} />
      <Stream f={f} side="right" color={C.teal} count={6} />
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Werde zum Magnet <span style={{color: C.teal}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 860, lineHeight: 1.3}}>Kunden oder Fachkräfte — was fehlt dir gerade? ↓</div>
    </AbsoluteFill>
  );
};

export const Magnetfeld = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={SNAP}><SnapScene /></Sequence>
    <Sequence from={HOOK + SNAP} durationInFrames={STREAMS}><StreamsScene /></Sequence>
    <Sequence from={HOOK + SNAP + STREAMS} durationInFrames={OFF}><OffScene /></Sequence>
    <Sequence from={HOOK + SNAP + STREAMS + OFF} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.075} vignette={0.8} gradeProps={{a: 'rgba(245,185,69,0.09)', b: 'rgba(52,227,208,0.11)'}} />
  </AbsoluteFill>
);
