import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const REVEAL = 235;

const Chrome = ({url, children, w = 466, h = 600}) => (
  <div style={{width: w, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 55px rgba(0,0,0,0.5)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: C.cardHi, borderBottom: `1px solid ${C.border}`}}>
      <div style={{width: 9, height: 9, borderRadius: '50%', background: C.red}} />
      <div style={{width: 9, height: 9, borderRadius: '50%', background: C.gold}} />
      <div style={{width: 9, height: 9, borderRadius: '50%', background: C.teal}} />
      <div style={{marginLeft: 10, flex: 1, height: 18, background: C.card, borderRadius: 9, paddingLeft: 10, color: C.muted, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center'}}>{url}</div>
    </div>
    <div style={{height: h}}>{children}</div>
  </div>
);

const Bar = ({w, c = '#2a2d34'}) => <div style={{height: 12, width: w, borderRadius: 6, background: c}} />;

// A – blande, textlastige Seite ohne klaren CTA
const SiteA = () => (
  <div style={{height: '100%', background: '#111318', padding: 22, display: 'flex', flexDirection: 'column', gap: 16}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{fontSize: 18, fontWeight: 700, color: '#c3c3c8'}}>Handwerk Müller</div>
      <div style={{display: 'flex', gap: 10, color: '#5c5f66', fontSize: 12, fontWeight: 600}}><span>Start</span><span>Über uns</span><span>Kontakt</span></div>
    </div>
    <div style={{fontSize: 24, fontWeight: 700, color: '#9a9aa0', lineHeight: 1.2, marginTop: 8}}>Herzlich willkommen auf<br />unserer Webseite</div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6}}>
      <Bar w="100%" /><Bar w="94%" /><Bar w="97%" /><Bar w="88%" /><Bar w="92%" /><Bar w="70%" />
    </div>
    <div style={{marginTop: 'auto', color: '#565a61', fontSize: 15, fontWeight: 600}}>Kontakt ›</div>
  </div>
);

// B – Nutzen-Headline, Social Proof, klarer CTA
const SiteB = () => (
  <div style={{height: '100%', background: '#0e1016', padding: 22, display: 'flex', flexDirection: 'column', gap: 14}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{fontSize: 18, fontWeight: 800, color: '#fff'}}>Müller Bau</div>
      <div style={{color: C.teal, fontSize: 13, fontWeight: 700}}>☎ 24/7</div>
    </div>
    <div style={{flex: 1, borderRadius: 12, background: 'linear-gradient(140deg,#1b2440,#0f1220)', padding: 20, display: 'flex', flexDirection: 'column'}}>
      <div style={{fontSize: 27, fontWeight: 900, color: '#fff', lineHeight: 1.12}}>Handwerker in 48 h –<br />oder gratis.</div>
      <div style={{fontSize: 14, color: '#aeb6c8', marginTop: 8}}>Festpreis. Kein Warten. Meisterbetrieb.</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 14}}>
        <span style={{color: C.gold, fontSize: 18, letterSpacing: 1}}>★★★★★</span>
        <span style={{color: '#aeb6c8', fontSize: 13, fontWeight: 600}}>412 Bewertungen</span>
      </div>
      <div style={{marginTop: 'auto', alignSelf: 'stretch', padding: '13px 0', borderRadius: 10, background: C.teal, color: '#06140f', fontSize: 17, fontWeight: 900, textAlign: 'center'}}>Jetzt Termin sichern →</div>
    </div>
  </div>
);

