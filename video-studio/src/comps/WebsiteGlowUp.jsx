import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const Counter = ({from, to, frame, dur, color, suffix=''}) => {
  const p = interpolate(frame, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const v = Math.round(from + (to - from) * p);
  return <span style={{color, fontVariantNumeric: 'tabular-nums'}}>{v}{suffix}</span>;
};

const ScoreRing = ({score, color, size=220, frame, delay=0}) => {
  const r = size/2 - 16;
  const circ = 2 * Math.PI * r;
  const p = interpolate(frame - delay, [0, 35], [0, score/100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
      <circle cx={size/2} cy={size/2} r={r} stroke={C.border} strokeWidth={14} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={14} fill="none" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - p)} />
    </svg>
  );
};

// Hässliche Baukasten-Seite (Before)
const UglySite = ({frame}) => {
  const shake = Math.sin(frame * 0.9) * 1.2;
  return (
    <div style={{width: 620, height: 900, background: '#e9e6df', borderRadius: 22, overflow: 'hidden',
      transform: `translateX(${shake}px)`, boxShadow: '0 30px 80px rgba(0,0,0,0.5)', border: `1px solid ${C.border}`}}>
      <div style={{height: 64, background: '#c9c4b8', display: 'flex', alignItems: 'center', padding: '0 22px', gap: 14}}>
        <div style={{width: 16, height: 16, borderRadius: 99, background: '#ff5f56'}} />
        <div style={{width: 16, height: 16, borderRadius: 99, background: '#ffbd2e'}} />
        <div style={{width: 16, height: 16, borderRadius: 99, background: '#27c93f'}} />
        <div style={{marginLeft: 18, color: '#7a756a', fontSize: 24, fontFamily: 'Comic Sans MS, cursive'}}>meine-firma-webseite.de</div>
      </div>
      <div style={{padding: 30}}>
        <div style={{height: 70, background: '#d63b3b', borderRadius: 6, marginBottom: 16, display:'flex',alignItems:'center',justifyContent:'center', color:'#fff', fontSize: 30, fontFamily:'Comic Sans MS, cursive', letterSpacing: 1}}>★ SUPER ANGEBOTE ★</div>
        <div style={{display:'flex', gap: 14, marginBottom: 18}}>
          <div style={{flex:1, height: 220, background:'#bdb7a8', borderRadius:4}} />
          <div style={{flex:1, padding: 8}}>
            <div style={{height: 18, background:'#a39e90', marginBottom: 10, width:'90%'}} />
            <div style={{height: 18, background:'#a39e90', marginBottom: 10, width:'70%'}} />
            <div style={{height: 18, background:'#a39e90', marginBottom: 10, width:'80%'}} />
            <div style={{height: 18, background:'#a39e90', marginBottom: 10, width:'60%'}} />
            <div style={{marginTop: 16, height: 44, background:'#2e7d32', borderRadius: 4, width:'70%'}} />
          </div>
        </div>
        <div style={{height: 16, background:'#a39e90', marginBottom: 10, width:'95%'}} />
        <div style={{height: 16, background:'#a39e90', marginBottom: 10, width:'88%'}} />
        <div style={{height: 16, background:'#a39e90', marginBottom: 24, width:'92%'}} />
        {/* Spinner */}
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginTop: 30}}>
          <div style={{width: 54, height: 54, border: `6px solid #c9c4b8`, borderTopColor: '#d63b3b', borderRadius: 99,
            transform: `rotate(${frame * 22}deg)`}} />
          <div style={{marginTop: 16, color:'#8a8478', fontSize: 24}}>lädt…</div>
        </div>
      </div>
    </div>
  );
};

// Saubere handgeschriebene Seite (After)
const CleanSite = ({frame}) => {
  const glow = 0.4 + Math.sin(frame * 0.12) * 0.15;
  return (
    <div style={{width: 620, height: 900, background: '#0d0c12', borderRadius: 22, overflow: 'hidden',
      boxShadow: `0 30px 90px rgba(124,92,255,${glow})`, border: `1px solid ${C.border}`}}>
      <div style={{height: 64, background: C.card, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 14, borderBottom: `1px solid ${C.border}`}}>
        <div style={{width: 14, height: 14, borderRadius: 99, background: C.dim}} />
        <div style={{width: 14, height: 14, borderRadius: 99, background: C.dim}} />
        <div style={{width: 14, height: 14, borderRadius: 99, background: C.dim}} />
        <div style={{marginLeft: 18, color: C.muted, fontSize: 22, fontFamily: FONT}}>beekenwebengineering.com</div>
      </div>
      <div style={{padding: 40}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 2, marginBottom: 18}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 22, fontFamily: FONT}}>
          Websites, die<br/><span style={{color: C.violet}}>laden &amp; verkaufen.</span>
        </div>
        <div style={{height: 14, background: C.cardHi, borderRadius: 99, marginBottom: 12, width:'92%'}} />
        <div style={{height: 14, background: C.cardHi, borderRadius: 99, marginBottom: 12, width:'78%'}} />
        <div style={{display:'flex', gap: 14, marginTop: 30}}>
          <div style={{height: 56, background: C.violet, borderRadius: 12, width: 200, display:'flex',alignItems:'center',justifyContent:'center', color:'#fff', fontWeight:700, fontSize: 24}}>Projekt starten</div>
          <div style={{height: 56, background: 'transparent', border:`1px solid ${C.border}`, borderRadius: 12, width: 150, display:'flex',alignItems:'center',justifyContent:'center', color:C.ink, fontWeight:600, fontSize: 24}}>Arbeiten</div>
        </div>
        <div style={{display:'flex', gap: 14, marginTop: 36}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{flex:1, height: 150, background: C.card, border:`1px solid ${C.border}`, borderRadius: 14}} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Pill = ({children, color, bg}) => (
  <div style={{display:'inline-flex', alignItems:'center', gap: 12, padding: '14px 26px', borderRadius: 99,
    background: bg, color, fontSize: 32, fontWeight: 700, fontFamily: FONT}}>{children}</div>
);

