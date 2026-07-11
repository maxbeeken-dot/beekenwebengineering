import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Szenenlängen (30 fps) → 570 = 19,0 s
const HOOK = 60, SWEEP = 90, VIS = 120, ROUTE = 120, POINTE = 90, CTA = 90;

// Kartenrahmen (oberes Bilddrittel) + Punkt-Koordinaten (Bruchteile der Karte)
const MW = 960, MH = 820, MLEFT = 60, MTOP = 170;
const SELF = {x: 0.50, y: 0.53};
const SHOP_A = {x: 0.69, y: 0.30};
const SHOP_B = {x: 0.25, y: 0.44};
const SHOP_C = {x: 0.62, y: 0.74};

// Route (Manhattan-Wegpunkte, in Karten-Pixeln) für die „Kunde geht dahin"-Szene
const RP = [SELF, {x: 0.50, y: 0.40}, {x: 0.69, y: 0.40}, SHOP_A].map((p) => ({x: p.x * MW, y: p.y * MH}));
const SEG = [];
let TOTAL = 0;
for (let i = 1; i < RP.length; i++) {
  const l = Math.hypot(RP[i].x - RP[i - 1].x, RP[i].y - RP[i - 1].y);
  SEG.push(l); TOTAL += l;
}
const PATH_D = 'M ' + RP.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ');
const pointAt = (t) => {
  let d = t * TOTAL;
  for (let i = 0; i < SEG.length; i++) {
    if (d <= SEG[i] || i === SEG.length - 1) {
      const r = SEG[i] === 0 ? 0 : d / SEG[i];
      return {x: RP[i].x + (RP[i + 1].x - RP[i].x) * r, y: RP[i].y + (RP[i + 1].y - RP[i].y) * r};
    }
    d -= SEG[i];
  }
  return RP[RP.length - 1];
};

const H_LINES = [0.16, 0.34, 0.5, 0.66, 0.82];
const V_LINES = [0.18, 0.36, 0.54, 0.72, 0.88];

const Marker = ({x, y, anchor = 'tip', z = 3, children, style}) => (
  <div style={{
    position: 'absolute', left: `${x * 100}%`, top: `${y * 100}%`,
    transform: anchor === 'tip' ? 'translate(-50%,-100%)' : 'translate(-50%,-50%)',
    zIndex: z, ...style,
  }}>{children}</div>
);

const TearPin = ({color, glow = 0, size = 52}) => (
  <div style={{width: size, height: size, position: 'relative'}}>
    <div style={{
      position: 'absolute', inset: 0, background: color, borderRadius: '50% 50% 50% 0',
      transform: 'rotate(-45deg)', boxShadow: glow ? `0 0 ${glow}px ${color}` : '0 6px 14px rgba(0,0,0,0.45)',
    }} />
    <div style={{position: 'absolute', left: '50%', top: '39%', width: size * 0.4, height: size * 0.4, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: C.bg}} />
  </div>
);

const GpsDot = ({f}) => {
  const p = (f % 55) / 55;
  return (
    <div style={{position: 'relative', width: 0, height: 0}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 34, height: 34, transform: `translate(-50%,-50%) scale(${1 + p * 2.4})`, borderRadius: '50%', border: `2px solid ${C.violet}`, opacity: (1 - p) * 0.55}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 26, height: 26, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: C.violet, boxShadow: `0 0 18px ${C.violet}, 0 0 0 4px rgba(124,92,255,0.22)`}} />
    </div>
  );
};