const Panel = ({label, color, children, dim, win}) => {
  const f = useCurrentFrame();
  const enter = spring({frame: f - (label === 'A' ? 8 : 16), fps: 30, config: {damping: 15}});
  const dimAmt = dim ? interpolate(f, [REVEAL, REVEAL + 20], [1, 0.32], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const winGlow = win ? interpolate(f, [REVEAL, REVEAL + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  return (
    <div style={{position: 'relative', opacity: enter * dimAmt, transform: `translateY(${(1 - enter) * 40}px)`, filter: dim ? `grayscale(${(1 - dimAmt) * 1.2})` : 'none'}}>
      <div style={{position: 'absolute', inset: -6, borderRadius: 22, boxShadow: `0 0 0 4px ${color}, 0 0 60px ${color}`, opacity: winGlow}} />
      <div style={{position: 'absolute', top: -34, left: '50%', transform: 'translateX(-50%)', width: 56, height: 56, borderRadius: '50%', background: color, color: '#06110f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, zIndex: 2, boxShadow: '0 6px 18px rgba(0,0,0,0.5)'}}>{label}</div>
      {children}
    </div>
  );
};

const WinnerStamp = () => {
  const f = useCurrentFrame();
  const p = spring({frame: f - REVEAL, fps: 30, config: {damping: 10, mass: 0.7}});
  if (f < REVEAL) return null;
  return (
    <div style={{position: 'absolute', top: 250, right: 70, transform: `rotate(-12deg) scale(${p})`, zIndex: 5,
      border: `4px solid ${C.teal}`, color: C.teal, borderRadius: 12, padding: '8px 18px', fontSize: 34, fontWeight: 900, letterSpacing: 2, background: 'rgba(8,8,11,0.7)'}}>+38% ✅</div>
  );
};

const REASONS = [
  'Nutzen-Headline statt „Willkommen"',
  'Klarer CTA-Button — nicht versteckt',
  'Bewertungen = Vertrauen (Social Proof)',
];

const Reason = ({text, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15}});
  return (
    <div style={{opacity: p, transform: `translateX(${(1 - p) * -30}px)`, display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, color: C.ink, fontWeight: 700}}>
      <span style={{width: 40, height: 40, borderRadius: '50%', background: C.teal, color: '#06140f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, flexShrink: 0}}>✓</span>
      {text}
    </div>
  );
};

const Stage = () => {
  const f = useCurrentFrame();
  const title = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.6}});
  const guessPulse = 1 + Math.sin(f * 0.18) * 0.05;
  const guessOut = interpolate(f, [REVEAL - 15, REVEAL], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const revealIn = interpolate(f, [REVEAL, REVEAL + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 44px', gap: 30}}>
      <div style={{opacity: title, transform: `translateY(${(1 - title) * -24}px)`, textAlign: 'center'}}>
        <div style={{fontSize: 58, fontWeight: 900, color: C.ink, lineHeight: 1.06}}>Welche verkauft <span style={{color: C.teal}}>mehr</span>?</div>
      </div>
      <div style={{position: 'relative', display: 'flex', gap: 22, marginTop: 24}}>
        <WinnerStamp />
        <Panel label="A" color={C.violet} dim><Chrome url="handwerk-mueller.de"><SiteA /></Chrome></Panel>
        <Panel label="B" color={C.teal} win><Chrome url="mueller-bau.de"><SiteB /></Chrome></Panel>
      </div>
      {/* Rate-Prompt (vor Reveal) */}
      <div style={{position: 'relative', height: 190, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'absolute', opacity: guessOut, transform: `scale(${guessPulse})`, fontSize: 52, fontWeight: 900, color: C.ink, marginTop: 20}}>A oder B? 🤔</div>
        <div style={{position: 'absolute', opacity: revealIn, display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8}}>
          <div style={{fontSize: 40, fontWeight: 900, color: C.teal, textAlign: 'center', marginBottom: 4}}>B gewinnt — darum:</div>
          {REASONS.map((r, i) => <Reason key={i} text={r} delay={REVEAL + 14 + i * 24} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 14}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 24}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 78, color: C.ink, fontWeight: 900, lineHeight: 1.08, marginBottom: 32}}>Lagst du <span style={{color: C.violet}}>richtig</span>?</div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block'}}>
          <div style={{padding: '26px 50px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 40, fontWeight: 900}}>👇 A oder B? Verrat's mir</div>
        </div>
        <div style={{marginTop: 38, fontSize: 36, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebsiteVersusAB = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 560], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${540 + bgGlowX}px 900px, rgba(52,227,208,0.12), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={460}><Stage /></Sequence>
      <Sequence from={460} durationInFrames={100}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
