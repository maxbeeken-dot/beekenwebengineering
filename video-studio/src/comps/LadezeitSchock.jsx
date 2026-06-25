import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, Easing} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const Pill = ({children, color, bg}) => (
  <div style={{display:'inline-flex', alignItems:'center', gap: 12, padding: '14px 28px', borderRadius: 99,
    background: bg, color, fontSize: 34, fontWeight: 700, fontFamily: FONT}}>{children}</div>
);

// HOOK (0–78) — Schock-Aussage + Stoppuhr
const HookScene = () => {
  const f = useCurrentFrame();
  const flash = f < 5 ? interpolate(f,[0,5],[0.85,0]) : 0;
  const pop = spring({frame: f, fps: 30, config:{damping: 12, mass: 0.6}});
  const tick = Math.sin(f*0.5)*6;
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center', padding: 70}}>
      <AbsoluteFill style={{background:'#fff', opacity: flash}} />
      <div style={{transform:`scale(${0.85+pop*0.15})`, textAlign:'center'}}>
        <div style={{fontSize: 132, transform:`rotate(${tick}deg)`}}>⏱️</div>
        <div style={{fontSize: 92, color: C.ink, fontWeight: 800, lineHeight: 1.03, marginTop: 14}}>
          Du verlierst die<br/><span style={{color: C.red}}>Hälfte</span> deiner Besucher.
        </div>
        <div style={{fontSize: 44, color: C.muted, fontWeight: 700, marginTop: 22}}>In unter 3 Sekunden.</div>
      </div>
    </AbsoluteFill>
  );
};

// DRAIN (78–360) — Timer klettert, Besucher (100 Punkte) verschwinden
const DrainScene = () => {
  const f = useCurrentFrame();
  // Timer 0,0 → 3,9s über ~210 Frames
  const t = interpolate(f, [20, 230], [0, 3.9], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  // Wie viele der 100 Besucher sind weg? Ab 1s steigt der Absprung, bei 3s+ → 53
  const lost = Math.round(interpolate(t, [1, 3], [0, 53], {extrapolateLeft:'clamp', extrapolateRight:'clamp'}));
  const dots = Array.from({length: 100}, (_, i) => i);
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center'}}>
      <div style={{position:'absolute', top: 90, left: 0, right: 0, textAlign:'center'}}>
        <Pill color={C.red} bg="rgba(255,84,104,0.12)">⛔ Langsame Website</Pill>
      </div>
      {/* Timer */}
      <div style={{fontSize: 150, fontWeight: 800, color: t < 3 ? C.ink : C.red, fontVariantNumeric:'tabular-nums', marginTop: 40}}>
        {t.toFixed(1)}<span style={{fontSize: 70}}>s</span>
      </div>
      {/* Besucher-Raster */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gap: 16, width: 720, marginTop: 50}}>
        {dots.map(i => {
          const gone = i < lost;
          return <div key={i} style={{
            width: 52, height: 52, borderRadius: 99,
            background: gone ? C.red : C.teal,
            opacity: gone ? 0.18 : 1,
            transform: gone ? `translateY(${30}px)` : 'translateY(0)',
            transition: 'all 0.3s',
          }} />;
        })}
      </div>
      <div style={{position:'absolute', bottom: 150, left: 70, right: 70, textAlign:'center'}}>
        <div style={{fontSize: 46, color: C.ink, fontWeight: 700}}>
          Verloren: <span style={{color: C.red, fontWeight: 800}}>{lost}%</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// BIG STAT (360–500)
const StatScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config:{damping: 11, mass: 0.7}});
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center', textAlign:'center', padding: 70}}>
      <div style={{transform:`scale(${0.7+pop*0.3})`}}>
        <div style={{fontSize: 320, fontWeight: 800, color: C.red, lineHeight: 0.9}}>53%</div>
      </div>
      <div style={{fontSize: 56, color: C.ink, fontWeight: 700, marginTop: 30, lineHeight: 1.15}}>
        verlassen deine Seite,<br/>bevor sie geladen ist.
      </div>
      <div style={{fontSize: 32, color: C.dim, marginTop: 30}}>Quelle: Google — 3s+ Ladezeit auf Mobil</div>
    </AbsoluteFill>
  );
};

// SOLUTION (500–620)
const SolutionScene = () => {
  const f = useCurrentFrame();
  const enter = spring({frame: f, fps: 30, config:{damping: 16}});
  const ring = 0.4 + Math.sin(f*0.12)*0.15;
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center', textAlign:'center', padding: 70}}>
      <div style={{transform:`translateY(${(1-enter)*40}px)`, opacity: enter}}>
        <Pill color={C.teal} bg="rgba(52,227,208,0.12)">✅ Handgeschriebener Code</Pill>
        <div style={{fontSize: 150, fontWeight: 800, color: C.teal, marginTop: 40, textShadow:`0 0 ${ring*60}px rgba(52,227,208,0.5)`}}>
          0,4<span style={{fontSize: 70}}>s</span>
        </div>
        <div style={{fontSize: 50, color: C.ink, fontWeight: 700, marginTop: 16}}>10× schneller. Niemand springt ab.</div>
        <div style={{fontSize: 34, color: C.muted, marginTop: 18}}>Schnell = besseres Google-Ranking + mehr Umsatz.</div>
      </div>
    </AbsoluteFill>
  );
};

// CTA (620–720)
const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config:{damping: 14}});
  const pulse = 1 + Math.sin(f*0.18)*0.03;
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center', textAlign:'center', padding: 70}}>
      <div style={{transform:`scale(${0.9+pop*0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 26}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 84, color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 30}}>
          Wie schnell ist<br/><span style={{color: C.violet}}>deine</span> Seite?
        </div>
        <div style={{transform:`scale(${pulse})`, display:'inline-block', marginTop: 10}}>
          <div style={{padding:'26px 52px', background: C.violet, borderRadius: 18, color:'#fff', fontSize: 40, fontWeight: 800}}>Kommentier „WEB" → Gratis-Speedtest</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const LadezeitSchock = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background:`radial-gradient(700px 700px at ${540+bgGlowX}px 760px, rgba(255,84,104,0.12), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={78}><HookScene /></Sequence>
      <Sequence from={78} durationInFrames={282}><DrainScene /></Sequence>
      <Sequence from={360} durationInFrames={140}><StatScene /></Sequence>
      <Sequence from={500} durationInFrames={120}><SolutionScene /></Sequence>
      <Sequence from={620} durationInFrames={100}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