const StreetGrid = () => (
  <>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#0d0c14,#09080f)'}} />
    <div style={{position: 'absolute', left: '5%', top: '57%', width: '27%', height: '30%', background: 'rgba(61,220,132,0.06)', borderRadius: 18}} />
    <div style={{position: 'absolute', right: '-4%', top: '7%', width: '22%', height: '40%', background: 'rgba(52,227,208,0.05)', borderRadius: '40% 0 30% 40%'}} />
    {H_LINES.map((t, i) => <div key={'h' + i} style={{position: 'absolute', left: 0, right: 0, top: `${t * 100}%`, height: i % 2 ? 8 : 4, background: 'rgba(255,255,255,0.045)'}} />)}
    {V_LINES.map((t, i) => <div key={'v' + i} style={{position: 'absolute', top: 0, bottom: 0, left: `${t * 100}%`, width: i % 2 ? 8 : 4, background: 'rgba(255,255,255,0.045)'}} />)}
    <div style={{position: 'absolute', left: '-10%', top: '20%', width: '130%', height: 6, background: 'rgba(255,255,255,0.05)', transform: 'rotate(18deg)', transformOrigin: 'left center'}} />
  </>
);

const MapStage = ({children, scale = 1, origin = '50% 50%', style}) => (
  <div style={{
    position: 'absolute', left: MLEFT, top: MTOP, width: MW, height: MH,
    borderRadius: 28, overflow: 'hidden', border: `1.5px solid ${C.border}`,
    transform: `scale(${scale})`, transformOrigin: origin,
    boxShadow: '0 30px 80px rgba(0,0,0,0.5)', ...style,
  }}>
    <StreetGrid />
    {children}
  </div>
);

const SearchBar = ({f}) => {
  const full = 'Bäcker in der Nähe';
  const n = Math.max(0, Math.min(full.length, Math.floor((f - 8) / 1.4)));
  const shown = full.slice(0, n);
  const done = n >= full.length;
  const caret = !done && f % 16 < 8;
  const ap = spring({frame: f - 2, fps: 30, config: {damping: 16}});
  return (
    <div style={{
      position: 'absolute', left: 26, right: 26, top: 26, height: 74,
      background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 16,
      display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', zIndex: 8,
      opacity: ap, transform: `translateY(${(1 - ap) * -14}px)`, boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
    }}>
      <div style={{width: 22, height: 22, borderRadius: '50%', border: `3px solid ${C.muted}`, position: 'relative', flexShrink: 0}}>
        <div style={{position: 'absolute', width: 10, height: 3, background: C.muted, borderRadius: 2, bottom: -4, right: -6, transform: 'rotate(45deg)'}} />
      </div>
      <div style={{fontSize: 32, fontWeight: 700, color: shown ? C.ink : C.dim}}>
        {shown || 'Suchen…'}<span style={{opacity: caret ? 1 : 0, color: C.teal}}>|</span>
      </div>
    </div>
  );
};

const SelfChip = ({f}) => {
  const ap = spring({frame: f - 20, fps: 30, config: {damping: 16}});
  return (
    <div style={{position: 'absolute', left: `${SELF.x * 100}%`, top: `${SELF.y * 100}%`, transform: 'translate(-50%,-185%)', zIndex: 7, opacity: ap}}>
      <div style={{background: C.violet, color: '#fff', fontWeight: 800, fontSize: 22, padding: '6px 14px', borderRadius: 12, whiteSpace: 'nowrap', boxShadow: `0 6px 18px ${C.violet}66`}}>📍 Du bist hier</div>
    </div>
  );
};

