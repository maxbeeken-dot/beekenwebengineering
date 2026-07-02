import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";
const REVEAL = 250;

// Zahnarzt-Landingpage: sieht ok aus, hat aber KEINEN klaren Button (Antwort B).
const MockSite = () => (
  <div style={{height: '100%', background: '#0e1319', fontFamily: FONT, display: 'flex', flexDirection: 'column'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px'}}>
      <div style={{fontSize: 21, fontWeight: 800, color: '#fff'}}>Zahnarztpraxis Dr. Berg</div>
      <div style={{display: 'flex', gap: 14, color: '#7b8794', fontSize: 14, fontWeight: 600}}><span>Start</span><span>Leistungen</span><span>Kontakt</span></div>
    </div>
    <div style={{flex: 1, margin: '0 22px', borderRadius: 14, background: 'linear-gradient(140deg,#173042,#0d1a24)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 26}}>
      <div style={{fontSize: 38, fontWeight: 800, color: '#fff', lineHeight: 1.12}}>Ihr Lächeln in<br />besten Händen.</div>
      <div style={{fontSize: 17, color: '#9fb0bd', marginTop: 12, maxWidth: 420}}>Moderne Zahnheilkunde für die ganze Familie. Sanft, ehrlich und mit viel Erfahrung seit über 20 Jahren.</div>
    </div>
    <div style={{display: 'flex', gap: 12, padding: 22}}>
      <div style={{flex: 1, height: 58, borderRadius: 10, background: '#141b22'}} />
      <div style={{flex: 1, height: 58, borderRadius: 10, background: '#141b22'}} />
      <div style={{flex: 1, height: 58, borderRadius: 10, background: '#141b22'}} />
    </div>
  </div>
);

const Browser = ({children, w = 620, h = 480}) => (
  <div style={{width: w, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 55px rgba(0,0,0,0.5)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: C.cardHi, borderBottom: `1px solid ${C.border}`}}>
      <div style={{width: 10, height: 10, borderRadius: '50%', background: C.red}} />
      <div style={{width: 10, height: 10, borderRadius: '50%', background: C.gold}} />
      <div style={{width: 10, height: 10, borderRadius: '50%', background: C.teal}} />
      <div style={{marginLeft: 10, flex: 1, height: 18, background: C.card, borderRadius: 9, paddingLeft: 10, color: C.muted, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center'}}>zahnarzt-dr-berg.de</div>
    </div>
    <div style={{height: h}}>{children}</div>
  </div>
);

const OPTIONS = [
  {k: 'A', text: 'Zu wenig Text', correct: false},
  {k: 'B', text: 'Kein klarer Button (CTA fehlt)', correct: true},
  {k: 'C', text: 'Falsche Schriftart', correct: false},
];

const Option = ({k, text, correct, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15}});
  const revealed = f >= REVEAL;
  const bg = !revealed ? C.card : correct ? 'rgba(52,227,208,0.16)' : C.card;
  const border = !revealed ? C.border : correct ? C.teal : C.border;
  const dim = revealed && !correct ? 0.4 : 1;
  return (
    <div style={{
      opacity: p * dim, transform: `translateX(${(1 - p) * -30}px)`,
      display: 'flex', alignItems: 'center', gap: 16, width: 760,
      background: bg, border: `2px solid ${border}`, borderRadius: 14, padding: '16px 22px',
    }}>
      <div style={{width: 48, height: 48, borderRadius: 12, background: revealed && correct ? C.teal : C.cardHi, color: revealed && correct ? '#06140f' : C.muted, fontWeight: 900, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{k}</div>
      <span style={{flex: 1, color: C.ink, fontWeight: 700, fontSize: 32}}>{text}</span>
      {revealed && correct && <span style={{fontSize: 32}}>✅</span>}
    </div>
  );
};

const Stage = () => {
  const f = useCurrentFrame();
  const title = spring({frame: f, fps: 30, config: {damping: 14}});
  const guessPulse = 1 + Math.sin(f * 0.18) * 0.05;
  const guessOut = interpolate(f, [REVEAL - 15, REVEAL], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const explainIn = interpolate(f, [REVEAL + 20, REVEAL + 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 44px', gap: 26}}>
      <div style={{opacity: title, transform: `translateY(${(1 - title) * -24}px)`, textAlign: 'center'}}>
        <div style={{fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.08}}>Welcher Fehler kostet<br />hier <span style={{color: C.red}}>Kunden</span>?</div>
      </div>
      <Browser><MockSite /></Browser>
      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        {OPTIONS.map((o, i) => <Option key={o.k} {...o} delay={20 + i * 26} />)}
      </div>
      <div style={{position: 'relative', height: 90, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'absolute', opacity: guessOut, transform: `scale(${guessPulse})`, fontSize: 46, fontWeight: 900, color: C.ink}}>A, B oder C? 🤔</div>
        <div style={{position: 'absolute', opacity: explainIn, fontSize: 30, color: C.muted, fontWeight: 700, textAlign: 'center', maxWidth: 820, lineHeight: 1.25}}>
          Schöne Seite — aber kein Button. Der Besucher weiß nicht, <span style={{color: C.teal}}>was er tun soll</span>. → keine Termine.
        </div>
      </div>
    </AbsoluteFill>
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
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 24}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 66, color: C.ink, fontWeight: 900, lineHeight: 1.1}}>Lagst du <span style={{color: C.violet}}>richtig</span>?</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 42}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 46px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 38, fontWeight: 900}}>👇 A, B oder C? Schreib's rein</div>
        </div>
        <div style={{marginTop: 34, fontSize: 34, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WelcherFehler = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 560], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${540 + bgGlowX}px 880px, rgba(255,84,104,0.11), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={460}><Stage /></Sequence>
      <Sequence from={460} durationInFrames={100}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
