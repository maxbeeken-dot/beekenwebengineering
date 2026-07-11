import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Szenenlängen (30 fps) → Summe = 555 = 18,5 s
const HOOK = 60, HAPPY = 120, REVEAL = 120, CROSS = 105, DOORS = 90, CTA = 60;

const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const lerp = (t, a, b) => a + (b - a) * t;
// Personenstrom entlang Polyline start → Kreuzung → Ziel (Verzweigung bei p=0.5)
const streamPos = (p, s, k, d) => {
  if (p < 0.5) { const t = ease(p / 0.5); return {x: lerp(t, s.x, k.x), y: lerp(t, s.y, k.y)}; }
  const t = ease((p - 0.5) / 0.5); return {x: lerp(t, k.x, d.x), y: lerp(t, k.y, d.y)};
};

// ---- Bausteine ----
const OwnerFigure = ({tint = C.violet}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <div style={{width: 56, height: 56, borderRadius: '50%', background: C.ink}} />
    <div style={{width: 80, height: 104, borderRadius: '42px 42px 20px 20px', background: tint, marginTop: 8}} />
  </div>
);

const DoorGlyph = ({color = C.teal, glow = 0, label, w = 150, h = 220}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
    <div style={{width: w, height: h, borderRadius: '10px 10px 5px 5px', background: C.cardHi, border: `4px solid ${color}`, position: 'relative', boxShadow: `0 0 ${glow}px ${color}55`}}>
      <div style={{position: 'absolute', inset: '12% 16%', border: `2px solid ${color}44`, borderRadius: 5}} />
      <div style={{position: 'absolute', right: '18%', top: '48%', width: 12, height: 12, borderRadius: 12, background: color}} />
    </div>
    {label && <div style={{fontSize: 21, fontWeight: 800, color: C.muted, letterSpacing: 1.5}}>{label}</div>}
  </div>
);

const CDot = ({x, y, r = 26, color = C.violet, op = 1, glow = true}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r * 2, background: color, opacity: op, boxShadow: glow ? `0 0 14px ${color}66` : 'none'}} />
);