const RadarSweep = ({f}) => {
  const D = 1180;
  const ang = interpolate(f, [4, 86], [0, 540], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const app = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <Marker x={SELF.x} y={SELF.y} anchor="center" z={2} style={{opacity: 0.9 * app}}>
      <div style={{position: 'relative', width: D, height: D}}>
        {[0.35, 0.65, 1].map((r, i) => <div key={i} style={{position: 'absolute', left: '50%', top: '50%', width: D * r, height: D * r, transform: 'translate(-50%,-50%)', borderRadius: '50%', border: `1.5px solid ${C.teal}22`}} />)}
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from ${ang}deg, ${C.teal}00 0deg, ${C.teal}00 320deg, ${C.teal}22 352deg, ${C.teal}55 360deg)`}} />
        <div style={{position: 'absolute', left: '50%', top: '50%', width: D / 2, height: 2.5, background: `linear-gradient(90deg, ${C.teal}00, ${C.teal})`, transformOrigin: 'left center', transform: `rotate(${ang}deg)`}} />
      </div>
    </Marker>
  );
};

const ShopPin = ({x, y, scale = 1, color = C.teal, glow = 22, dim = false, children}) => (
  <Marker x={x} y={y} anchor="tip" z={4}>
    <div style={{transform: `scale(${scale})`, transformOrigin: 'bottom center', opacity: dim ? 0.5 : 1, position: 'relative'}}>
      <TearPin color={color} glow={glow} size={52} />
      {children}
    </div>
  </Marker>
);

const GrayPin = ({x, y, g = 1, pulse = 1}) => (
  <Marker x={x} y={y} anchor="tip" z={4}>
    <div style={{position: 'relative', transform: `scale(${pulse})`, transformOrigin: 'bottom center'}}>
      <div style={{opacity: 1 - g}}><TearPin color={C.teal} glow={18} size={52} /></div>
      <div style={{position: 'absolute', inset: 0, opacity: g * 0.7}}><TearPin color={C.dim} glow={0} size={52} /></div>
      <div style={{position: 'absolute', right: -8, top: -8, opacity: g, width: 30, height: 30, borderRadius: '50%', background: C.red, color: '#fff', fontWeight: 900, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${C.bg}`}}>?</div>
    </div>
  </Marker>
);

const InfoCard = ({f}) => {
  const u = spring({frame: f - 40, fps: 30, config: {damping: 15, mass: 0.8}});
  if (u <= 0.001) return null;
  return (
    <div style={{
      position: 'absolute', left: '62%', top: '33%', width: 360, zIndex: 7,
      transform: `translateX(-50%) scaleY(${u})`, transformOrigin: 'top center', opacity: u,
      background: C.cardHi, border: `1.5px solid ${C.teal}66`, borderRadius: 16, padding: '16px 18px',
      boxShadow: `0 18px 46px rgba(0,0,0,0.55), 0 0 30px ${C.teal}22`,
    }}>
      <div style={{fontSize: 28, fontWeight: 900, color: C.ink}}>Bäckerei Klein</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 22, fontWeight: 800, color: C.gold}}>⭐ 4,9 <span style={{color: C.dim, fontWeight: 700}}>(212)</span></div>
      <div style={{marginTop: 10, display: 'inline-block', fontSize: 20, fontWeight: 800, color: C.green, background: 'rgba(61,220,132,0.12)', padding: '5px 12px', borderRadius: 10}}>Jetzt geöffnet</div>
    </div>
  );
};

const Caption = ({f, at = 0, color = C.ink, size = 46, children}) => {
  const s = spring({frame: f - at, fps: 30, config: {damping: 15}});
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1030, textAlign: 'center', opacity: s, transform: `translateY(${(1 - s) * 20}px)`, fontSize: size, fontWeight: 900, color, lineHeight: 1.22}}>{children}</div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const ap = spring({frame: f, fps: 30, config: {damping: 14}});
  const flash = 0.55 + Math.abs(Math.sin(f * 0.22)) * 0.45;
  return (
    <AbsoluteFill>
      <MapStage scale={0.96 + ap * 0.04} style={{opacity: ap}}>
        <SearchBar f={f} />
        <Marker x={SELF.x} y={SELF.y} anchor="center" z={5}><GpsDot f={f} /></Marker>
        <SelfChip f={f} />
      </MapStage>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1030, textAlign: 'center', opacity: f > 34 ? flash : 0, transform: `scale(${0.9 + Math.min(1, (f - 34) / 12) * 0.1})`, fontSize: 62, fontWeight: 900, color: C.teal, lineHeight: 1.1}}>
        „Bäcker in der Nähe"
      </div>
    </AbsoluteFill>
  );
};

