import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere} from './Cine.jsx';

// Cinematic: ein Spiegel. Kunden sehen nicht dich – sie sehen dein Spiegelbild
// (= deine Website). Altes verzerrtes vs. gepflegtes scharfes Bild.
// Kernbotschaft: erster Eindruck / Identität im Netz.
// 30fps → 75 + 195 + 180 + 75 + 75 = 600 = 20,0 s
const HOOK = 75, OLD = 195, POLISH = 180, LINE = 75, CTA = 75;

const CX = 540, CY = 860;

// Spiegel-Rahmen + Reflexionsfläche. quality ∈ [0,1]: 0 = verzerrt, 1 = scharf.
const Mirror = ({quality, f = 0, children}) => {
  const blur = (1 - quality) * 7;
  const sat = 0.2 + quality * 0.8;
  const jitter = (1 - quality) * Math.sin(f * 0.7) * 4;
  return (
    <div style={{position: 'absolute', left: CX - 320, top: CY - 430, width: 640, height: 860}}>
      {/* Rahmen */}
      <div style={{position: 'absolute', inset: -26, borderRadius: '320px 320px 320px 320px / 430px 430px 430px 430px', background: 'linear-gradient(150deg,#6a5320,#b8912f 45%,#3a2d13)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}} />
      {/* Glas */}
      <div style={{position: 'absolute', inset: 0, borderRadius: '320px/430px', overflow: 'hidden', background: 'linear-gradient(160deg,#0e0d15,#141320 60%,#0b0a12)', boxShadow: `inset 0 0 80px rgba(0,0,0,0.7)`}}>
        <div style={{position: 'absolute', inset: 0, filter: `blur(${blur}px) saturate(${sat})`, transform: `translateX(${jitter}px)`}}>{children}</div>
        {/* Glanz-Streifen */}
        <div style={{position: 'absolute', top: -80, left: -120, width: 200, height: 1000, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)', transform: 'rotate(18deg)'}} />
      </div>
    </div>
  );
};

// Das Spiegelbild = die Marke des Kunden.
const Brand = ({good}) => {
  const accent = good ? C.teal : '#6b5a4a';
  return (
    <div style={{position: 'absolute', left: '50%', top: 180, transform: 'translateX(-50%)', textAlign: 'center', width: 460}}>
      <div style={{width: 150, height: 150, borderRadius: 30, margin: '0 auto', background: good ? `linear-gradient(140deg,${C.violet},${C.teal})` : '#2a2620', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 74, fontWeight: 900, color: '#fff', boxShadow: good ? `0 0 50px ${C.teal}66` : 'none'}}>B</div>
      <div style={{marginTop: 30, fontSize: 40, fontWeight: 900, color: good ? C.ink : '#6b5a4a'}}>DEIN LOGO</div>
      <div style={{marginTop: 18, height: 16, width: 320, margin: '18px auto 0', borderRadius: 6, background: accent, opacity: good ? 0.8 : 0.4}} />
      <div style={{marginTop: 12, height: 16, width: 240, margin: '12px auto 0', borderRadius: 6, background: accent, opacity: good ? 0.6 : 0.3}} />
      <div style={{marginTop: 34, width: 210, height: 66, margin: '34px auto 0', borderRadius: 14, background: good ? C.violet : '#2a2620', boxShadow: good ? `0 0 26px ${C.violet}66` : 'none'}} />
    </div>
  );
};

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.teal}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 60px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 25, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 10}}>{kicker}</div>}
    <div style={{fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.14, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <Mirror quality={0.15} f={f}><Brand good={false} /></Mirror>
      <Caption top={40} main={<>Kunden sehen nicht dich.<br />Sie sehen dein <span style={{color: C.teal}}>Spiegelbild</span>.</>} o={a} ty={(1 - a) * 20} />
    </AbsoluteFill>
  );
};

const OldScene = () => {
  const f = useCurrentFrame();
  const lab = spring({frame: f - 16, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Mirror quality={0.14} f={f}><Brand good={false} /></Mirror>
      <Caption top={1470} kicker="EIN ALTES SPIEGELBILD" main={<>Verzerrt. Verstaubt.<br /><span style={{color: C.red}}>Von gestern.</span></>} o={lab} ty={(1 - lab) * 16} kcol={C.red} />
    </AbsoluteFill>
  );
};

const PolishScene = () => {
  const f = useCurrentFrame();
  const q = interpolate(f, [20, 70], [0.14, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const good = f > 44;
  // Politur-Wisch
  const wipe = interpolate(f, [16, 60], [-400, 900], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lab = spring({frame: f - 70, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <Mirror quality={q} f={f}><Brand good={good} /></Mirror>
      {f < 66 && <div style={{position: 'absolute', left: wipe, top: CY - 460, width: 180, height: 920, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)', transform: 'rotate(12deg)', filter: 'blur(6px)', zIndex: 20}} />}
      <Caption top={1470} kicker="EIN GEPFLEGTES" main={<>Gestochen scharf.<br /><span style={{color: C.teal}}>Sofort Vertrauen.</span></>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const LineScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <div style={{opacity: a, transform: `scale(${0.92 + a * 0.08})`}}>
        <div style={{fontSize: 30, fontWeight: 800, letterSpacing: 4, color: C.gold, marginBottom: 16}}>DEINE MARKE, GESPIEGELT</div>
        <div style={{fontSize: 60, fontWeight: 900, color: C.ink, lineHeight: 1.14}}>Deine Website ist dein<br /><span style={{color: C.teal}}>Spiegelbild</span> im Netz.</div>
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
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Poliere dein Spiegelbild <span style={{color: C.teal}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 860, lineHeight: 1.3}}>Ehrlich: Wie alt ist DEIN Spiegelbild? Jahre ↓</div>
    </AbsoluteFill>
  );
};

export const DerSpiegel = () => (
  <AbsoluteFill style={{background: '#08070c', fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={OLD}><OldScene /></Sequence>
    <Sequence from={HOOK + OLD} durationInFrames={POLISH}><PolishScene /></Sequence>
    <Sequence from={HOOK + OLD + POLISH} durationInFrames={LINE}><LineScene /></Sequence>
    <Sequence from={HOOK + OLD + POLISH + LINE} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.08} vignette={0.84} gradeProps={{a: 'rgba(124,92,255,0.10)', b: 'rgba(52,227,208,0.10)'}} />
  </AbsoluteFill>
);
