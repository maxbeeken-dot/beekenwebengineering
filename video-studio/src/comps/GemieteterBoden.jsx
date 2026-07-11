import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Szenenlängen (30 fps) → gesamt 555 Frames = 18,5 s
const HOOK = 60, GROUND = 120, TIP = 120, OWN = 105, COMPARE = 90, CTA = 60;
const GRAD = `linear-gradient(90deg, ${C.violet}, ${C.gold})`;

// ── Bausteine (rein visuell, keine Hooks) ─────────────────────────────
const Shop = ({s = 1}) => (
  <div style={{width: 156 * s, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <div style={{fontSize: 15 * s, fontWeight: 900, color: C.gold, letterSpacing: 2, marginBottom: 7 * s}}>DEIN LADEN</div>
    {/* Markise als Trapez via clip-path */}
    <div style={{
      width: 156 * s, height: 30 * s,
      background: `repeating-linear-gradient(90deg, ${C.teal} 0 ${17 * s}px, ${C.violet} ${17 * s}px ${34 * s}px)`,
      clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
    }} />
    {/* Körper */}
    <div style={{
      width: 140 * s, height: 116 * s, background: C.cardHi, border: `2px solid ${C.border}`, borderTop: 'none',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative',
    }}>
      <div style={{position: 'absolute', top: 14 * s, left: 14 * s, width: 30 * s, height: 30 * s, background: C.card, border: `2px solid ${C.border}`, borderRadius: 4}} />
      <div style={{position: 'absolute', top: 14 * s, right: 14 * s, width: 30 * s, height: 30 * s, background: C.card, border: `2px solid ${C.border}`, borderRadius: 4}} />
      <div style={{width: 46 * s, height: 64 * s, background: C.card, border: `2px solid ${C.violet}`, borderBottom: 'none', borderRadius: '8px 8px 0 0'}} />
    </div>
  </div>
);

const Plate = ({w = 620, label}) => (
  <div style={{width: w, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <div style={{width: w, height: 42, borderRadius: 12, background: GRAD, boxShadow: '0 18px 44px rgba(0,0,0,0.45)'}} />
    {label && <div style={{marginTop: 14, fontSize: 24, fontWeight: 800, color: C.muted, letterSpacing: 1}}>{label}</div>}
  </div>
);

const WebsiteBlock = ({w = 620, h = 330}) => (
  <div style={{
    width: w, height: h, background: `linear-gradient(180deg, ${C.cardHi}, ${C.card})`,
    border: `2px solid ${C.border}`, borderBottom: 'none', borderRadius: '14px 14px 0 0',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 22,
  }}>
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: 30, fontWeight: 900, color: C.ink}}>deine Website<span style={{color: C.teal}}> .de</span></div>
      <div style={{height: 4, background: C.teal, marginTop: 8, borderRadius: 4}} />
    </div>
  </div>
);

// ── 1) HOOK ───────────────────────────────────────────────────────────
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.7}});
  const b = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  const glow = spring({frame: f, fps: 30, config: {damping: 20, mass: 1.5}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <div style={{position: 'absolute', width: 460, height: 460, borderRadius: 130, background: `linear-gradient(135deg, ${C.violet}, ${C.gold})`, filter: 'blur(80px)', opacity: glow * 0.5}} />
      <div style={{position: 'relative', fontSize: 84, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.88 + a * 0.12})`, lineHeight: 1.08}}>
        „Instagram<br />reicht mir."
      </div>
      <div style={{position: 'relative', marginTop: 26, fontSize: 34, fontWeight: 700, color: C.muted, opacity: b, transform: `translateY(${(1 - b) * 18}px)`}}>
        „…dachte ich auch."
      </div>
    </AbsoluteFill>
  );
};

// ── 2) AUF FREMDEM GRUND ───────────────────────────────────────────────
const GroundScene = () => {
  const f = useCurrentFrame();
  const t = spring({frame: f, fps: 30, config: {damping: 15}});
  const drop = spring({frame: f - 16, fps: 30, config: {damping: 12, mass: 0.8}});
  const float = Math.sin(f * 0.08) * 8;
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{marginTop: 150, padding: '0 70px', textAlign: 'center', opacity: t, transform: `translateY(${(1 - t) * -20}px)`, fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.18, maxWidth: 920}}>
        Dein ganzer Laden steht auf <span style={{color: C.gold}}>fremdem Grund.</span>
      </div>
      <div style={{position: 'absolute', left: '50%', top: 600, transform: `translate(-50%, ${float}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{transform: `translateY(${(1 - drop) * -130}px) scale(${0.9 + drop * 0.1})`, opacity: drop}}><Shop s={1.15} /></div>
        <div style={{marginTop: 4}}><Plate w={620} label="gemieteter Boden" /></div>
      </div>
    </AbsoluteFill>
  );
};