const SweepScene = () => {
  const f = useCurrentFrame();
  const pops = [18, 32, 46];
  const found = pops.filter((p) => f >= p + 3).length;
  return (
    <AbsoluteFill>
      <MapStage>
        <RadarSweep f={f} />
        <Marker x={SELF.x} y={SELF.y} anchor="center" z={5}><GpsDot f={f} /></Marker>
        <ShopPin x={SHOP_A.x} y={SHOP_A.y} scale={spring({frame: f - pops[0], fps: 30, config: {damping: 9, mass: 0.5}})} glow={26} />
        <ShopPin x={SHOP_B.x} y={SHOP_B.y} scale={spring({frame: f - pops[1], fps: 30, config: {damping: 9, mass: 0.5}})} glow={26} />
        <ShopPin x={SHOP_C.x} y={SHOP_C.y} scale={spring({frame: f - pops[2], fps: 30, config: {damping: 9, mass: 0.5}})} glow={26} />
      </MapStage>
      <Caption f={f} at={50} color={C.teal} size={50}>
        <span style={{color: C.ink}}>{found}</span> {found === 1 ? 'Bäcker' : 'Bäcker'} im Umkreis
      </Caption>
    </AbsoluteFill>
  );
};

const VisScene = () => {
  const f = useCurrentFrame();
  const g = spring({frame: f - 16, fps: 30, config: {damping: 18}});
  const glow = 26 + Math.max(0, Math.sin(f * 0.24)) * 16;
  const ringP = (f % 45) / 45;
  return (
    <AbsoluteFill>
      <MapStage>
        <Marker x={SELF.x} y={SELF.y} anchor="center" z={5}><GpsDot f={f} /></Marker>
        <GrayPin x={SHOP_B.x} y={SHOP_B.y} g={g} />
        <GrayPin x={SHOP_C.x} y={SHOP_C.y} g={g} />
        <Marker x={SHOP_A.x} y={SHOP_A.y} anchor="center" z={3} style={{marginTop: -26}}>
          <div style={{width: 90, height: 90, borderRadius: '50%', border: `2px solid ${C.teal}`, transform: `translate(-50%,-50%) scale(${0.6 + ringP * 1.2})`, opacity: (1 - ringP) * 0.7}} />
        </Marker>
        <ShopPin x={SHOP_A.x} y={SHOP_A.y} color={C.teal} glow={glow} />
        <InfoCard f={f} />
      </MapStage>
      <Caption f={f} at={26} color={C.red} size={50}>
        <span style={{color: C.ink}}>2</span> nicht auffindbar<span style={{color: C.dim, fontSize: 34, display: 'block', marginTop: 6}}>ohne Google-Eintrag = keine Chance</span>
      </Caption>
    </AbsoluteFill>
  );
};