const Abs = ({x, y, extra, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translateX(-50%) ${extra || ''}`}}>{children}</div>
);

// ---- 1) HOOK ----
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 12, mass: 0.6}});
  const b = spring({frame: f - 16, fps: 30, config: {damping: 14}});
  const breath = Math.sin(f * 0.09) * 3;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '150px 60px 0', gap: 90}}>
      <div style={{fontSize: 70, fontWeight: 900, color: C.ink, textAlign: 'center', lineHeight: 1.12, opacity: a, transform: `scale(${0.9 + a * 0.1})`}}>
        „Ich hab schon<br /><span style={{color: C.teal}}>genug</span> Kunden.“
      </div>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 64, opacity: b, transform: `translateY(${(1 - b) * 40 + breath}px)`}}>
        <OwnerFigure />
        <DoorGlyph color={C.teal} glow={20} label="DEINE TÜR" />
      </div>
    </AbsoluteFill>
  );
};

// ---- 2) ZUFRIEDEN — Strom rein, ✅-Pops ----
const HappyScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 15}});
  const nod = Math.sin(f * 0.16) * 2;
  const N = 8, TRAVEL = 44, GAP = 11;
  const doorX = 800, doorTop = 640, laneY = 730;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', opacity: head, transform: `translateY(${(1 - head) * -20}px)`}}>
        <div style={{fontSize: 46, fontWeight: 900, color: C.ink}}>Du siehst, <span style={{color: C.teal}}>wer reinkommt</span>.</div>
      </div>
      <Abs x={620} y={doorTop + 8} extra={`rotate(${nod}deg)`}><OwnerFigure /></Abs>
      <Abs x={doorX} y={doorTop}><DoorGlyph color={C.teal} glow={22} /></Abs>
      {Array.from({length: N}, (_, i) => {
        const local = f - i * GAP;
        const p = interpolate(local, [0, TRAVEL], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const x = lerp(ease(p), 40, doorX - 46);
        const y = laneY + Math.sin(i * 1.4) * 44 + Math.sin(local * 0.2) * 4;
        const op = local < 0 || p >= 1 ? 0 : 1;
        return <CDot key={i} x={x} y={y} color={C.violet} op={op} />;
      })}
      {Array.from({length: N}, (_, i) => {
        const at = i * GAP + TRAVEL;
        const d = f - at;
        if (d < 0 || d > 26) return null;
        const s = spring({frame: d, fps: 30, config: {damping: 9, mass: 0.4}});
        const op = interpolate(d, [0, 6, 26], [0, 1, 0]);
        const ty = interpolate(d, [0, 26], [0, -70]);
        return <div key={`c${i}`} style={{position: 'absolute', left: doorX + (i % 3 - 1) * 30, top: doorTop - 20 + ty, transform: `translateX(-50%) scale(${0.4 + s * 0.6})`, fontSize: 40, opacity: op}}>✅</div>;
      })}
    </AbsoluteFill>
  );
};

// ---- 3) ZOOM-OUT REVEAL — Kreuzung + großer, abbiegender Strom ----
const RevealScene = () => {
  const f = useCurrentFrame();
  const gp = interpolate(f, [0, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const gScale = 1 - ease(gp) * 0.62;
  const gLeft = lerp(ease(gp), 540, 895);
  const gTop = lerp(ease(gp), 470, 235);
  const reveal = spring({frame: f - 30, fps: 30, config: {damping: 15}});
  const txt = spring({frame: f - 52, fps: 30, config: {damping: 14}});
  const cross = {x: 520, y: 760};
  const compDest = {x: 930, y: 1000};
  const ownDest = {x: 895, y: 300};
  const BIG = 14;
  const phoneOp = interpolate(f, [50, 60, 96, 110], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const phoneBob = Math.sin(f * 0.3) * 5;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', opacity: txt, transform: `translateY(${(1 - txt) * -20}px)`}}>
        <div style={{fontSize: 50, fontWeight: 900, color: C.ink, lineHeight: 1.14}}>Aber nicht, wer<br /><span style={{color: C.red}}>vorher abbiegt</span>.</div>
      </div>
      <Abs x={compDest.x} y={compDest.y - 20} extra={`scale(${0.6 + reveal * 0.4})`}>
        <DoorGlyph color={C.red} glow={reveal * 26} label="KONKURRENZ" w={130} h={180} />
      </Abs>
      <div style={{position: 'absolute', left: cross.x, top: cross.y, transform: `translate(-50%,-50%) scale(${reveal})`, opacity: reveal}}>
        <div style={{width: 132, height: 132, borderRadius: '50%', border: `3px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 20, height: 20, borderRadius: 20, background: C.dim}} />
        </div>
      </div>
      {Array.from({length: BIG}, (_, i) => {
        const local = f - (24 + i * 6);
        const p = interpolate(local, [0, 66], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const own = i % 5 === 0;
        const start = {x: -70, y: 760 + Math.sin(i * 1.7) * 46};
        const pos = streamPos(p, start, cross, own ? ownDest : compDest);
        const wob = p < 0.5 ? Math.sin(local * 0.28 + i) * 5 : 0;
        const op = local < 0 || p >= 1 ? 0 : 1;
        const color = own ? C.teal : (p > 0.52 ? C.red : C.violet);
        return <CDot key={i} x={pos.x} y={pos.y + wob} r={22} color={color} op={op} />;
      })}
      <div style={{position: 'absolute', left: cross.x, top: cross.y - 96 + phoneBob, transform: 'translateX(-50%)', fontSize: 56, opacity: phoneOp}}>📱</div>
      <div style={{position: 'absolute', left: gLeft, top: gTop, transform: `translateX(-50%) scale(${gScale})`, transformOrigin: 'top center'}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 50}}>
          <OwnerFigure />
          <DoorGlyph color={C.teal} glow={14} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- 4) AN DER KREUZUNG — Entscheidung übers Handy ----
