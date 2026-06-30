import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const Browser = ({children}) => (
  <div style={{width: 760, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 22, overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,0.6)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', background: C.cardHi, borderBottom: `1px solid ${C.border}`}}>
      <div style={{width: 12, height: 12, borderRadius: '50%', background: C.red}} />
      <div style={{width: 12, height: 12, borderRadius: '50%', background: C.gold}} />
      <div style={{width: 12, height: 12, borderRadius: '50%', background: C.teal}} />
      <div style={{marginLeft: 14, flex: 1, height: 24, background: C.card, borderRadius: 12, paddingLeft: 14, color: C.muted, fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', fontFamily: FONT}}>deine-firma.de</div>
    </div>
    <div style={{height: 900, position: 'relative'}}>{children}</div>
  </div>
);

const UglySite = () => (
  <div style={{height: '100%', background: '#15a30a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, fontFamily: "'Comic Sans MS','Chalkboard SE',cursive"}}>
    <div style={{fontSize: 50, fontWeight: 900, color: '#ff1010', textShadow: '3px 3px #ffff00'}}>WILLKOMMEN!!!</div>
    <div style={{fontSize: 130, margin: '4px 0'}}>🚧🎉🔥</div>
    <div style={{fontSize: 30, color: '#0000ff', textDecoration: 'underline'}}>HIER KLICKEN für Angebote</div>
    <div style={{marginTop: 18, background: '#000', color: '#22ff22', fontFamily: 'monospace', padding: '6px 14px', fontSize: 24}}>Besucher: 000142</div>
    <div style={{marginTop: 16, fontSize: 24, color: '#fff'}}>🎵 Auto-Play-Musik AN</div>
    <div style={{marginTop: 18, padding: '12px 22px', background: '#ff00ff', color: '#fff', fontWeight: 900, fontSize: 26, border: '4px dashed #ffff00'}}>JETZT KAUFEN!!!</div>
  </div>
);

const ModernSite = () => (
  <div style={{height: '100%', background: '#0d0d12', padding: 32, fontFamily: FONT, display: 'flex', flexDirection: 'column'}}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30}}>
      <div style={{fontSize: 24, fontWeight: 800, color: C.ink}}>atelier.</div>
      <div style={{display: 'flex', gap: 18, color: C.muted, fontSize: 18, fontWeight: 600}}><span>Arbeiten</span><span>Über</span><span>Kontakt</span></div>
    </div>
    <div style={{marginTop: 'auto', marginBottom: 'auto'}}>
      <div style={{fontSize: 58, fontWeight: 800, color: C.ink, lineHeight: 1.08}}>Schön.<br />Schnell.<br /><span style={{color: C.violet}}>Verkauft.</span></div>
      <div style={{fontSize: 22, color: C.muted, marginTop: 16, fontWeight: 600}}>Handgemachte Websites für KMU.</div>
      <div style={{marginTop: 26, display: 'inline-block', background: C.violet, color: '#fff', fontWeight: 800, fontSize: 22, padding: '14px 28px', borderRadius: 12}}>Projekt anfragen →</div>
    </div>
  </div>
);

const Caption = ({text, color, pop = 1}) => (
  <div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', padding: '0 50px', fontFamily: FONT}}>
    <div style={{display: 'inline-block', fontSize: 58, fontWeight: 800, color, transform: `scale(${0.9 + pop * 0.1})`, textShadow: '0 4px 24px rgba(0,0,0,0.7)'}}>{text}</div>
  </div>
);

const TransformScene = () => {
  const f = useCurrentFrame();
  const flashAt = 130;
  const showModern = f >= flashAt + 2;
  const charge = interpolate(f, [80, flashAt], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shake = !showModern ? Math.sin(f * 1.7) * charge * 7 : 0;
  const flash = interpolate(f, [flashAt - 6, flashAt, flashAt + 12], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const settle = spring({frame: f - (flashAt + 2), fps: 30, config: {damping: 14}});
  const ringScale = 1.5 - charge * 0.52;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      {charge > 0 && !showModern && (
        <div style={{position: 'absolute', width: 980, height: 980, borderRadius: '50%', border: `6px solid ${C.violet}`, opacity: charge * 0.9, transform: `scale(${ringScale})`, boxShadow: `0 0 80px ${C.violet}`}} />
      )}
      <div style={{transform: `translateX(${shake}px) scale(${showModern ? (0.9 + settle * 0.1) : 1})`}}>
        <Browser>{showModern ? <ModernSite /> : <UglySite />}</Browser>
      </div>
      {!showModern && <Caption text="Würdest du HIER kaufen? 😬" color={C.red} />}
      {showModern && <Caption text="✨ Glow-Up in 1 Sekunde" color={C.teal} pop={settle} />}
      <AbsoluteFill style={{background: '#ffffff', opacity: flash, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

const Thumb = ({label, children, opacity, accent}) => (
  <div style={{opacity, transform: `translateY(${(1 - opacity) * 30}px)`, width: 430, position: 'relative'}}>
    <div style={{position: 'absolute', top: -22, left: -22, zIndex: 2, width: 72, height: 72, borderRadius: '50%', background: accent, color: '#06140f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900, boxShadow: '0 8px 24px rgba(0,0,0,0.5)'}}>{label}</div>
    <div style={{width: 430, height: 560, border: `3px solid ${accent}`, borderRadius: 18, overflow: 'hidden'}}>{children}</div>
  </div>
);

const ChoiceScene = () => {
  const f = useCurrentFrame();
  const head = spring({frame: f, fps: 30, config: {damping: 16}});
  const a = spring({frame: f - 14, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 30, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{background: C.bg, justifyContent: 'center', alignItems: 'center', padding: 50, fontFamily: FONT}}>
      <div style={{opacity: head, transform: `translateY(${(1 - head) * -20}px)`, fontSize: 62, fontWeight: 800, color: C.ink, textAlign: 'center', marginBottom: 40}}>Bei welcher kaufst du?</div>
      <div style={{display: 'flex', gap: 34}}>
        <Thumb label="A" opacity={a} accent={C.red}><UglySite /></Thumb>
        <Thumb label="B" opacity={b} accent={C.teal}><ModernSite /></Thumb>
      </div>
      <div style={{marginTop: 50, transform: `scale(${pulse})`, fontSize: 50, fontWeight: 900, color: C.violet}}>A oder B? 👇 Kommentier!</div>
      <div style={{marginTop: 22, fontSize: 30, color: C.muted, fontWeight: 700}}>beekenwebengineering.com</div>
    </AbsoluteFill>
  );
};

export const GlowUpSummoning = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 540], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={300}><TransformScene /></Sequence>
      <Sequence from={300} durationInFrames={240}><ChoiceScene /></Sequence>
    </AbsoluteFill>
  );
};
