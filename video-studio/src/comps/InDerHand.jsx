import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {C, FONT, Atmosphere, rng} from './Cine.jsx';

// Cinematic: Deine Website in EINER Hand. 8 von 10 Besuchern sind mobil. Kaputt
// am Handy = weg. Responsive = Daumen tippt, Kunde bleibt. Botschaft: Mobile-First.
// 30fps → 75 + 165 + 165 + 120 + 75 = 600 = 20,0 s
const HOOK = 75, BROKEN = 165, FIX = 165, TAP = 120, CTA = 75;
const PX = 540, PW = 384, PH = 792, PTOP = 540;

// Handflächen-Licht unter dem Telefon (das "cinematic in der Hand").
const PalmGlow = ({o = 1, col = C.violet}) => (
  <div style={{position: 'absolute', left: PX - 360, top: PTOP + PH - 150, width: 720, height: 360, borderRadius: '50%', background: `radial-gradient(closest-side, ${col}44, transparent 72%)`, filter: 'blur(20px)', opacity: o}} />
);

// Telefon-Rahmen. children = Bildschirminhalt.
const Phone = ({children, accent = C.teal, shake = 0, tilt = 0}) => (
  <div style={{position: 'absolute', left: PX - PW / 2 + shake, top: PTOP, width: PW, height: PH, transform: `rotate(${tilt}deg)`, transformOrigin: '50% 100%'}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 54, background: '#0b0b11', border: '10px solid #191821', boxShadow: `0 40px 100px rgba(0,0,0,0.65), 0 0 60px ${accent}22`}} />
    <div style={{position: 'absolute', left: 10, top: 10, right: 10, bottom: 10, borderRadius: 44, overflow: 'hidden', background: '#0e0d14'}}>
      {/* Notch */}
      <div style={{position: 'absolute', left: '50%', top: 14, transform: 'translateX(-50%)', width: 120, height: 26, borderRadius: 14, background: '#050509', zIndex: 5}} />
      {children}
    </div>
  </div>
);

// Kaputte mobile Seite: Inhalt zu breit, quillt seitlich raus, winzige Tap-Ziele.
const BrokenScreen = ({f}) => {
  const jitter = Math.sin(f * 0.7) * 3;
  return (
    <AbsoluteFill style={{background: '#100e15'}}>
      {/* Header quillt raus */}
      <div style={{position: 'absolute', left: 40 + jitter, top: 60, width: 640, height: 40, background: C.red, opacity: 0.7, borderRadius: 6}} />
      <div style={{position: 'absolute', left: 40, top: 130, width: 760, height: 12, background: '#fff', opacity: 0.22, borderRadius: 3}} />
      <div style={{position: 'absolute', left: 40, top: 156, width: 720, height: 12, background: '#fff', opacity: 0.18, borderRadius: 3}} />
      {/* Bild zu groß */}
      <div style={{position: 'absolute', left: 40, top: 210, width: 620, height: 220, background: 'linear-gradient(120deg,#241f2b,#191722)', border: '1px solid #33313c', borderRadius: 8}} />
      {/* winzige, überlappende Buttons am Rand */}
      <div style={{position: 'absolute', right: -30, top: 470, width: 150, height: 34, background: '#26242f', borderRadius: 6}} />
      <div style={{position: 'absolute', right: -70, top: 512, width: 150, height: 34, background: '#26242f', borderRadius: 6}} />
      {/* horizontale Scrollbar-Andeutung */}
      <div style={{position: 'absolute', left: 20, bottom: 60, width: 500, height: 6, background: C.red, opacity: 0.5, borderRadius: 3}} />
      <div style={{position: 'absolute', left: 20, bottom: 40, fontSize: 20, color: C.red, fontWeight: 800}}>← seitlich scrollen…</div>
    </AbsoluteFill>
  );
};

// Saubere responsive Seite.
const GoodScreen = ({f, tapped = false}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg,#141320,#100f18)'}}>
    <div style={{position: 'absolute', left: 30, top: 60, width: 150, height: 26, background: C.teal, borderRadius: 6}} />
    <div style={{position: 'absolute', right: 30, top: 60, display: 'flex', gap: 6}}>
      {[0, 1, 2].map((i) => <div key={i} style={{width: 26, height: 4, background: C.muted, borderRadius: 2}} />)}
    </div>
    <div style={{position: 'absolute', left: 30, top: 130, width: 300, height: 30, background: '#fff', opacity: 0.85, borderRadius: 5}} />
    <div style={{position: 'absolute', left: 30, top: 172, width: 260, height: 14, background: '#fff', opacity: 0.4, borderRadius: 4}} />
    <div style={{position: 'absolute', left: 30, top: 220, width: 304, height: 190, background: 'linear-gradient(120deg,#1c1a27,#15131e)', border: `1px solid ${C.border}`, borderRadius: 12}} />
    {/* großer, daumenfreundlicher CTA */}
    <div style={{position: 'absolute', left: 30, right: 30, top: 452, height: 66, background: tapped ? C.green : C.violet, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26, fontWeight: 900, boxShadow: `0 0 30px ${tapped ? C.green : C.violet}88`, transform: `scale(${tapped ? 0.96 : 1})`}}>
      {tapped ? 'Termin gebucht ✅' : 'Jetzt anfragen'}
    </div>
    <div style={{position: 'absolute', left: 30, right: 30, top: 540, display: 'flex', gap: 12}}>
      {[0, 1].map((i) => <div key={i} style={{flex: 1, height: 90, background: '#16151e', border: `1px solid ${C.border}`, borderRadius: 10}} />)}
    </div>
  </AbsoluteFill>
);

