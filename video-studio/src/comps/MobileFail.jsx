import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const Pill = ({children, color, bg}) => (
  <div style={{display:'inline-flex', alignItems:'center', gap: 12, padding:'14px 28px', borderRadius: 99,
    background: bg, color, fontSize: 34, fontWeight: 700, fontFamily: FONT}}>{children}</div>
);

const Pin = ({x, y, label, color, show}) => {
  const p = spring({frame: show, fps: 30, config:{damping: 13, mass: 0.6}});
  return (
    <div style={{position:'absolute', left:x, top:y, transform:`scale(${p})`, opacity: p, zIndex: 5}}>
      <div style={{padding:'9px 16px', borderRadius: 11, background: color, color:'#0b0b10', fontSize: 24, fontWeight: 800, whiteSpace:'nowrap', boxShadow:'0 8px 24px rgba(0,0,0,0.45)'}}>{label}</div>
    </div>
  );
};

const Phone = ({children, broken}) => (
  <div style={{width: 460, height: 940, background:'#0d0c12', borderRadius: 52, border:`12px solid ${broken?'#3a2230':'#1c1b26'}`, boxShadow:'0 30px 90px rgba(0,0,0,0.55)', overflow:'hidden', position:'relative'}}>
    <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width: 160, height: 30, background:'#1c1b26', borderRadius:'0 0 18px 18px', zIndex: 4}} />
    <div style={{position:'absolute', inset:0, paddingTop: 44}}>{children}</div>
  </div>
);

