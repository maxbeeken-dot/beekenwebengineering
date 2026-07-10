import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const HOOK = 60, REVEAL = 66, BAD = 150, GOOD = 126, COMMENT = 60, CTA = 78; // 540 = 18 s

const Clock = ({time, color = C.ink, size = 56}) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 10, background: C.card, border: `2px solid ${C.border}`,
    borderRadius: 14, padding: '10px 20px',
  }}>
    <div style={{fontSize: size, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums', letterSpacing: 2}}>{time}</div>
  </div>
);

const Seller = ({face, glow, f}) => {
  const bob = Math.sin(f * 0.08) * 6;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0}}>
      <div style={{
        width: 200, height: 200, borderRadius: 44, background: C.cardHi, border: `3px solid ${glow}77`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 112,
        transform: `translateY(${bob}px)`, boxShadow: `0 0 44px ${glow}26`,
      }}>{face}</div>
      <div style={{width: 560, height: 30, background: C.border, borderRadius: 10, marginTop: -4}} />
      <div style={{width: 480, height: 14, background: C.card, borderRadius: 8, marginTop: 5}} />
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 12, mass: 0.6}});
  const b = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  const min = 47 + Math.floor(interpolate(f, [0, 60], [0, 3], {extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 26}}>
      <div style={{fontSize: 60, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.9 + a * 0.1})`, lineHeight: 1.12}}>
        Dein bester Verkäufer<br />schläft gerade. 💤
      </div>
      <div style={{opacity: b}}><Clock time={`23:${min}`} color={C.red} /></div>
      <div style={{fontSize: 32, fontWeight: 700, color: C.muted, opacity: b}}>…und es kostet dich gerade Kunden.</div>
    </AbsoluteFill>
  );
};

const RevealScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.6}});
  const b = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 20}}>
      <div style={{fontSize: 54, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.92 + a * 0.08})`, lineHeight: 1.16}}>
        Dein bester Verkäufer<br />= <span style={{color: C.teal}}>deine Website</span>.
      </div>
      <div style={{fontSize: 36, fontWeight: 700, color: C.muted, opacity: b, transform: `translateY(${(1 - b) * 20}px)`}}>
        Sie arbeitet, während du schläfst.
      </div>
    </AbsoluteFill>
  );
};

const LOSSES = [
  {at: 62, t: '22:14'},
  {at: 88, t: '02:31'},
  {at: 114, t: '06:05'},
];

