import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, Easing} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Jede Kunden-Nachricht → Logo wächst eine Stufe.
const REQUESTS = [
  {f: 55, text: 'Kannst du das Logo bisschen größer machen? 🙏', scale: 1.7},
  {f: 150, text: 'Größer! Muss auffallen.', scale: 3.0},
  {f: 245, text: 'GRÖSSER. Muss knallen 🔥🔥', scale: 5.6},
  {f: 335, text: 'Perfekt! Nur noch minimal größer 😅', scale: 10},
];
const CLIMAX = 335;

const SCALE_KF_F = [0, 55, 88, 150, 183, 245, 278, 335, 372, 440];
const SCALE_KF_V = [1, 1, 1.7, 1.7, 3.0, 3.0, 5.6, 5.6, 10, 10];

const logoScale = (f) => {
  const base = interpolate(f, SCALE_KF_F, SCALE_KF_V, {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  let pop = 0;
  for (const r of REQUESTS) {
    pop += interpolate(f - r.f, [0, 5, 15], [0, 0.13, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  }
  return base * (1 + pop);
};

const Bar = ({w, c = '#2a2d34'}) => <div style={{height: 13, width: w, borderRadius: 6, background: c}} />;

const SiteContent = () => (
  <div style={{height: '100%', background: '#0e1116', padding: 26, display: 'flex', flexDirection: 'column', gap: 18}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{width: 150, height: 44}} /> {/* Platz fürs (wachsende) Logo */}
      <div style={{display: 'flex', gap: 16, color: '#5c6068', fontSize: 15, fontWeight: 600}}><span>Menü</span><span>Über uns</span><span>Kontakt</span></div>
    </div>
    <div style={{flex: 1, borderRadius: 14, background: 'linear-gradient(140deg,#2a2113,#14100b)', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div style={{fontSize: 34, fontWeight: 800, color: '#f2e7d6', lineHeight: 1.15}}>Frisch gebacken.<br />Jeden Morgen.</div>
      <div style={{marginTop: 20, alignSelf: 'flex-start', padding: '12px 26px', borderRadius: 10, background: C.gold, color: '#241a06', fontSize: 17, fontWeight: 800}}>Zur Karte →</div>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 11}}><Bar w="100%" /><Bar w="92%" /><Bar w="96%" /></div>
  </div>
);

const GrowingLogo = () => {
  const f = useCurrentFrame();
  const s = logoScale(f);
  return (
    <div style={{
      position: 'absolute', top: 84, left: 42, transformOrigin: 'top left',
      transform: `scale(${s})`, zIndex: 12, willChange: 'transform',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 16px', borderRadius: 12,
        background: `linear-gradient(135deg,${C.gold},#ff9d3c)`,
        color: '#231703', fontWeight: 900, fontSize: 24, whiteSpace: 'nowrap',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}>☀ SONNE</div>
    </div>
  );
};

const Bubble = ({text, delay, index}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 13, mass: 0.7}});
  const shout = index >= 2;
  return (
    <div style={{
      opacity: p, transform: `translateX(${(1 - p) * 80}px) scale(${0.6 + p * 0.4})`,
      alignSelf: 'flex-end', maxWidth: 560,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
    }}>
      <div style={{
        padding: '15px 22px', borderRadius: 26, borderBottomRightRadius: 8,
        background: shout ? 'linear-gradient(135deg,#ff5468,#ff7a5c)' : 'linear-gradient(135deg,#2b8cff,#3aa0ff)',
        color: '#fff', fontSize: shout ? 34 : 30, fontWeight: shout ? 900 : 700, lineHeight: 1.2,
        boxShadow: '0 10px 30px rgba(0,0,0,0.45)', textAlign: 'right',
      }}>{text}</div>
    </div>
  );
};

const Stage = () => {
  const f = useCurrentFrame();
  const povIn = spring({frame: f, fps: 30, config: {damping: 16}});
  const cardIn = spring({frame: f - 8, fps: 30, config: {damping: 15}});
  // Screen-Shake am Klimax
  const shakeAmt = interpolate(f, [CLIMAX, CLIMAX + 8, CLIMAX + 55], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sx = Math.sin(f * 1.7) * 9 * shakeAmt;
  const sy = Math.cos(f * 1.9) * 7 * shakeAmt;
  const activeCount = REQUESTS.filter((r) => f >= r.f).length;
  return (
    <AbsoluteFill style={{transform: `translate(${sx}px,${sy}px)`}}>
      {/* POV-Label */}
      <div style={{position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', opacity: povIn, zIndex: 25}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 800, letterSpacing: 3}}>POV: DU BIST WEBDESIGNER</div>
        <div style={{fontSize: 52, color: C.ink, fontWeight: 900, marginTop: 8}}>…und der Kunde schreibt.</div>
      </div>

      {/* Website mit wachsendem Logo */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: 40, paddingBottom: 470}}>
        <div style={{
          opacity: cardIn, transform: `translateY(${(1 - cardIn) * 40}px)`,
          position: 'relative', width: 880,
        }}>
          <div style={{width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 18, position: 'relative'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 7, padding: '13px 18px', background: C.cardHi, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottom: `1px solid ${C.border}`}}>
              <div style={{width: 11, height: 11, borderRadius: '50%', background: C.red}} />
              <div style={{width: 11, height: 11, borderRadius: '50%', background: C.gold}} />
              <div style={{width: 11, height: 11, borderRadius: '50%', background: C.teal}} />
              <div style={{marginLeft: 12, flex: 1, height: 22, background: C.card, borderRadius: 11, paddingLeft: 12, color: C.muted, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center'}}>sonne-baeckerei.de</div>
            </div>
            <div style={{height: 720, overflow: 'hidden', borderBottomLeftRadius: 18, borderBottomRightRadius: 18}}><SiteContent /></div>
            <GrowingLogo />
          </div>
        </div>
      </AbsoluteFill>

      {/* Chat-Thread (immer lesbar, über dem Logo) */}
      <div style={{position: 'absolute', bottom: 70, left: 40, right: 40, display: 'flex', flexDirection: 'column', gap: 16, zIndex: 20}}>
        {REQUESTS.slice(0, activeCount).map((r, i) => <Bubble key={i} text={r.text} delay={r.f} index={i} />)}
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
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 26}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 62, color: C.ink, fontWeight: 900, lineHeight: 1.12}}>Gutes Design heißt<br />auch mal: <span style={{color: C.teal}}>Nein.</span></div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 46}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 46px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 900}}>👇 Team Kunde oder Team Designer?</div>
        </div>
        <div style={{marginTop: 34, fontSize: 34, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const POVLogoGroesser = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 560], [-200, 200]);
  const heat = interpolate(f, [200, 430], [0.1, 0.22], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(780px 780px at ${540 + bgGlowX}px 760px, rgba(245,185,69,${heat}), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={460}><Stage /></Sequence>
      <Sequence from={460} durationInFrames={100}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