const CrossScene = () => {
  const f = useCurrentFrame();
  const z = spring({frame: f, fps: 30, config: {damping: 14}});
  const zoom = 0.86 + z * 0.14;
  const head = spring({frame: f, fps: 30, config: {damping: 15}});
  const phoneX = 540, phoneTop = 420, phoneW = 300, phoneH = 540;
  const swapped = f >= 52;
  const swap = spring({frame: f - 52, fps: 30, config: {damping: 13}});
  const aIn = spring({frame: f, fps: 30, config: {damping: 14}});
  const aLeave = interpolate(f, [34, 54], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ax = lerp(aIn, -40, 250) - aLeave * 300;
  const aOp = (aIn <= 0 ? 0 : 1) * (1 - aLeave);
  const aColor = aLeave > 0.15 ? C.red : C.violet;
  const bIn = spring({frame: f - 52, fps: 30, config: {damping: 14}});
  const bGo = interpolate(f, [80, 102], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bx = lerp(bIn, -40, 250) + bGo * 560;
  const bOp = (bIn <= 0 ? 0 : 1) * (bGo >= 1 ? 0 : 1);
  const laneY = 720;
  const checkD = f - 100;
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '540px 640px'}}>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', opacity: head}}>
        <div style={{fontSize: 48, fontWeight: 900, color: C.ink, lineHeight: 1.15}}>Hier entscheidet deine <span style={{color: C.teal}}>Website</span>.<br /><span style={{color: C.muted, fontSize: 38}}>Nicht du.</span></div>
      </div>
      <Abs x={860} y={laneY - 130}><DoorGlyph color={C.teal} glow={18} w={120} h={180} /></Abs>
      <div style={{position: 'absolute', left: phoneX, top: phoneTop, transform: 'translateX(-50%)', width: phoneW, height: phoneH, borderRadius: 40, background: C.card, border: `4px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
        {!swapped ? (
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 150, fontWeight: 900, color: C.red, lineHeight: 1}}>—</div>
            <div style={{fontSize: 26, color: C.muted, fontWeight: 700, marginTop: 10}}>nichts gefunden</div>
          </div>
        ) : (
          <div style={{width: '78%', transform: `scale(${0.7 + swap * 0.3})`, opacity: swap}}>
            <div style={{height: 40, borderRadius: 8, background: C.teal, marginBottom: 16}} />
            <div style={{height: 14, borderRadius: 7, background: C.border, marginBottom: 10}} />
            <div style={{height: 14, borderRadius: 7, background: C.border, marginBottom: 10, width: '80%'}} />
            <div style={{height: 14, borderRadius: 7, background: C.border, width: '60%'}} />
            <div style={{marginTop: 22, fontSize: 34, textAlign: 'center'}}>✅</div>
          </div>
        )}
      </div>
      <CDot x={ax} y={laneY} r={26} color={aColor} op={aOp} />
      <CDot x={bx} y={laneY} r={26} color={C.teal} op={bOp} />
      {checkD >= 0 && checkD < 24 && (
        <div style={{position: 'absolute', left: 860, top: laneY - 180, transform: `translateX(-50%) scale(${0.5 + ease(checkD / 12) * 0.6})`, fontSize: 44, opacity: interpolate(checkD, [0, 6, 24], [0, 1, 0])}}>✅</div>
      )}
    </AbsoluteFill>
  );
};

// ---- 5) BEIDE TÜREN — Trickle vs. Flut ----
const DoorsScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 15}});
  const lDoor = spring({frame: f - 6, fps: 30, config: {damping: 14}});
  const rDoor = spring({frame: f - 12, fps: 30, config: {damping: 14}});
  const leftX = 300, rightX = 790, doorTop = 560, opening = 720;
  const FEW = 3, FLOOD = 12;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', opacity: head, padding: '0 60px'}}>
        <div style={{fontSize: 44, fontWeight: 900, color: C.ink, lineHeight: 1.2}}>‚Genug‘ heißt nur:<br /><span style={{color: C.red}}>du zählst die, die dich schon finden</span>.</div>
      </div>
      <Abs x={leftX} y={doorTop} extra={`scale(${0.7 + lDoor * 0.3})`}><DoorGlyph color={C.teal} glow={20} label="FINDEN DICH" w={140} h={200} /></Abs>
      <Abs x={rightX} y={doorTop} extra={`scale(${0.7 + rDoor * 0.3})`}><DoorGlyph color={C.red} glow={24} label="BIEGEN AB" w={140} h={200} /></Abs>
      {Array.from({length: FEW}, (_, i) => {
        const local = f - (20 + i * 22);
        const p = interpolate(local, [0, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const x = lerp(ease(p), 40, leftX);
        const y = opening + Math.sin(i * 1.5) * 30;
        const op = local < 0 || p >= 1 ? 0 : 1;
        return <CDot key={`l${i}`} x={x} y={y} r={22} color={C.teal} op={op} />;
      })}
      {Array.from({length: FLOOD}, (_, i) => {
        const local = f - (10 + i * 4);
        const p = interpolate(local, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const sx = 380 + (i % 4) * 20;
        const sy = 300 + Math.sin(i * 2.1) * 40;
        const x = lerp(ease(p), sx, rightX);
        const y = lerp(ease(p), sy, opening);
        const op = local < 0 || p >= 1 ? 0 : 1;
        const color = p > 0.5 ? C.red : C.violet;
        return <CDot key={`r${i}`} x={x} y={y} r={20} color={color} op={op} />;
      })}
    </AbsoluteFill>
  );
};

// ---- 6) CTA ----
const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  const bait = spring({frame: f - 38, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 20}}>
      <div style={{opacity: pop, transform: `scale(${0.9 + pop * 0.1})`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.1, marginTop: 12}}>
          Werde <span style={{color: C.teal}}>an der Kreuzung</span><br />gefunden.
        </div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px) scale(${pulse})`, marginTop: 14, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>
        beekenwebengineering.com
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 20, fontSize: 27, color: C.gold, fontWeight: 800, maxWidth: 820, lineHeight: 1.3}}>
        Wann hast du zuletzt jemanden gegoogelt, <span style={{color: C.ink}}>BEVOR</span> du hingegangen bist? 👇
      </div>
    </AbsoluteFill>
  );
};

export const WerAbbiegt = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(760px 760px at 540px 520px, rgba(124,92,255,0.10), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={HAPPY}><HappyScene /></Sequence>
      <Sequence from={HOOK + HAPPY} durationInFrames={REVEAL}><RevealScene /></Sequence>
      <Sequence from={HOOK + HAPPY + REVEAL} durationInFrames={CROSS}><CrossScene /></Sequence>
      <Sequence from={HOOK + HAPPY + REVEAL + CROSS} durationInFrames={DOORS}><DoorsScene /></Sequence>
      <Sequence from={HOOK + HAPPY + REVEAL + CROSS + DOORS} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