// Kaputtes, nicht-responsives Layout (Desktop-Seite ins Handy gequetscht)
const BrokenSite = ({frame}) => {
  const jitter = Math.sin(frame*0.6)*2.5;
  const scroll = interpolate(frame, [0, 90], [0, 60], {extrapolateRight:'clamp'});
  return (
    <div style={{position:'absolute', inset:0, paddingTop: 44, transform:`translateX(${jitter}px)`}}>
      {/* zu breiter Header läuft rechts raus */}
      <div style={{height: 54, width: 760, background:'#c2185b', display:'flex', alignItems:'center', padding:'0 14px', gap: 16, color:'#fff', fontSize: 18, fontFamily:'Comic Sans MS, cursive'}}>
        LOGO · Home · Über uns · Leistungen · Referenzen · Kontakt · Impressum
      </div>
      {/* Bild ragt über den Rand */}
      <div style={{margin: '14px 0 14px 16px', width: 560, height: 180, background:'#8d6e63', borderRadius: 4}} />
      {/* winzige, zu breite Textzeilen */}
      <div style={{padding:'0 16px'}}>
        {[0,1,2,3,4,5,6].map(i=>(<div key={i} style={{height: 7, background:'#6d5d52', marginBottom: 8, width: 700-i*10}} />))}
      </div>
      {/* Button halb außerhalb */}
      <div style={{position:'absolute', left: 360, top: 470, height: 44, width: 220, background:'#2e7d32', borderRadius: 4, color:'#fff', fontSize: 18, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Comic Sans MS'}}>Jetzt anfragen!</div>
      {/* überlappende Box */}
      <div style={{position:'absolute', left: 20, top: 520, width: 300, height: 120, background:'rgba(123,31,162,0.85)', borderRadius: 4, color:'#fff', fontSize: 16, padding: 10, fontFamily:'Comic Sans MS'}}>Newsletter!! Jetzt abonnieren und nichts verpassen!!!</div>
      {/* horizontale Scrollbar als Symptom */}
      <div style={{position:'absolute', bottom: 14, left: 16, right: 60, height: 10, background:'#2a2730', borderRadius: 99}}>
        <div style={{width: 130, height:'100%', background:C.red, borderRadius:99, transform:`translateX(${scroll*2}px)`}} />
      </div>
    </div>
  );
};

// Sauberes, mobile-first Layout
const FixedSite = ({frame}) => {
  const glow = 0.35 + Math.sin(frame*0.12)*0.12;
  return (
    <div style={{position:'absolute', inset:0, paddingTop: 44, background:'#0d0c12'}}>
      <div style={{height: 60, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 22px', borderBottom:`1px solid ${C.border}`}}>
        <div style={{color: C.teal, fontWeight: 800, fontSize: 22, letterSpacing: 1}}>LOGO</div>
        <div style={{width: 30, height: 20, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>{[0,1,2].map(i=>(<div key={i} style={{height: 3, background:C.muted, borderRadius: 9}} />))}</div>
      </div>
      <div style={{padding: 26}}>
        <div style={{fontSize: 23, color: C.teal, fontWeight: 700, marginBottom: 12}}>Handwerk mit Anspruch</div>
        <div style={{fontSize: 44, color: C.ink, fontWeight: 800, lineHeight: 1.08, marginBottom: 18}}>Bauen, das<br/><span style={{color: C.violet}}>überzeugt.</span></div>
        <div style={{height: 12, background: C.cardHi, borderRadius: 99, marginBottom: 10, width:'92%'}} />
        <div style={{height: 12, background: C.cardHi, borderRadius: 99, marginBottom: 24, width:'78%'}} />
        <div style={{height: 64, width:'100%', background: C.violet, borderRadius: 14, color:'#fff', fontWeight: 700, fontSize: 26, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 10px 30px rgba(124,92,255,${glow})`}}>Jetzt anfragen</div>
        <div style={{marginTop: 22, display:'flex', flexDirection:'column', gap: 14}}>{[0,1].map(i=>(<div key={i} style={{height: 96, background: C.card, border:`1px solid ${C.border}`, borderRadius: 14}} />))}</div>
      </div>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const flash = f < 5 ? interpolate(f,[0,5],[0.85,0]) : 0;
  const pop = spring({frame: f, fps: 30, config:{damping: 12, mass: 0.6}});
  const tilt = Math.sin(f*0.3)*5;
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center', padding: 70}}>
      <AbsoluteFill style={{background:'#fff', opacity: flash}} />
      <div style={{transform:`scale(${0.85+pop*0.15})`, textAlign:'center'}}>
        <div style={{fontSize: 120, transform:`rotate(${tilt}deg)`}}>📱</div>
        <div style={{fontSize: 86, color: C.ink, fontWeight: 800, lineHeight: 1.04, marginTop: 10}}>So sieht deine Seite<br/>auf dem <span style={{color: C.red}}>Handy</span> aus.</div>
        <div style={{fontSize: 36, color: C.muted, marginTop: 22}}>Über 60% deiner Besucher sind hier.</div>
      </div>
    </AbsoluteFill>
  );
};

const BrokenScene = () => {
  const f = useCurrentFrame();
  const enter = spring({frame: f, fps: 30, config:{damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center'}}>
      <div style={{position:'absolute', top: 84, left:0, right:0, textAlign:'center'}}>
        <Pill color={C.red} bg="rgba(255,84,104,0.12)">⛔ Nicht responsive</Pill>
      </div>
      <div style={{position:'relative', transform:`translateY(${(1-enter)*50}px) scale(0.94)`, opacity: enter, marginTop: 40}}>
        <Phone broken><BrokenSite frame={f} /></Phone>
        <Pin x={-70} y={120} label="Text winzig" color={C.red} show={f-20} />
        <Pin x={330} y={300} label="Läuft seitlich raus" color={C.red} show={f-35} />
        <Pin x={-40} y={560} label="Überlappt" color={C.red} show={f-50} />
        <Pin x={300} y={520} label="Button unklickbar" color={C.red} show={f-65} />
      </div>
    </AbsoluteFill>
  );
};

const FixedScene = () => {
  const f = useCurrentFrame();
  const enter = spring({frame: f-8, fps: 30, config:{damping: 16}});
  const swipe = interpolate(f, [0, 24], [120, 0], {extrapolateRight:'clamp'});
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center'}}>
      <div style={{position:'absolute', top: 84, left:0, right:0, textAlign:'center'}}>
        <Pill color={C.teal} bg="rgba(52,227,208,0.12)">✅ Mobile-first gebaut</Pill>
      </div>
      <div style={{position:'relative', transform:`translateX(${swipe}px) translateY(${(1-enter)*40}px)`, opacity: enter, marginTop: 40}}>
        <Phone><FixedSite frame={f} /></Phone>
        <Pin x={-30} y={150} label="Lesbar" color={C.teal} show={f-26} />
        <Pin x={330} y={440} label="Daumenfreundlich" color={C.teal} show={f-40} />
        <Pin x={-20} y={680} label="Passt perfekt" color={C.teal} show={f-54} />
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config:{damping: 14}});
  const pulse = 1 + Math.sin(f*0.18)*0.03;
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center', textAlign:'center', padding: 70}}>
      <div style={{transform:`scale(${0.9+pop*0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 26}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 82, color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 30}}>Perfekt auf<br/><span style={{color: C.violet}}>jedem Gerät.</span></div>
        <div style={{transform:`scale(${pulse})`, display:'inline-block', marginTop: 10}}>
          <div style={{padding:'26px 52px', background: C.violet, borderRadius: 18, color:'#fff', fontSize: 40, fontWeight: 800}}>Kommentier „WEB" → Mobil-Check</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const MobileFail = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background:`radial-gradient(700px 700px at ${540+bgGlowX}px 760px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={78}><HookScene /></Sequence>
      <Sequence from={78} durationInFrames={262}><BrokenScene /></Sequence>
      <Sequence from={340} durationInFrames={220}><FixedScene /></Sequence>
      <Sequence from={560} durationInFrames={160}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
