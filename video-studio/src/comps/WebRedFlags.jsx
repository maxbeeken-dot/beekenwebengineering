import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, Easing} from 'remotion';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const Counter = ({from, to, frame, dur, color, suffix=''}) => {
  const p = interpolate(frame, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const v = (from + (to - from) * p);
  return <span style={{color, fontVariantNumeric: 'tabular-nums'}}>{v.toFixed(1)}{suffix}</span>;
};

const Pill = ({children, color, bg}) => (
  <div style={{display:'inline-flex', alignItems:'center', gap: 12, padding: '14px 28px', borderRadius: 99,
    background: bg, color, fontSize: 34, fontWeight: 700, fontFamily: FONT}}>{children}</div>
);

// Browser-Frame als Bühne für die Mock-Visuals
const Browser = ({children, url='deine-website.de', bad}) => (
  <div style={{width: 760, height: 760, background: bad ? '#e9e6df' : '#0d0c12', borderRadius: 24, overflow: 'hidden',
    boxShadow: '0 30px 90px rgba(0,0,0,0.55)', border: `1px solid ${C.border}`}}>
    <div style={{height: 66, background: bad ? '#c9c4b8' : C.card, display:'flex', alignItems:'center', padding:'0 24px', gap: 14, borderBottom: bad?'none':`1px solid ${C.border}`}}>
      <div style={{width: 15, height: 15, borderRadius: 99, background: '#ff5f56'}} />
      <div style={{width: 15, height: 15, borderRadius: 99, background: '#ffbd2e'}} />
      <div style={{width: 15, height: 15, borderRadius: 99, background: '#27c93f'}} />
      <div style={{marginLeft: 18, color: bad?'#7a756a':C.muted, fontSize: 24, fontFamily: bad?'Comic Sans MS, cursive':FONT}}>{url}</div>
    </div>
    <div style={{position:'relative', width:'100%', height:'calc(100% - 66px)'}}>{children}</div>
  </div>
);

// FLAG 1 — zu langsam
const Flag1 = () => {
  const f = useCurrentFrame();
  const t = 3.0 + Math.max(0, (f-20)) * 0.035; // Sekunden klettern
  const load = interpolate(f, [10, 90], [0.08, 0.55], {extrapolateRight:'clamp'});
  return (
    <Browser url="lahme-seite.de" bad>
      <div style={{padding: 40}}>
        <div style={{height: 80, background:'#d63b3b', borderRadius: 6, marginBottom: 22, display:'flex',alignItems:'center',justifyContent:'center', color:'#fff', fontSize: 30, fontFamily:'Comic Sans MS, cursive'}}>★ ANGEBOTE ★</div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginTop: 60}}>
          <div style={{width: 92, height: 92, border:'9px solid #c9c4b8', borderTopColor:'#d63b3b', borderRadius: 99, transform:`rotate(${f*20}deg)`}} />
          <div style={{marginTop: 26, color:'#8a8478', fontSize: 30}}>lädt…</div>
        </div>
        <div style={{position:'absolute', bottom: 34, left: 40, right: 40}}>
          <div style={{fontSize: 64, fontWeight: 800, color: C.red, textAlign:'center', fontVariantNumeric:'tabular-nums'}}>{t.toFixed(1)}s</div>
          <div style={{height: 18, background:'#cfc9bd', borderRadius: 99, overflow:'hidden', marginTop: 12}}>
            <div style={{height:'100%', width:`${load*100}%`, background:'#d63b3b'}} />
          </div>
        </div>
      </div>
    </Browser>
  );
};

// FLAG 2 — kaputt auf dem Handy
const Flag2 = () => {
  const f = useCurrentFrame();
  const jitter = Math.sin(f*0.6)*2;
  return (
    <div style={{width: 420, height: 760, background:'#0d0c12', borderRadius: 48, border:`10px solid #1c1b26`, boxShadow:'0 30px 90px rgba(0,0,0,0.55)', overflow:'hidden', position:'relative'}}>
      <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width: 150, height: 30, background:'#1c1b26', borderRadius:'0 0 18px 18px', zIndex:2}} />
      {/* überlaufende, kaputte Elemente */}
      <div style={{padding: 26, paddingTop: 50}}>
        <div style={{height: 60, width: 540, background:'#d63b3b', borderRadius: 6, marginBottom: 18, transform:`translateX(${jitter}px)`, color:'#fff', fontFamily:'Comic Sans MS, cursive', fontSize:24, display:'flex', alignItems:'center', paddingLeft:14}}>Willkommen auf unserer Seite!!!</div>
        <div style={{display:'flex', gap: 10, marginBottom: 16}}>
          <div style={{minWidth: 260, height: 150, background:'#bdb7a8', borderRadius:4}} />
          <div style={{minWidth: 260, height: 150, background:'#a39e90', borderRadius:4}} />
        </div>
        <div style={{height: 20, background:'#a39e90', marginBottom: 10, width: 520}} />
        <div style={{height: 20, background:'#a39e90', marginBottom: 10, width: 600}} />
        <div style={{height: 56, width: 320, background:'#2e7d32', borderRadius:4, marginTop: 18, transform:`translateX(${-jitter}px)`}} />
        <div style={{height: 20, background:'#a39e90', marginTop: 18, width: 580}} />
      </div>
      {/* horizontale Scrollbar als Zeichen für Overflow */}
      <div style={{position:'absolute', bottom: 10, left: 20, right: 120, height: 12, background:'#2a2730', borderRadius: 99}}>
        <div style={{width: 120, height:'100%', background:C.red, borderRadius:99, transform:`translateX(${interpolate(f,[0,90],[0,180],{extrapolateRight:'clamp'})}px)`}} />
      </div>
    </div>
  );
};

