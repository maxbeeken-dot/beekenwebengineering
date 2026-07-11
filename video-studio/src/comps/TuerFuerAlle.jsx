import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Szenenlängen (30 fps) → 555 = 18,5 s
const HOOK = 60, BOUNCE = 150, RAMP = 90, ENTER = 120, LAW = 75, CTA = 60;

// Bühnen-Geometrie (Kopf-über-Ansicht des Shops im oberen ~60 %)
const SL = 260, ST = 300, SW = 560, SH = 300; // Shop-Box
const DOOR_H = 150;
const THRESH_X = 540, THRESH_Y = ST + SH; // 600 = Tür-/Boden-Schwelle
const BARRIER_Y = 700;

const PERSONAS = [
  {emoji: '☀️', label: 'Handy in der Sonne', x0: 330, dir: -1, at: 6},
  {emoji: '🛒', label: 'Nur eine Hand frei', x0: 470, dir: -1, at: 20},
  {emoji: '👓', label: 'Brille vergessen', x0: 620, dir: 1, at: 34},
  {emoji: '👵', label: 'Oma', x0: 760, dir: 1, at: 48},
];
const CROWD = Array.from({length: 10}, (_, i) => ({x: 200 + i * 72, y: 850 + (i % 2) * 54}));
const FEATURES = ['Große Schrift', 'Kontrast', 'Tastatur', 'Vorlesen'];
const SALES = ['🛒', '✅', '✅', '✅'];
const ENTERERS = Array.from({length: 9}, (_, i) => ({sx: 200 + i * 90, sy: 950 + (i % 2) * 42, at: i * 10}));

// ---------- geteilte Bausteine ----------
const Shop = ({doorW = 110, glow = 0, appear = 1}) => (
  <div style={{position: 'absolute', left: SL, top: ST, width: SW, height: SH, opacity: appear, transform: `translateY(${(1 - appear) * 34}px)`}}>
    <div style={{position: 'absolute', top: -64, width: SW, textAlign: 'center', fontSize: 38, fontWeight: 900, letterSpacing: 3, color: C.ink}}>DEIN SHOP</div>
    <div style={{position: 'absolute', inset: 0, background: C.card, border: `3px solid ${glow > 0 ? C.teal : C.border}`, borderRadius: '18px 18px 0 0', boxShadow: glow > 0 ? `0 0 ${glow}px ${C.teal}44` : 'none'}} />
    <div style={{position: 'absolute', top: 44, left: 56, width: 120, height: 92, background: C.cardHi, border: `2px solid ${C.border}`, borderRadius: 8}} />
    <div style={{position: 'absolute', top: 44, right: 56, width: 120, height: 92, background: C.cardHi, border: `2px solid ${C.border}`, borderRadius: 8}} />
    <div style={{
      position: 'absolute', bottom: 0, left: SW / 2 - doorW / 2, width: doorW, height: DOOR_H,
      background: C.bg, border: `3px solid ${glow > 0 ? C.teal : C.border}`, borderBottom: 'none', borderRadius: '12px 12px 0 0',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 14,
      boxShadow: glow > 0 ? `inset 0 0 26px ${C.teal}33` : 'none',
    }}>
      <div style={{fontSize: 20, fontWeight: 800, letterSpacing: 1, color: glow > 0 ? C.teal : C.muted}}>KAUFEN</div>
    </div>
  </div>
);

const Ground = ({appear = 1}) => (
  <div style={{position: 'absolute', left: 120, top: THRESH_Y - 3, width: 840, height: 6, background: C.border, opacity: appear, borderRadius: 3}} />
);

const BarrierBar = ({drop = 0, op = 1, ty = 0}) => (
  <div style={{
    position: 'absolute', left: 230, top: BARRIER_Y - 13 + drop * 150, width: 620, height: 26,
    opacity: op * (1 - drop), transform: `translateY(${ty}px)`, borderRadius: 6,
    backgroundImage: `repeating-linear-gradient(45deg, ${C.red} 0 16px, #b23a46 16px 32px)`, boxShadow: `0 0 24px ${C.red}44`,
  }} />
);

const BarrierTag = ({op = 1}) => (
  <div style={{position: 'absolute', left: 0, top: BARRIER_Y + 26, width: '100%', textAlign: 'center', opacity: op}}>
    <span style={{fontSize: 22, fontWeight: 900, letterSpacing: 4, color: C.red, background: 'rgba(255,84,104,0.12)', border: `2px solid ${C.red}55`, borderRadius: 10, padding: '4px 14px'}}>BARRIERE</span>
  </div>
);