// Daumen, der von unten rechts hereinkommt und tippt.
const Thumb = ({reach = 0, press = 0}) => {
  const x = interpolate(reach, [0, 1], [PX + 220, PX + 40]);
  const y = interpolate(reach, [0, 1], [PTOP + PH + 120, PTOP + 470]);
  return (
    <div style={{position: 'absolute', left: x, top: y - press * 10, zIndex: 8, transform: 'rotate(-32deg)'}}>
      <div style={{width: 92, height: 150, borderRadius: '46px 46px 30px 30px', background: 'linear-gradient(160deg,#e9b48f,#c98c63)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}} />
      <div style={{position: 'absolute', left: 26, top: 8, width: 40, height: 30, borderRadius: '50%', background: '#f3c8a6', opacity: 0.6}} />
    </div>
  );
};

const Caption = ({top, kicker, main, o = 1, ty = 0, kcol = C.teal}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, textAlign: 'center', padding: '0 66px', opacity: o, transform: `translateY(${ty}px)`, zIndex: 40}}>
    {kicker && <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 5, color: kcol, marginBottom: 12}}>{kicker}</div>}
    <div style={{fontSize: 54, fontWeight: 900, color: C.ink, lineHeight: 1.15, letterSpacing: '-0.01em'}}>{main}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const rise = spring({frame: f, fps: 30, config: {damping: 15, mass: 0.9}});
  const a = spring({frame: f - 18, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill>
      <PalmGlow o={rise} />
      <div style={{transform: `translateY(${(1 - rise) * 300}px)`}}>
        <Phone accent={C.teal}><GoodScreen f={f} /></Phone>
      </div>
      <Caption top={250} main={<><span style={{color: C.teal}}>8 von 10</span> sehen dich<br />zuerst so. ↓</>} o={a} ty={(1 - a) * 20} />
    </AbsoluteFill>
  );
};

const BrokenScene = () => {
  const f = useCurrentFrame();
  const shake = f > 40 ? Math.sin(f * 0.8) * 5 : 0;
  const lab = spring({frame: f - 20, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(60% 44% at 50% 46%, ${C.red}10, transparent 70%)`}} />
      <PalmGlow col={C.red} />
      <Phone accent={C.red} shake={shake}><BrokenScreen f={f} /></Phone>
      <Caption top={250} kicker="NICHT RESPONSIVE" main={<>Zoomen. Wischen. <span style={{color: C.red}}>Weg.</span></>} o={lab} ty={(1 - lab) * 16} kcol={C.red} />
    </AbsoluteFill>
  );
};

const FixScene = () => {
  const f = useCurrentFrame();
  const snap = spring({frame: f - 6, fps: 30, config: {damping: 14, mass: 0.7}});
  const lab = spring({frame: f - 40, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <PalmGlow col={C.teal} />
      {/* "snap": kurzes Zusammenziehen ins Raster */}
      <div style={{transform: `scale(${0.96 + snap * 0.04})`}}>
        <Phone accent={C.teal}><GoodScreen f={f} /></Phone>
      </div>
      <Caption top={250} kicker="RESPONSIVE GEBAUT" main={<>Passt. In <span style={{color: C.teal}}>jede</span> Hand.</>} o={lab} ty={(1 - lab) * 16} />
    </AbsoluteFill>
  );
};

const TapScene = () => {
  const f = useCurrentFrame();
  const reach = interpolate(f, [0, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const press = f > 40 && f < 52 ? 1 : 0;
  const tapped = f >= 46;
  const a = spring({frame: f - 58, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill>
      <PalmGlow col={tapped ? C.green : C.violet} />
      <Phone accent={tapped ? C.green : C.teal}><GoodScreen f={f} tapped={tapped} /></Phone>
      <Thumb reach={reach} press={press} />
      {tapped && <Caption top={250} kicker="EIN DAUMEN. EIN KUNDE." main={<>Ein Tipp — und du hast<br /><span style={{color: C.green}}>die Anfrage</span>.</>} o={a} ty={(1 - a) * 16} kcol={C.green} />}
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
      <PalmGlow col={C.teal} o={0.6} />
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -16}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 10}}>Mobil gebaut. <span style={{color: C.teal}}>→</span></div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>beekenwebengineering.com</div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 31, fontWeight: 800, color: C.gold, maxWidth: 850, lineHeight: 1.3}}>Öffne DEINE Seite am Handy — passt sie? 📱 Ehrlich ↓</div>
    </AbsoluteFill>
  );
};

export const InDerHand = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
    <Sequence from={HOOK} durationInFrames={BROKEN}><BrokenScene /></Sequence>
    <Sequence from={HOOK + BROKEN} durationInFrames={FIX}><FixScene /></Sequence>
    <Sequence from={HOOK + BROKEN + FIX} durationInFrames={TAP}><TapScene /></Sequence>
    <Sequence from={HOOK + BROKEN + FIX + TAP} durationInFrames={CTA}><CtaScene /></Sequence>
    <Atmosphere grain={0.075} vignette={0.8} motes={10} gradeProps={{a: 'rgba(124,92,255,0.12)', b: 'rgba(52,227,208,0.10)'}} />
  </AbsoluteFill>
);
