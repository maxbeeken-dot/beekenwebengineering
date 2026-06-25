import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, Easing} from 'remotion';

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

// Callout-Pin (problem/fix)
const Pin = ({x, y, label, color, show}) => {
  const p = spring({frame: show, fps: 30, config:{damping: 13, mass: 0.6}});
  return (
    <div style={{position:'absolute', left:x, top:y, transform:`scale(${p})`, opacity: p}}>
      <div style={{padding:'10px 18px', borderRadius: 12, background: color, color:'#0b0b10', fontSize: 26, fontWeight: 800, whiteSpace:'nowrap', boxShadow:'0 8px 24px rgba(0,0,0,0.4)'}}>{label}</div>
    </div>
  );
};

// Veraltete, überladene Seite
const OldSite = ({frame}) => {
  const shake = Math.sin(frame*0.8)*1.4;
  return (
    <div style={{width: 660, height: 920, background:'#f3ead2', borderRadius: 20, overflow:'hidden', transform:`translateX(${shake}px)`, boxShadow:'0 30px 80px rgba(0,0,0,0.5)', border:`1px solid ${C.border}`}}>
      <div style={{height: 58, background:'#7b1fa2', display:'flex', alignItems:'center', padding:'0 18px', gap: 10}}>
        <div style={{color:'#ffeb3b', fontSize: 26, fontFamily:'Comic Sans MS, cursive', fontWeight:700}}>Müller GmbH ★★★</div>
      </div>
      <div style={{height: 56, background:'#c2185b', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize: 24, fontFamily:'Comic Sans MS, cursive'}}>HOME | ÜBER UNS | KONTAKT | IMPRESSUM | LINKS | NEWS</div>
      <div style={{padding: 20}}>
        <div style={{height: 90, background:'#ff5722', borderRadius: 4, marginBottom: 14, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize: 30, fontFamily:'Comic Sans MS, cursive', textShadow:'2px 2px #000'}}>🔥 SUPER ANGEBOTE 🔥</div>
        <div style={{display:'flex', gap: 10, marginBottom: 14}}>
          <div style={{flex:1, height: 130, background:'#8d6e63', borderRadius:2}} />
          <div style={{flex:1, height: 130, background:'#a1887f', borderRadius:2}} />
          <div style={{flex:1, height: 130, background:'#6d4c41', borderRadius:2}} />
        </div>
        {[0,1,2,3,4].map(i=>(<div key={i} style={{height: 14, background:'#b59f73', marginBottom: 9, width: `${95-i*4}%`}} />))}
        <div style={{marginTop: 12, height: 40, background:'#388e3c', borderRadius:2, width:'55%', color:'#fff', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Comic Sans MS'}}>Hier klicken!!!</div>
        <div style={{marginTop: 14, fontSize: 18, color:'#7b1fa2', fontFamily:'Comic Sans MS'}}>Besucherzähler: 000142 | Beste Ansicht in IE6</div>
      </div>
    </div>
  );
};

// Moderne, klare Seite
const NewSite = ({frame}) => {
  const glow = 0.4 + Math.sin(frame*0.12)*0.15;
  return (
    <div style={{width: 660, height: 920, background:'#0d0c12', borderRadius: 20, overflow:'hidden', boxShadow:`0 30px 90px rgba(124,92,255,${glow})`, border:`1px solid ${C.border}`}}>
      <div style={{height: 64, background: C.card, display:'flex', alignItems:'center', padding:'0 24px', gap: 14, borderBottom:`1px solid ${C.border}`}}>
        <div style={{color: C.teal, fontSize: 22, fontWeight: 800, letterSpacing: 1}}>MÜLLER</div>
        <div style={{marginLeft:'auto', display:'flex', gap: 22, color: C.muted, fontSize: 20}}><span>Leistungen</span><span>Projekte</span><span>Kontakt</span></div>
      </div>
      <div style={{padding: 44}}>
        <div style={{fontSize: 26, color: C.teal, fontWeight: 700, marginBottom: 16}}>Handwerk mit Anspruch</div>
        <div style={{fontSize: 60, color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 22}}>Bauen, das<br/><span style={{color: C.violet}}>überzeugt.</span></div>
        <div style={{height: 14, background: C.cardHi, borderRadius: 99, marginBottom: 12, width:'88%'}} />
        <div style={{height: 14, background: C.cardHi, borderRadius: 99, marginBottom: 12, width:'72%'}} />
        <div style={{marginTop: 26, height: 56, width: 240, background: C.violet, borderRadius: 12, color:'#fff', fontWeight: 700, fontSize: 24, display:'flex', alignItems:'center', justifyContent:'center'}}>Angebot anfragen</div>
        <div style={{display:'flex', gap: 14, marginTop: 34}}>{[0,1,2].map(i=>(<div key={i} style={{flex:1, height: 140, background: C.card, border:`1px solid ${C.border}`, borderRadius: 14}} />))}</div>
      </div>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const flash = f < 5 ? interpolate(f,[0,5],[0.85,0]) : 0;
  const pop = spring({frame: f, fps: 30, config:{damping: 12, mass: 0.6}});
  const blink = Math.sin(f*0.5) > 0;
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center', padding: 70}}>
      <AbsoluteFill style={{background:'#fff', opacity: flash}} />
      <div style={{transform:`scale(${0.85+pop*0.15})`, textAlign:'center'}}>
        <div style={{fontSize: 130, opacity: blink ? 1 : 0.3}}>🚨</div>
        <div style={{fontSize: 92, color: C.ink, fontWeight: 800, lineHeight: 1.02, marginTop: 8}}>Diese Website ist<br/>ein <span style={{color: C.red}}>Notfall.</span></div>
        <div style={{fontSize: 38, color: C.muted, marginTop: 24}}>Und kostet jeden Tag Kunden.</div>
      </div>
    </AbsoluteFill>
  );
};

const DiagnoseScene = () => {
  const f = useCurrentFrame();
  const enter = spring({frame: f, fps: 30, config:{damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center'}}>
      <div style={{position:'absolute', top: 84, left:0, right:0, textAlign:'center'}}>
        <Pill color={C.red} bg="rgba(255,84,104,0.12)">⛔ Vorher: 2012 angerufen</Pill>
      </div>
      <div style={{position:'relative', transform:`translateY(${(1-enter)*50}px) scale(0.9)`, opacity: enter}}>
        <OldSite frame={f} />
        <Pin x={-60} y={120} label="Überladen" color={C.red} show={f-20} />
        <Pin x={520} y={300} label="Unleserlich" color={C.red} show={f-35} />
        <Pin x={-90} y={560} label="Kein Vertrauen" color={C.red} show={f-50} />
        <Pin x={500} y={720} label="Verwirrend" color={C.red} show={f-65} />
      </div>
    </AbsoluteFill>
  );
};

const RettungScene = () => {
  const f = useCurrentFrame();
  const wipe = interpolate(f, [0, 26], [0, 100], {extrapolateRight:'clamp', easing: Easing.inOut(Easing.cubic)});
  const enter = spring({frame: f-12, fps: 30, config:{damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center'}}>
      <div style={{position:'absolute', top: 84, left:0, right:0, textAlign:'center'}}>
        <Pill color={C.teal} bg="rgba(52,227,208,0.12)">✅ Nachher: handgebaut</Pill>
      </div>
      <div style={{position:'relative', transform:`translateY(${(1-enter)*40}px)`, opacity: enter, clipPath:`inset(0 ${100-wipe}% 0 0)`}}>
        <NewSite frame={f} />
        <Pin x={24} y={150} label="Klar" color={C.teal} show={f-30} />
        <Pin x={470} y={360} label="Schnell" color={C.teal} show={f-45} />
        <Pin x={28} y={624} label="Vertrauenswürdig" color={C.teal} show={f-60} />
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
        <div style={{fontSize: 80, color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 30}}>Aus Besuchern<br/>werden <span style={{color: C.violet}}>Kunden.</span></div>
        <div style={{transform:`scale(${pulse})`, display:'inline-block', marginTop: 10}}>
          <div style={{padding:'26px 52px', background: C.violet, borderRadius: 18, color:'#fff', fontSize: 40, fontWeight: 800}}>Kommentier „WEB" → Rettungsplan</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebsiteRettung = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 720], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <AbsoluteFill style={{background:`radial-gradient(700px 700px at ${540+bgGlowX}px 760px, rgba(124,92,255,0.14), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={78}><HookScene /></Sequence>
      <Sequence from={78} durationInFrames={222}><DiagnoseScene /></Sequence>
      <Sequence from={300} durationInFrames={220}><RettungScene /></Sequence>
      <Sequence from={520} durationInFrames={200}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