// ---------- Szene 1: HOOK ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const shop = spring({frame: f - 4, fps: 30, config: {damping: 15}});
  const bar = spring({frame: f - 16, fps: 30, config: {damping: 14}});
  const head = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const eye = spring({frame: f - 20, fps: 30, config: {damping: 11}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 92, width: '100%', textAlign: 'center', padding: '0 70px', opacity: head, transform: `translateY(${(1 - head) * -24}px)`}}>
        <div style={{fontSize: 58, fontWeight: 900, color: C.ink, lineHeight: 1.14}}>
          Barrierefrei? <span style={{color: C.teal}}>Nicht nur</span><br />für Rollstühle. <span style={{opacity: eye}}>👀</span>
        </div>
      </div>
      <Shop appear={shop} />
      <Ground appear={shop} />
      <BarrierBar op={bar} ty={(1 - bar) * -28} />
      <BarrierTag op={bar} />
      {CROWD.map((d, i) => {
        const e = spring({frame: f - 10 - i * 2, fps: 30, config: {damping: 13, mass: 0.5}});
        return <div key={i} style={{position: 'absolute', left: d.x - 22, top: d.y - 22, width: 44, height: 44, borderRadius: 44, background: C.violet, opacity: e, transform: `translateY(${(1 - e) * 260}px)`, boxShadow: `0 0 12px ${C.violet}55`}} />;
      })}
    </AbsoluteFill>
  );
};

