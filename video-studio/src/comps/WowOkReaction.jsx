import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, Easing} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";
const COMIC = "'Comic Sans MS','Chalkboard SE','Comic Neue',cursive";

const VIEW_H = 1180;
const CONTENT_H = 2500;
const SCROLL_MAX = CONTENT_H - VIEW_H;

// Reaction-Sticker (unten, tauschen sich aus)
const REACTIONS = [
  {f: 55, text: 'Musik geht sofort an… ok. 🔊', big: false},
  {f: 145, text: 'ein Handschlag-Stockfoto 🤝', big: false},
  {f: 235, text: '…ein Besucherzähler?? 😳', big: false},
  {f: 325, text: '5 Schriftarten. wow.', big: false},
  {f: 405, text: 'wow. ok. 💀', big: true},
];

const Blink = ({children, style, speed = 0.35}) => {
  const f = useCurrentFrame();
  const o = Math.sin(f * speed) > 0 ? 1 : 0.15;
  return <div style={{...style, opacity: o}}>{children}</div>;
};

const BadSite = () => {
  const f = useCurrentFrame();
  const marquee = ((f * 6) % 900) - 450;
  return (
    <div style={{width: '100%', height: CONTENT_H, background: '#f3f1e8', color: '#111', display: 'flex', flexDirection: 'column'}}>
      {/* 1 – Rainbow Willkommen + Musik */}
      <div style={{background: '#00008b', padding: '26px 20px', textAlign: 'center'}}>
        <div style={{fontFamily: COMIC, fontSize: 60, fontWeight: 900, background: 'linear-gradient(90deg,#ff0000,#ff8a00,#ffe600,#00c853,#2962ff,#aa00ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>WILLKOMMEN!!!</div>
        <div style={{marginTop: 8, display: 'inline-block', background: '#ffea00', color: '#b00', fontWeight: 800, fontSize: 22, padding: '4px 12px', borderRadius: 4, fontFamily: COMIC}}>🔊 Musik läuft automatisch</div>
      </div>
      {/* 2 – Auto-Play Video */}
      <div style={{background: '#000', height: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>
        <div style={{width: 96, height: 96, borderRadius: '50%', background: '#e50914', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#fff'}}>▶</div>
        <div style={{color: '#fff', fontFamily: COMIC, fontSize: 26}}>UNSER IMAGEFILM (Ton an!)</div>
      </div>
      {/* 3 – Stock-Handschlag */}
      <div style={{height: 430, background: 'linear-gradient(135deg,#c9d6e5,#8fa3bf)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
        <div style={{fontSize: 150}}>🤝</div>
        <div style={{fontFamily: 'Georgia,serif', fontSize: 40, fontStyle: 'italic', color: '#22364d', fontWeight: 700}}>Ihr Partner für Erfolg.</div>
      </div>
      {/* 4 – Marquee + Besucherzähler + IE */}
      <div style={{background: '#111', padding: '18px 0', overflow: 'hidden'}}>
        <div style={{transform: `translateX(${marquee}px)`, whiteSpace: 'nowrap', color: '#00ff5a', fontFamily: COMIC, fontSize: 34, fontWeight: 900}}>★★★ NEUE ANGEBOTE ★★★ JETZT ZUSCHLAGEN ★★★</div>
      </div>
      <div style={{background: '#fff', padding: '30px 20px', textAlign: 'center'}}>
        <div style={{fontFamily: COMIC, fontSize: 30, color: '#333'}}>Sie sind Besucher Nr.</div>
        <div style={{display: 'inline-block', marginTop: 10, background: '#000', color: '#0f0', fontFamily: 'Courier New,monospace', fontSize: 52, fontWeight: 900, padding: '6px 16px', letterSpacing: 6}}>00042</div>
        <div style={{marginTop: 14, color: '#777', fontSize: 20, fontFamily: 'Times New Roman,serif'}}>Beste Ansicht mit Internet Explorer 6</div>
      </div>
      {/* 5 – Font-Chaos + Blink-Button */}
      <div style={{flex: 1, background: '#fffbe6', padding: '28px 22px', display: 'flex', flexDirection: 'column', gap: 12}}>
        <span style={{fontFamily: 'Impact,sans-serif', fontSize: 34, color: '#c00'}}>ÜBER UNS</span>
        <span style={{fontFamily: COMIC, fontSize: 24, color: '#0a0'}}>Wir sind ein tolles Team seit 1998.</span>
        <span style={{fontFamily: 'Courier New,monospace', fontSize: 24, color: '#00a'}}>Qualität ist unser Versprechen!!!</span>
        <span style={{fontFamily: 'Georgia,serif', fontSize: 24, fontStyle: 'italic', color: '#a0a'}}>Rufen Sie uns noch heute an.</span>
        <Blink style={{marginTop: 12, alignSelf: 'center', background: '#ff0', border: '4px dashed #f00', color: '#f00', fontFamily: COMIC, fontWeight: 900, fontSize: 34, padding: '14px 30px', borderRadius: 6}}>👉 HIER KLICKEN!!! 👈</Blink>
      </div>
    </div>
  );
};

const Stage = () => {
  const f = useCurrentFrame();
  const povIn = spring({frame: f, fps: 30, config: {damping: 16}});
  const cardIn = spring({frame: f - 8, fps: 30, config: {damping: 15}});
  const scrollP = interpolate(f, [40, 430], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const offsetY = -SCROLL_MAX * scrollP;
  const active = REACTIONS.filter((r) => f >= r.f).pop();
  // Popup taucht am Ende auf
  const popup = spring({frame: f - 380, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 66, left: 0, right: 0, textAlign: 'center', opacity: povIn, zIndex: 25}}>
        <div style={{fontSize: 28, color: C.teal, fontWeight: 800, letterSpacing: 3}}>🎬 REACTION</div>
        <div style={{fontSize: 50, color: C.ink, fontWeight: 900, marginTop: 6}}>Diese Website ist… 👀</div>
      </div>

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: 30, paddingBottom: 360}}>
        <div style={{opacity: cardIn, transform: `translateY(${(1 - cardIn) * 40}px)`, width: 880, position: 'relative'}}>
          <div style={{width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 7, padding: '13px 18px', background: C.cardHi, borderBottom: `1px solid ${C.border}`}}>
              <div style={{width: 11, height: 11, borderRadius: '50%', background: C.red}} />
              <div style={{width: 11, height: 11, borderRadius: '50%', background: C.gold}} />
              <div style={{width: 11, height: 11, borderRadius: '50%', background: C.teal}} />
              <div style={{marginLeft: 12, flex: 1, height: 22, background: C.card, borderRadius: 11, paddingLeft: 12, color: C.muted, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center'}}>mueller-und-sohn-gmbh.de</div>
            </div>
            <div style={{height: VIEW_H, overflow: 'hidden', position: 'relative'}}>
              <div style={{position: 'absolute', top: 0, left: 0, right: 0, transform: `translateY(${offsetY}px)`}}><BadSite /></div>
              {/* nerv-Popup */}
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: popup}}>
                <div style={{transform: `scale(${0.7 + popup * 0.3})`, background: '#fff', border: '5px solid #ff2d55', borderRadius: 10, padding: '26px 30px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
                  <div style={{fontFamily: COMIC, fontSize: 34, fontWeight: 900, color: '#111'}}>📧 ABONNIERE JETZT!!!</div>
                  <div style={{marginTop: 12, background: '#ff2d55', color: '#fff', fontWeight: 900, fontSize: 24, padding: '10px 22px', borderRadius: 6, display: 'inline-block'}}>JA, ich will Spam</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Reaction-Sticker */}
      {active && (
        <div style={{position: 'absolute', bottom: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 30}}>
          <ReactionSticker key={active.f} text={active.text} big={active.big} />
        </div>
      )}
    </AbsoluteFill>
  );
};

const ReactionSticker = ({text, big}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f, fps: 30, config: {damping: 11, mass: 0.6}});
  const wobble = Math.sin(f * 0.5) * (big ? 2.5 : 1.2);
  return (
    <div style={{
      transform: `scale(${0.6 + p * 0.4}) rotate(${wobble}deg)`, opacity: p,
      background: big ? C.red : '#fff', color: big ? '#fff' : '#111',
      fontWeight: 900, fontSize: big ? 74 : 44, padding: big ? '24px 44px' : '18px 34px',
      borderRadius: 20, boxShadow: '0 14px 40px rgba(0,0,0,0.5)', border: big ? 'none' : `3px solid ${C.ink}`,
      maxWidth: 900, textAlign: 'center',
    }}>{text}</div>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 14}});
  const line2 = spring({frame: f - 18, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 26}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 60, color: C.ink, fontWeight: 900, lineHeight: 1.12}}>Deine Seite sieht<br />hoffentlich <span style={{color: C.teal}}>anders</span> aus.</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 46}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 46px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 900}}>👇 Welche Sünde ist am schlimmsten?</div>
        </div>
        <div style={{marginTop: 34, fontSize: 34, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WowOkReaction = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 560], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.12), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={460}><Stage /></Sequence>
      <Sequence from={460} durationInFrames={100}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