export const WebsiteGlowUp = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // dezenter Grain/Atmosphäre
  const bgGlowX = interpolate(frame, [0, 450], [-200, 200]);

  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      {/* Hintergrund-Glow */}
      <AbsoluteFill style={{background: `radial-gradient(700px 700px at ${540+bgGlowX}px 700px, rgba(124,92,255,0.16), transparent 70%)`}} />

      {/* SZENE 1 — HOOK (0–70) */}
      <Sequence from={0} durationInFrames={72}>
        <HookScene />
      </Sequence>

      {/* SZENE 2 — BEFORE (72–196) */}
      <Sequence from={72} durationInFrames={124}>
        <BeforeScene />
      </Sequence>

      {/* SZENE 3 — TRANSFORMATION/AFTER (196–342) */}
      <Sequence from={196} durationInFrames={146}>
        <AfterScene />
      </Sequence>

      {/* SZENE 4 — CTA (342–450) */}
      <Sequence from={342} durationInFrames={108}>
        <CtaScene />
      </Sequence>
    </AbsoluteFill>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  // Pattern-Interrupt: schneller Flash + Wackeln in den ersten Frames
  const flash = f < 5 ? interpolate(f, [0,5], [0.9, 0]) : 0;
  const pop = spring({frame: f, fps: 30, config: {damping: 12, mass: 0.6}});
  const arrowY = Math.sin(f * 0.35) * 14;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 70}}>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
      <div style={{transform: `scale(${0.85 + pop*0.15})`, textAlign: 'center'}}>
        <div style={{fontSize: 34, color: C.teal, fontWeight: 700, letterSpacing: 3, marginBottom: 22}}>WEBSITE-CHECK</div>
        <div style={{fontSize: 96, color: C.ink, fontWeight: 800, lineHeight: 1.02, letterSpacing: -1}}>
          Die meisten<br/>Websites machen<br/><span style={{color: C.red}}>DIESEN Fehler.</span>
        </div>
        <div style={{fontSize: 120, marginTop: 20, transform: `translateY(${arrowY}px)`}}>👇</div>
      </div>
    </AbsoluteFill>
  );
};

const BeforeScene = () => {
  const f = useCurrentFrame();
  const enter = spring({frame: f, fps: 30, config: {damping: 16}});
  const load = interpolate(f, [10, 110], [0, 0.62], {extrapolateRight: 'clamp'}); // bleibt hängen
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center'}}>
        <Pill color={C.red} bg="rgba(255,84,104,0.12)">⛔ Baukasten-Website</Pill>
      </div>
      <div style={{transform: `translateY(${(1-enter)*60}px) scale(0.92)`, opacity: enter}}>
        <UglySite frame={f} />
      </div>
      {/* Ladebalken + Werte */}
      <div style={{position: 'absolute', bottom: 150, left: 70, right: 70}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom: 18}}>
          <div style={{fontSize: 40, color: C.ink, fontWeight: 700}}>Ladezeit <span style={{color: C.red}}>3,9s</span></div>
          <div style={{fontSize: 40, color: C.ink, fontWeight: 700}}>Score <span style={{color: C.red}}><Counter from={0} to={38} frame={f-15} dur={40} color={C.red}/></span>/100</div>
        </div>
        <div style={{height: 22, background: C.card, borderRadius: 99, overflow: 'hidden', border: `1px solid ${C.border}`}}>
          <div style={{height: '100%', width: `${load*100}%`, background: C.red, borderRadius: 99}} />
        </div>
        <div style={{marginTop: 22, fontSize: 38, color: C.muted, textAlign: 'center'}}>
          <span style={{color: C.red, fontWeight: 800}}>53%</span> springen ab, bevor sie lädt.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const AfterScene = () => {
  const f = useCurrentFrame();
  // Wipe von links über die ersten 24 Frames
  const wipe = interpolate(f, [0, 24], [0, 100], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const enter = spring({frame: f-10, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center'}}>
        <Pill color={C.teal} bg="rgba(52,227,208,0.12)">✅ Handgeschriebener Code</Pill>
      </div>
      <div style={{transform: `translateY(${(1-enter)*50}px)`, opacity: enter, clipPath: `inset(0 ${100-wipe}% 0 0)`}}>
        <CleanSite frame={f} />
      </div>
      <div style={{position: 'absolute', bottom: 150, left: 70, right: 70}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{textAlign:'center'}}>
            <ScoreRing score={100} color={C.teal} frame={f} delay={20} />
            <div style={{marginTop: -140, fontSize: 64, fontWeight: 800, color: C.teal}}>
              <Counter from={38} to={100} frame={f-20} dur={40} color={C.teal}/>
            </div>
            <div style={{marginTop: 86, fontSize: 30, color: C.muted}}>Lighthouse</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize: 110, fontWeight: 800, color: C.teal}}>0,4<span style={{fontSize: 54}}>s</span></div>
            <div style={{fontSize: 30, color: C.muted}}>Ladezeit · 10× schneller</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 14}});
  const pulse = 1 + Math.sin(f * 0.18) * 0.03;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <div style={{transform: `scale(${0.9 + pop*0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 26}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 84, color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 30}}>
          Deine Website,<br/>die <span style={{color: C.violet}}>verkauft.</span>
        </div>
        <div style={{transform: `scale(${pulse})`, display:'inline-block', marginTop: 10}}>
          <div style={{padding: '26px 52px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 40, fontWeight: 800}}>
            Kommentier „WEB" → Gratis-Analyse
          </div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};