// ---------- Szene 2: ABPRALLEN ----------
const PersonaDot = ({f, at, x0, dir, emoji, label}) => {
  const up = interpolate(f, [at, at + 10, at + 15], [0, -82, -52], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dp = interpolate(f, [at + 15, at + 64], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ease = 1 - Math.pow(1 - dp, 3);
  const cx = x0 + dir * ease * 210;
  const cy = 800 + up + ease * 150;
  const grey = dp > 0.12;
  const dotOp = interpolate(dp, [0, 0.85, 1], [1, 1, 0.35]);
  const lab = interpolate(f, [at + 18, at + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <div style={{
        position: 'absolute', left: cx - 24, top: cy - 24, width: 48, height: 48, borderRadius: 48,
        background: grey ? C.dim : C.violet, opacity: dotOp, boxShadow: grey ? 'none' : `0 0 12px ${C.violet}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, filter: grey ? 'grayscale(1)' : 'none',
      }}>{emoji}</div>
      <div style={{position: 'absolute', left: cx - 90, top: cy + 30, width: 180, textAlign: 'center', opacity: lab * dotOp, fontSize: 20, fontWeight: 800, color: C.muted}}>{label}</div>
    </>
  );
};

const BounceScene = () => {
  const f = useCurrentFrame();
  const txt = spring({frame: f - 88, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill>
      <Shop appear={1} />
      <Ground appear={1} />
      <BarrierBar op={1} />
      <BarrierTag op={1} />
      {PERSONAS.map((p, i) => <PersonaDot key={i} f={f} {...p} />)}
      <div style={{position: 'absolute', top: 1040, width: '100%', textAlign: 'center', padding: '0 60px', opacity: txt, transform: `translateY(${(1 - txt) * 24}px)`}}>
        <div style={{fontSize: 50, fontWeight: 900, color: C.ink, lineHeight: 1.16}}>Alle wollen kaufen.<br /><span style={{color: C.red}}>Keiner</span> kommt rein.</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Szene 3: RAMPE ----------
const Ramp = ({p = 1}) => (
  <div style={{
    position: 'absolute', left: 340, top: THRESH_Y, width: 400, height: 290, opacity: p,
    transform: `scaleY(${p})`, transformOrigin: '50% 100%',
    clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)',
    background: `linear-gradient(180deg, ${C.teal}cc, ${C.teal}44)`, boxShadow: `0 0 44px ${C.teal}55`,
  }} />
);

const RampScene = () => {
  const f = useCurrentFrame();
  const drop = spring({frame: f, fps: 30, config: {damping: 15}});
  const doorW = interpolate(f, [8, 44], [110, 250], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const glow = interpolate(f, [8, 40], [0, 32], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ramp = spring({frame: f - 18, fps: 30, config: {damping: 16, mass: 0.9}});
  const head = spring({frame: f - 6, fps: 30, config: {damping: 13}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 96, width: '100%', textAlign: 'center', opacity: head, transform: `scale(${0.9 + head * 0.1})`}}>
        <div style={{fontSize: 56, fontWeight: 900, color: C.teal, letterSpacing: 2, textShadow: `0 0 30px ${C.teal}66`}}>BARRIEREFREI ✅</div>
      </div>
      <div style={{position: 'absolute', top: 196, width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, padding: '0 90px'}}>
        {FEATURES.map((t, i) => {
          const s = spring({frame: f - 28 - i * 6, fps: 30, config: {damping: 12, mass: 0.5}});
          return <span key={i} style={{opacity: s, transform: `scale(${0.6 + s * 0.4})`, fontSize: 24, fontWeight: 800, color: C.ink, background: C.card, border: `2px solid ${C.teal}55`, borderRadius: 999, padding: '8px 18px', boxShadow: `0 0 18px ${C.teal}22`}}>{t}</span>;
        })}
      </div>
      <Shop appear={1} doorW={doorW} glow={glow} />
      <Ground appear={1} />
      <Ramp p={ramp} />
      <BarrierBar drop={drop} op={1} />
    </AbsoluteFill>
  );
};

// ---------- Szene 4: ALLE REIN ----------
const EnterDot = ({f, sx, sy, at}) => {
  const p = interpolate(f, [at, at + 42], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const e = 1 - Math.pow(1 - p, 2);
  const cx = sx + (THRESH_X - sx) * e;
  const cy = sy + ((THRESH_Y + 8) - sy) * e;
  const green = p > 0.4;
  const op = interpolate(p, [0, 0.05, 0.85, 1], [0, 1, 1, 0]);
  const sc = interpolate(p, [0, 0.7, 1], [1, 1, 0.3]);
  return <div style={{position: 'absolute', left: cx - 22, top: cy - 22, width: 44, height: 44, borderRadius: 44, background: green ? C.green : C.dim, opacity: op, transform: `scale(${sc})`, boxShadow: green ? `0 0 14px ${C.green}66` : 'none'}} />;
};

const EnterScene = () => {
  const f = useCurrentFrame();
  const txt = spring({frame: f - 74, fps: 30, config: {damping: 15}});
  const kaufe = Math.round(interpolate(f, [14, 104], [0, 9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 96, width: '100%', textAlign: 'center'}}>
        <span style={{fontSize: 30, fontWeight: 900, color: C.green, fontVariantNumeric: 'tabular-nums', background: 'rgba(61,220,132,0.12)', border: `2px solid ${C.green}55`, borderRadius: 12, padding: '6px 18px'}}>Käufe: {kaufe}</span>
      </div>
      <Shop appear={1} doorW={250} glow={30} />
      <Ground appear={1} />
      <Ramp p={1} />
      {ENTERERS.map((d, i) => <EnterDot key={i} f={f} {...d} />)}
      {SALES.map((s, i) => {
        const sp = spring({frame: f - 40 - i * 15, fps: 30, config: {damping: 11, mass: 0.5}});
        return <div key={i} style={{position: 'absolute', left: 900, top: 300 + i * 72, fontSize: 46, opacity: sp, transform: `scale(${0.4 + sp * 0.6})`}}>{s}</div>;
      })}
      <div style={{position: 'absolute', top: 1030, width: '100%', textAlign: 'center', padding: '0 60px', opacity: txt, transform: `translateY(${(1 - txt) * 24}px)`}}>
        <div style={{fontSize: 48, fontWeight: 900, color: C.ink}}>Eine Seite für <span style={{color: C.teal}}>ALLE</span> = mehr Käufe.</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Szene 5: NUTZEN + GESETZ ----------
const LawScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.6}});
  const b = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 38, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 80px', gap: 26}}>
      <div style={{opacity: a, transform: `translateY(${(1 - a) * -20}px)`, fontSize: 30, fontWeight: 800, letterSpacing: 5, color: C.teal}}>DER ECHTE GEWINN</div>
      <div style={{opacity: b, transform: `scale(${0.92 + b * 0.08})`, fontSize: 66, fontWeight: 900, color: C.ink, lineHeight: 1.1}}>Mehr Kunden.<br /><span style={{color: C.green}}>Für alle offen.</span></div>
      <div style={{opacity: c, transform: `translateY(${(1 - c) * 22}px)`, fontSize: 32, fontWeight: 700, color: C.muted, maxWidth: 820, lineHeight: 1.32}}>
        Ab 2025 sogar <span style={{color: C.ink}}>gesetzlich Pflicht</span> (BFSG) <span style={{color: C.gold}}>✅</span> — der Nutzen zählt aber mehr.
      </div>
    </AbsoluteFill>
  );
};

// ---------- Szene 6: CTA ----------
const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  const bait = spring({frame: f - 38, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 60px', gap: 18}}>
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -18}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 56, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Barrierefrei gebaut.<br /><span style={{color: C.teal}}>Für alle offen.</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`, marginTop: 8}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 20, fontSize: 27, fontWeight: 800, color: C.gold, maxWidth: 900, lineHeight: 1.32}}>
        Wo hakt eine Website bei DIR am meisten — Sonne, eine Hand oder Mini-Schrift? ☀️🛒👇
      </div>
    </AbsoluteFill>
  );
};

export const TuerFuerAlle = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(820px 820px at 540px 620px, rgba(124,92,255,0.10), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={BOUNCE}><BounceScene /></Sequence>
      <Sequence from={HOOK + BOUNCE} durationInFrames={RAMP}><RampScene /></Sequence>
      <Sequence from={HOOK + BOUNCE + RAMP} durationInFrames={ENTER}><EnterScene /></Sequence>
      <Sequence from={HOOK + BOUNCE + RAMP + ENTER} durationInFrames={LAW}><LawScene /></Sequence>
      <Sequence from={HOOK + BOUNCE + RAMP + ENTER + LAW} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