// ── 3) KIPPEN ──────────────────────────────────────────────────────────
const TipScene = () => {
  const f = useCurrentFrame();
  const notif = spring({frame: f - 4, fps: 30, config: {damping: 9, mass: 0.9}});
  const notifY = interpolate(notif, [0, 1], [-280, 0]);
  const tilt = spring({frame: f - 40, fps: 30, config: {damping: 10, mass: 1.2}});
  const rot = tilt * 13;
  const slide = spring({frame: f - 52, fps: 30, config: {damping: 15}});
  const wob = Math.sin(f * 0.7) * slide * 7;
  const txt = spring({frame: f - 70, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{marginTop: 118, transform: `translateY(${notifY}px)`, opacity: notif, width: 560, background: C.card, border: `2px solid ${C.red}66`, borderRadius: 20, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 14px 40px rgba(0,0,0,0.5)'}}>
        <div style={{fontSize: 42}}>⚠️</div>
        <div>
          <div style={{fontSize: 24, fontWeight: 900, color: C.ink}}>Reichweite geändert</div>
          <div style={{fontSize: 18, fontWeight: 700, color: C.muted}}>Neue Regeln ab sofort</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: '50%', top: 620, transform: `translateX(-50%) rotate(${rot}deg)`, transformOrigin: '50% 100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{transform: `translateX(${slide * 130 + wob}px) rotate(${slide * 8}deg)`}}><Shop s={1.15} /></div>
        <div style={{marginTop: 4}}><Plate w={620} label="gemieteter Boden" /></div>
      </div>
      <div style={{position: 'absolute', top: 1015, width: '100%', textAlign: 'center', padding: '0 70px', opacity: txt, transform: `translateY(${(1 - txt) * 20}px)`, fontSize: 44, fontWeight: 900, color: C.ink, lineHeight: 1.18}}>
        Eine Regel-Änderung – und du <span style={{color: C.red}}>rutschst weg.</span>
      </div>
    </AbsoluteFill>
  );
};

// ── 4) EIGENER GRUND ───────────────────────────────────────────────────
const OwnScene = () => {
  const f = useCurrentFrame();
  const rise = spring({frame: f, fps: 30, config: {damping: 14, mass: 1}});
  const blockY = interpolate(rise, [0, 1], [430, 0]);
  const settle = spring({frame: f - 26, fps: 30, config: {damping: 8, mass: 0.7}});
  const shopY = interpolate(settle, [0, 1], [-80, 0]);
  const pulse = Math.max(0, 1 - Math.abs(f - 46) / 14);
  const txt = spring({frame: f - 54, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', padding: '0 70px', opacity: txt, transform: `translateY(${(1 - txt) * -20}px)`, fontSize: 50, fontWeight: 900, color: C.ink, lineHeight: 1.18}}>
        Auf <span style={{color: C.teal}}>eigenem Grund</span> wirft dich keiner runter.
      </div>
      <div style={{position: 'absolute', left: '50%', top: 470, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{transform: `translateY(${shopY}px)`, opacity: settle, filter: pulse > 0 ? `drop-shadow(0 0 ${pulse * 30}px ${C.green})` : 'none', zIndex: 2}}><Shop s={1.15} /></div>
        <div style={{transform: `translateY(${blockY}px)`, marginTop: 2}}><WebsiteBlock w={620} h={340} /></div>
      </div>
      <div style={{position: 'absolute', left: '50%', top: 560, transform: `translate(-50%,-50%) scale(${1 + pulse * 0.6})`, width: 210, height: 210, borderRadius: 210, border: `3px solid ${C.green}`, opacity: pulse * 0.7}} />
    </AbsoluteFill>
  );
};

// ── 5) VERGLEICH ───────────────────────────────────────────────────────
const VISITORS = 14;
const Dot = ({i, f}) => {
  const s = spring({frame: f - i * 6, fps: 30, config: {damping: 14, mass: 0.6}});
  if (s <= 0.001) return null;
  const x = (i % 5) * 42 - 84 + Math.sin(i * 1.7) * 16;
  const y = interpolate(s, [0, 1], [-170, Math.floor(i / 5) * 40]);
  return <div style={{position: 'absolute', left: '50%', top: 30, transform: `translate(${x}px, ${y}px) scale(${s})`, width: 24, height: 24, borderRadius: 24, background: C.teal, boxShadow: `0 0 10px ${C.teal}66`, opacity: s}} />;
};

const CompareScene = () => {
  const f = useCurrentFrame();
  const leftIn = spring({frame: f, fps: 30, config: {damping: 16}});
  const rightIn = spring({frame: f - 8, fps: 30, config: {damping: 16}});
  const leftTilt = spring({frame: f - 26, fps: 30, config: {damping: 9, mass: 1.2}}) * 15;
  const txt = spring({frame: f - 38, fps: 30, config: {damping: 16}});
  let arrived = 0;
  for (let i = 0; i < VISITORS; i++) if (f >= i * 6 + 8) arrived++;
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 130, width: '100%', textAlign: 'center', padding: '0 60px', opacity: txt, transform: `translateY(${(1 - txt) * -18}px)`, fontSize: 44, fontWeight: 900, color: C.ink, lineHeight: 1.18}}>
        Poste, wo du willst – aber <span style={{color: C.teal}}>lande auf deinem Grund.</span>
      </div>
      <div style={{position: 'absolute', top: 320, display: 'flex', alignItems: 'center', gap: 12, background: C.card, border: `2px solid ${C.teal}44`, borderRadius: 999, padding: '8px 20px', opacity: rightIn}}>
        <span style={{fontSize: 22, fontWeight: 700, color: C.muted}}>Besucher</span>
        <span style={{fontSize: 26, fontWeight: 900, color: C.teal, fontVariantNumeric: 'tabular-nums'}}>+{arrived}</span>
      </div>
      <div style={{position: 'absolute', top: 400, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 70}}>
        {/* LINKS: kippende leere Insta-Platte */}
        <div style={{width: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: leftIn, transform: `translateY(${(1 - leftIn) * 40}px)`}}>
          <div style={{height: 220, width: '100%', position: 'relative'}}>
            <div style={{position: 'absolute', bottom: 0, left: '50%', transform: `translateX(-50%) translateX(${leftTilt * 3.5}px) rotate(${leftTilt}deg)`, fontSize: 86, opacity: 0.9}}>📱</div>
          </div>
          <div style={{transform: `rotate(${leftTilt}deg)`, transformOrigin: '50% 100%'}}>
            <div style={{width: 300, height: 40, borderRadius: 12, background: GRAD, opacity: 0.7}} />
          </div>
          <div style={{marginTop: 16, fontSize: 22, fontWeight: 800, color: C.muted}}>nur geliehen</div>
        </div>
        {/* RECHTS: bombenfester Website-Block mit Laden + Besucher */}
        <div style={{width: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: rightIn, transform: `translateY(${(1 - rightIn) * 40}px)`}}>
          <div style={{height: 220, width: '100%', position: 'relative'}}>
            {Array.from({length: VISITORS}, (_, i) => <Dot key={i} i={i} f={f} />)}
            <div style={{position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)'}}><Shop s={0.92} /></div>
          </div>
          <div style={{width: 300, height: 120, background: `linear-gradient(180deg, ${C.cardHi}, ${C.card})`, border: `2px solid ${C.teal}55`, borderBottom: 'none', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 14}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: 21, fontWeight: 900, color: C.ink}}>deine Website<span style={{color: C.teal}}> .de</span></div>
              <div style={{height: 3, background: C.teal, marginTop: 6, borderRadius: 3}} />
            </div>
          </div>
          <div style={{marginTop: 14, fontSize: 22, fontWeight: 800, color: C.teal}}>dein Grund ✅</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 6) CTA ─────────────────────────────────────────────────────────────
const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  const bait = spring({frame: f - 38, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 18}}>
      <div style={{opacity: pop, transform: `scale(${0.9 + pop * 0.1})`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 60, color: C.ink, fontWeight: 900, lineHeight: 1.1, marginTop: 10}}>
          Bau auf <span style={{color: C.teal}}>eigenem Grund.</span>
        </div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`, marginTop: 20}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 26, fontSize: 30, fontWeight: 800, color: C.gold, maxWidth: 840, lineHeight: 1.3}}>
        Wie viele deiner Follower haben deine Nummer? 👇
      </div>
    </AbsoluteFill>
  );
};

// ── Root ───────────────────────────────────────────────────────────────
export const GemieteterBoden = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(760px 760px at 540px 520px, rgba(124,92,255,0.10), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={GROUND}><GroundScene /></Sequence>
      <Sequence from={HOOK + GROUND} durationInFrames={TIP}><TipScene /></Sequence>
      <Sequence from={HOOK + GROUND + TIP} durationInFrames={OWN}><OwnScene /></Sequence>
      <Sequence from={HOOK + GROUND + TIP + OWN} durationInFrames={COMPARE}><CompareScene /></Sequence>
      <Sequence from={HOOK + GROUND + TIP + OWN + COMPARE} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
