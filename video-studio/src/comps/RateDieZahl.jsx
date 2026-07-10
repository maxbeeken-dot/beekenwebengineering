import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const HOOK = 45, MAIN = 360, INSIGHT = 60, CTA = 90; // 555 = 18,5 s
const CELL = 66;

// Deterministische "Todes-Reihenfolge": rank(i) = (i*37+13) mod 100 (Bijektion). 53 Leaver mit rank<53.
const rank = (i) => (i * 37 + 13) % 100;
const LEAVE_START = 120, LEAVE_DUR = 175; // lokal im MAIN-Scene
const leaveAtOf = (i) => LEAVE_START + (rank(i) / 53) * LEAVE_DUR;
const remainingAt = (f) => {
  let gone = 0;
  for (let i = 0; i < 100; i++) if (rank(i) < 53 && f >= leaveAtOf(i)) gone++;
  return 100 - gone;
};

const Dot = ({i, f}) => {
  const enterAt = Math.floor(i / 10) * 3 + (i % 10) * 1.4;
  const enter = spring({frame: f - enterAt, fps: 30, config: {damping: 14, mass: 0.5}});
  const leaver = rank(i) < 53;
  const la = leaveAtOf(i);
  let ty = 0, op = enter, color = C.violet, glow = `0 0 9px ${C.violet}44`;
  if (leaver && f >= la) {
    const d = f - la;
    ty = interpolate(d, [0, 20], [0, 150], {extrapolateRight: 'clamp'});
    op = interpolate(d, [0, 7, 20], [1, 1, 0], {extrapolateRight: 'clamp'}) * enter;
    color = C.red;
    glow = 'none';
  }
  return (
    <div style={{width: CELL, height: CELL, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 46, height: 46, borderRadius: 46, background: color, opacity: op, transform: `translateY(${ty}px) scale(${enter})`, boxShadow: glow}} />
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 12, mass: 0.6}});
  const b = spring({frame: f - 16, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.3) * 0.05;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 22}}>
      <div style={{fontSize: 64, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.9 + a * 0.1})`, lineHeight: 1.1}}>
        <span style={{color: C.violet, transform: `scale(${pulse})`, display: 'inline-block'}}>100</span> Leute öffnen<br />deine Website.
      </div>
      <div style={{fontSize: 40, fontWeight: 800, color: C.teal, opacity: b}}>🫵 Wie viele bleiben?</div>
    </AbsoluteFill>
  );
};

const MainScene = () => {
  const f = useCurrentFrame();
  const remain = remainingAt(f);
  const timer = interpolate(f, [LEAVE_START, LEAVE_START + LEAVE_DUR], [0, 3.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const drained = f >= LEAVE_START + LEAVE_DUR;
  const guessPulse = 1 + Math.sin(f * 0.34) * 0.05;
  const showGuess = f > 34 && f < LEAVE_START + 6;
  const counterBig = drained ? spring({frame: f - (LEAVE_START + LEAVE_DUR), fps: 30, config: {damping: 12}}) : 0;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '120px 40px 0', gap: 18}}>
      {/* Timer + bleiben-Counter */}
      <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
        <div style={{background: C.card, border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 18px', fontSize: 26, fontWeight: 700, color: drained ? C.red : C.muted, fontVariantNumeric: 'tabular-nums'}}>
          {drained ? '⏱ 3,0 s' : `Laden… ${timer.toFixed(1).replace('.', ',')} s`}
        </div>
        <div style={{fontSize: 30 + counterBig * 20, fontWeight: 900, color: remain > 60 ? C.teal : (remain > 50 ? C.gold : C.red), fontVariantNumeric: 'tabular-nums'}}>
          bleiben: {Math.round(remain)}
        </div>
      </div>
      {/* Raster */}
      <div style={{width: CELL * 10, display: 'flex', flexWrap: 'wrap', marginTop: 6}}>
        {Array.from({length: 100}, (_, i) => <Dot key={i} i={i} f={f} />)}
      </div>
      {/* Guess-Overlay */}
      {showGuess && (
        <div style={{marginTop: 10, transform: `scale(${guessPulse})`, textAlign: 'center'}}>
          <div style={{fontSize: 40, fontWeight: 900, color: C.gold}}>RATE JETZT 👇</div>
          <div style={{fontSize: 28, color: C.muted, fontWeight: 700}}>Dein Tipp (0–100) in die Kommentare</div>
        </div>
      )}
      {drained && (
        <div style={{marginTop: 14, textAlign: 'center', opacity: counterBig}}>
          <div style={{fontSize: 30, fontWeight: 800, color: C.red}}>53 sind weg → zur Konkurrenz.</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const InsightScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{fontSize: 50, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.92 + a * 0.08})`, lineHeight: 1.22, maxWidth: 900}}>
        Bei <span style={{color: C.red}}>3 Sekunden</span> Ladezeit ist die <span style={{color: C.red}}>Hälfte weg</span>.<br />
        <span style={{fontSize: 38, color: C.muted}}>Jede Sekunde kostet dich Besucher.</span>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 24, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 18}}>
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -18}px)`, fontSize: 34, fontWeight: 800, color: C.gold}}>
        👇 Wie nah war dein Tipp?<br /><span style={{fontSize: 27, color: C.muted}}>Schreib deine Zahl.</span>
      </div>
      <div style={{opacity: line, transform: `scale(${0.9 + line * 0.1})`, marginTop: 12}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 50, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 8}}>
          Schnelle Seite = <span style={{color: C.teal}}>Kunden bleiben</span>.
        </div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`, marginTop: 22}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RateDieZahl = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(760px 760px at 540px 480px, rgba(124,92,255,0.10), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={MAIN}><MainScene /></Sequence>
      <Sequence from={HOOK + MAIN} durationInFrames={INSIGHT}><InsightScene /></Sequence>
      <Sequence from={HOOK + MAIN + INSIGHT} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