const RouteScene = () => {
  const f = useCurrentFrame();
  const drawT = interpolate(f, [8, 58], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const moveT = interpolate(f, [14, 96], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pt = pointAt(moveT);
  const arrive = spring({frame: f - 96, fps: 30, config: {damping: 10}});
  const glow = 26 + arrive * 26 + Math.max(0, Math.sin(f * 0.24)) * 12;
  return (
    <AbsoluteFill>
      <MapStage>
        <GrayPin x={SHOP_B.x} y={SHOP_B.y} g={1} />
        <GrayPin x={SHOP_C.x} y={SHOP_C.y} g={1} />
        <svg viewBox={`0 0 ${MW} ${MH}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 3}}>
          <path d={PATH_D} fill="none" stroke={C.teal} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="14 12" opacity={0.75} style={{strokeDashoffset: TOTAL * (1 - drawT)}} pathLength={TOTAL} />
          <circle cx={pt.x} cy={pt.y} r={22} fill={C.violet} opacity={0.22} />
        </svg>
        <Marker x={SELF.x} y={SELF.y} anchor="center" z={4}><GpsDot f={f} /></Marker>
        <ShopPin x={SHOP_A.x} y={SHOP_A.y} color={C.teal} glow={glow} scale={1 + arrive * 0.12} />
        <Marker x={pt.x / MW} y={pt.y / MH} anchor="center" z={6}>
          <div style={{position: 'relative'}}>
            <div style={{width: 22, height: 22, borderRadius: '50%', background: C.violet, boxShadow: `0 0 16px ${C.violet}`, border: '3px solid #fff', transform: 'translate(-50%,-50%)'}} />
            <div style={{position: 'absolute', left: 0, top: -18, transform: 'translate(-50%,-100%)', background: C.card, border: `1.5px solid ${C.violet}`, color: C.ink, fontSize: 20, fontWeight: 800, padding: '4px 12px', borderRadius: 10, whiteSpace: 'nowrap'}}>Kunde</div>
          </div>
        </Marker>
      </MapStage>
      <Caption f={f} at={20} size={48}>
        Der Kunde geht dahin,<br /><span style={{color: C.teal}}>wo er dich findet.</span>
      </Caption>
    </AbsoluteFill>
  );
};

const PointeScene = () => {
  const f = useCurrentFrame();
  const zoom = spring({frame: f, fps: 30, config: {damping: 16, mass: 0.9}});
  const pulse = 1 + Math.max(0, Math.sin(f * 0.22)) * 0.06;
  return (
    <AbsoluteFill>
      <MapStage scale={1 + zoom * 0.32} origin="43% 60%">
        <ShopPin x={SHOP_A.x} y={SHOP_A.y} color={C.dim} glow={0} dim />
        <GrayPin x={SHOP_B.x} y={SHOP_B.y} g={1} pulse={pulse} />
        <GrayPin x={SHOP_C.x} y={SHOP_C.y} g={1} pulse={pulse} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(420px 420px at 43% 60%, rgba(255,84,104,0.10), transparent 70%)'}} />
      </MapStage>
      <Caption f={f} at={16} size={44}>
        Kein Google-Eintrag ={' '}
        <span style={{color: C.red}}>nicht auf der Karte</span> =<br />
        <span style={{color: C.red}}>für Kunden unsichtbar.</span>
      </Caption>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const bait = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  const btn = spring({frame: f - 40, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 20}}>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * -18}px)`, fontSize: 32, fontWeight: 800, color: C.gold, maxWidth: 880, lineHeight: 1.28}}>
        Wie heißt <span style={{color: C.ink}}>dein Ort</span>?<br /><span style={{fontSize: 27, color: C.muted}}>Tippst du auch ständig „… in der Nähe"?</span>
      </div>
      <div style={{opacity: line, transform: `scale(${0.9 + line * 0.1})`, marginTop: 10}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.1, marginTop: 10, maxWidth: 900}}>
          Werde in deiner Stadt <span style={{color: C.teal}}>gefunden</span>.
        </div>
      </div>
      <div style={{opacity: btn, transform: `translateY(${(1 - btn) * 20}px)`, marginTop: 20}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
        <div style={{marginTop: 16, fontSize: 24, fontWeight: 700, color: C.muted}}>Beeken Web Engineering · Bad Homburg</div>
      </div>
    </AbsoluteFill>
  );
};

export const NaeheRadar = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(820px 820px at 540px 560px, rgba(124,92,255,0.10), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={SWEEP}><SweepScene /></Sequence>
      <Sequence from={HOOK + SWEEP} durationInFrames={VIS}><VisScene /></Sequence>
      <Sequence from={HOOK + SWEEP + VIS} durationInFrames={ROUTE}><RouteScene /></Sequence>
      <Sequence from={HOOK + SWEEP + VIS + ROUTE} durationInFrames={POINTE}><PointeScene /></Sequence>
      <Sequence from={HOOK + SWEEP + VIS + ROUTE + POINTE} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