const BadScene = () => {
  const f = useCurrentFrame();
  const shop = spring({frame: f, fps: 30, config: {damping: 16}});
  const custX = interpolate(f, [20, 50, 95, 130], [-580, -260, -260, 440], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const custOp = interpolate(f, [20, 30, 118, 132], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const spin = (f * 7) % 360;
  const waiting = f > 50 && f < 100;
  const zzz = Math.sin(f * 0.12) * 9;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '260px 40px 0', gap: 26, opacity: shop}}>
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{position: 'absolute', top: -56, left: 140, fontSize: 38, color: C.dim, fontWeight: 900, transform: `translateY(${zzz}px)`}}>Zzz</div>
        <Seller face="😴" glow={C.red} f={f} />
        <div style={{position: 'absolute', left: '50%', top: 70, transform: `translateX(${custX}px)`, opacity: custOp, fontSize: 96}}>🧑</div>
        {waiting && (
          <div style={{position: 'absolute', left: '50%', top: 12, transform: `translateX(${custX + 8}px)`, display: 'flex', alignItems: 'center', gap: 9}}>
            <div style={{width: 30, height: 30, borderRadius: 30, border: `4px solid ${C.border}`, borderTopColor: C.red, transform: `rotate(${spin}deg)`}} />
            <div style={{fontSize: 24, color: C.dim, fontWeight: 700}}>Lädt…</div>
          </div>
        )}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 54, width: 680}}>
        {LOSSES.map((l, i) => {
          const s = spring({frame: f - l.at, fps: 30, config: {damping: 14}});
          if (s <= 0.01) return null;
          return (
            <div key={i} style={{
              opacity: s, transform: `translateX(${(1 - s) * 50}px)`, background: 'rgba(255,84,104,0.10)',
              border: `2px solid ${C.red}44`, borderRadius: 14, padding: '14px 22px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{fontSize: 30, fontWeight: 800, color: C.red}}>Kunde weg 🚶</div>
              <div style={{fontSize: 30, fontWeight: 900, color: C.muted, fontVariantNumeric: 'tabular-nums'}}>{l.t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const GoodScene = () => {
  const f = useCurrentFrame();
  const custX = interpolate(f, [10, 40], [-580, -260], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const custOp = interpolate(f, [10, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const card = spring({frame: f - 44, fps: 30, config: {damping: 15}});
  const win = spring({frame: f - 86, fps: 30, config: {damping: 14}});
  const btnPulse = 1 + Math.sin(f * 0.24) * 0.05;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '200px 40px 0', gap: 22}}>
      <Clock time="03:12" color={C.teal} size={44} />
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10}}>
        <Seller face="😃" glow={C.teal} f={f} />
        <div style={{position: 'absolute', left: '50%', top: 70, transform: `translateX(${custX}px)`, opacity: custOp, fontSize: 96}}>🧑</div>
      </div>
      <div style={{opacity: card, transform: `translateY(${(1 - card) * 26}px)`, width: 680, background: C.card, border: `2px solid ${C.teal}55`, borderRadius: 18, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 14, marginTop: 34}}>
        <div style={{fontSize: 28, fontWeight: 800, color: C.muted}}>Sofort erreichbar · rund um die Uhr</div>
        <div style={{transform: `scale(${btnPulse})`, background: C.teal, color: '#04120f', borderRadius: 14, padding: '18px', fontSize: 31, fontWeight: 900, textAlign: 'center', boxShadow: `0 0 30px ${C.teal}55`}}>
          Angebot anfragen ✅
        </div>
      </div>
      <div style={{opacity: win, transform: `translateY(${(1 - win) * 18}px)`, fontSize: 34, fontWeight: 900, color: C.green, textAlign: 'center', marginTop: 22}}>
        Kunde gewonnen · 03:12 Uhr<br /><span style={{fontSize: 27, color: C.muted, fontWeight: 700}}>…während du geschlafen hast.</span>
      </div>
    </AbsoluteFill>
  );
};

const CommentScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const pulse = 1 + Math.sin(f * 0.3) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 18}}>
      <div style={{fontSize: 56, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${pulse})`, lineHeight: 1.16}}>
        Wie spät ist es<br /><span style={{color: C.gold}}>GERADE</span> bei dir? 👇
      </div>
      <div style={{fontSize: 32, fontWeight: 700, color: C.muted, opacity: a, marginTop: 8}}>Genau jetzt sucht dich jemand.</div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 16}}>
      <div style={{fontSize: 64, opacity: pop}}>👋</div>
      <div style={{opacity: pop, transform: `scale(${0.9 + pop * 0.1})`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 46, color: C.ink, fontWeight: 900, lineHeight: 1.16, marginTop: 8, maxWidth: 900}}>
          Ein Verkäufer, der <span style={{color: C.teal}}>niemals schläft</span>.
        </div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`, marginTop: 20}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SchlafenderVerkaeufer = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(780px 780px at 540px 500px, rgba(124,92,255,0.09), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={REVEAL}><RevealScene /></Sequence>
      <Sequence from={HOOK + REVEAL} durationInFrames={BAD}><BadScene /></Sequence>
      <Sequence from={HOOK + REVEAL + BAD} durationInFrames={GOOD}><GoodScene /></Sequence>
      <Sequence from={HOOK + REVEAL + BAD + GOOD} durationInFrames={COMMENT}><CommentScene /></Sequence>
      <Sequence from={HOOK + REVEAL + BAD + GOOD + COMMENT} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