// FLAG 3 — kein klarer CTA
const Flag3 = () => {
  const f = useCurrentFrame();
  const wander = spring({frame: f, fps: 30, config:{damping: 200}});
  const cx = 360 + Math.sin(f*0.12)*180;
  const cy = 360 + Math.cos(f*0.16)*150;
  return (
    <Browser url="viel-text-keine-aktion.de">
      <div style={{padding: 44}}>
        <div style={{fontSize: 40, color: C.ink, fontWeight: 800, marginBottom: 22}}>Über uns über uns über uns</div>
        {[0,1,2,3,4,5].map(i=>(
          <div key={i} style={{height: 16, background: C.cardHi, borderRadius: 99, marginBottom: 14, width: `${92 - i*5}%`}} />
        ))}
        <div style={{marginTop: 22, fontSize: 24, color: C.muted}}>…und noch mehr Text ohne Ziel.</div>
        {/* suchender Cursor */}
        <div style={{position:'absolute', left: cx, top: cy, fontSize: 54, opacity: 0.9, transform:`scale(${0.9+wander*0.1})`}}>🖱️</div>
        <div style={{position:'absolute', left: cx+30, top: cy+50, fontSize: 30, color: C.red, fontWeight: 700}}>wo klicken?</div>
      </div>
    </Browser>
  );
};

const FlagScene = ({n, flag, title, fix, Visual}) => {
  const f = useCurrentFrame();
  const enter = spring({frame: f, fps: 30, config:{damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center'}}>
      <div style={{position:'absolute', top: 96, left: 0, right: 0, textAlign:'center'}}>
        <Pill color={C.red} bg="rgba(255,84,104,0.12)">🚩 Red Flag {n}/3</Pill>
        <div style={{fontSize: 76, color: C.ink, fontWeight: 800, lineHeight: 1.04, marginTop: 26, padding:'0 60px'}}>{title}</div>
      </div>
      <div style={{transform:`translateY(${(1-enter)*60}px) scale(${0.9+enter*0.1})`, opacity: enter, marginTop: 90}}>
        <Visual />
      </div>
      <div style={{position:'absolute', bottom: 130, left: 70, right: 70, textAlign:'center'}}>
        <span style={{fontSize: 38, color: C.teal, fontWeight: 700}}>✅ {fix}</span>
      </div>
    </AbsoluteFill>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const flash = f < 5 ? interpolate(f,[0,5],[0.85,0]) : 0;
  const pop = spring({frame: f, fps: 30, config:{damping: 12, mass: 0.6}});
  const wave = Math.sin(f*0.3)*10;
  return (
    <AbsoluteFill style={{justifyContent:'center', alignItems:'center', padding: 70}}>
      <AbsoluteFill style={{background:'#fff', opacity: flash}} />
      <div style={{transform:`scale(${0.85+pop*0.15})`, textAlign:'center'}}>
        <div style={{fontSize: 130, transform:`translateY(${wave}px)`}}>🚩</div>
        <div style={{fontSize: 96, color: C.ink, fontWeight: 800, lineHeight: 1.02, marginTop: 10}}>
          3 Zeichen, dass deine<br/>Website <span style={{color: C.red}}>Kunden kostet.</span>
        </div>
        <div style={{fontSize: 36, color: C.muted, marginTop: 26}}>Nummer 3 sehen die meisten nicht.</div>
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
        <div style={{fontSize: 84, color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 30}}>
          Keine Red Flags.<br/>Nur eine Seite, die <span style={{color: C.violet}}>verkauft.</span>
        </div>
        <div style={{transform:`scale(${pulse})`, display:'inline-block', marginTop: 10}}>
          <div style={{padding:'26px 52px', background: C.violet, borderRadius: 18, color:'#fff', fontSize: 40, fontWeight: 800}}>Kommentier „WEB" → Gratis-Check</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebRedFlags = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 450], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <AbsoluteFill style={{background:`radial-gradient(700px 700px at ${540+bgGlowX}px 760px, rgba(255,84,104,0.12), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={60}><HookScene /></Sequence>
      <Sequence from={60} durationInFrames={98}><FlagScene n={1} title="Lädt langsamer als 3 Sekunden" fix="Handgeschriebener Code lädt in unter 1s" Visual={Flag1} /></Sequence>
      <Sequence from={158} durationInFrames={98}><FlagScene n={2} title="Kaputt auf dem Handy" fix="Mobile-first, sauber auf jedem Gerät" Visual={Flag2} /></Sequence>
      <Sequence from={256} durationInFrames={98}><FlagScene n={3} title="Kein klarer nächster Schritt" fix="Ein klarer CTA, der den Besucher führt" Visual={Flag3} /></Sequence>
      <Sequence from={354} durationInFrames={96}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
