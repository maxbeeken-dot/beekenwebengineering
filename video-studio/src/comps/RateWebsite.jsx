import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const Browser = ({children, w = 680, h = 540}) => (
  <div style={{width: w, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,0.55)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 7, padding: '12px 16px', background: C.cardHi, borderBottom: `1px solid ${C.border}`}}>
      <div style={{width: 11, height: 11, borderRadius: '50%', background: C.red}} />
      <div style={{width: 11, height: 11, borderRadius: '50%', background: C.gold}} />
      <div style={{width: 11, height: 11, borderRadius: '50%', background: C.teal}} />
      <div style={{marginLeft: 12, flex: 1, height: 22, background: C.card, borderRadius: 11, paddingLeft: 12, color: C.muted, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center'}}>cafe-sonne.de</div>
    </div>
    <div style={{height: h, position: 'relative'}}>{children}</div>
  </div>
);

const MockSite = () => (
  <div style={{height: '100%', background: '#0e1014', fontFamily: FONT, display: 'flex', flexDirection: 'column'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px'}}>
      <div style={{fontSize: 22, fontWeight: 800, color: '#fff'}}>Café Sonne ☕</div>
      <div style={{display: 'flex', gap: 16, color: '#8b8a99', fontSize: 15, fontWeight: 600}}><span>Menü</span><span>Über uns</span><span>Kontakt</span></div>
    </div>
    <div style={{flex: 1, margin: '0 22px', borderRadius: 14, background: 'linear-gradient(135deg,#3a2a1a,#161210)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 28}}>
      <div style={{fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1.1}}>Frühstück, das<br />glücklich macht.</div>
      <div style={{fontSize: 18, color: '#c9b8a8', marginTop: 10}}>Frisch gebacken, jeden Morgen.</div>
      <div style={{marginTop: 22, alignSelf: 'flex-start', padding: '11px 22px', borderRadius: 10, background: '#241c14', color: '#5f5244', fontSize: 16, fontWeight: 700}}>Tisch reservieren</div>
    </div>
    <div style={{display: 'flex', gap: 14, padding: 22}}>
      <div style={{flex: 1, height: 66, borderRadius: 12, background: '#15171c'}} />
      <div style={{flex: 1, height: 66, borderRadius: 12, background: '#15171c'}} />
    </div>
  </div>
);

const VERDICTS = [
  {icon: '✓', text: 'Klarer, schöner Hero', color: C.teal},
  {icon: '!', text: 'CTA kaum sichtbar (Kontrast!)', color: C.gold},
  {icon: '✕', text: '4 MB Hero-Bild → lädt langsam', color: C.red},
];

const Verdict = ({icon, text, color, delay}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - delay, fps: 30, config: {damping: 15, mass: 0.6}});
  return (
    <div style={{opacity: p, transform: `translateX(${(1 - p) * -36}px)`,
      display: 'flex', alignItems: 'center', gap: 16, width: 720,
      background: C.card, border: `1px solid ${C.border}`, borderLeft: `5px solid ${color}`, borderRadius: 14, padding: '14px 22px'}}>
      <div style={{width: 46, height: 46, borderRadius: '50%', background: color, color: '#06140f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, flexShrink: 0}}>{icon}</div>
      <span style={{flex: 1, color: C.ink, fontWeight: 700, fontSize: 32, textAlign: 'left'}}>{text}</span>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const site = spring({frame: f - 6, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 60, gap: 40}}>
      <div style={{opacity: pop, transform: `scale(${0.9 + pop * 0.1})`, fontSize: 72, fontWeight: 800, color: C.ink, textAlign: 'center'}}>Rate diese Website. 🔥</div>
      <div style={{opacity: site, transform: `translateY(${(1 - site) * 40}px)`}}><Browser><MockSite /></Browser></div>
    </AbsoluteFill>
  );
};

const VerdictScene = () => {
  const f = useCurrentFrame();
  const top = spring({frame: f, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 26, padding: '40px 0'}}>
      <div style={{opacity: top, transform: `scale(${0.96 + top * 0.04})`}}><Browser w={560} h={420}><MockSite /></Browser></div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
        {VERDICTS.map((v, i) => <Verdict key={i} {...v} delay={14 + i * 30} />)}
      </div>
    </AbsoluteFill>
  );
};

const ScaleScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const settle = interpolate(f, [30, 85], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const leftPct = 50 + Math.sin(f * 0.42) * 38 * settle;
  const tease = spring({frame: f - 70, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 60, gap: 30}}>
      <div style={{opacity: a, transform: `scale(${0.9 + a * 0.1})`, fontSize: 78, fontWeight: 800, color: C.ink}}>1 – 10?</div>
      <div style={{position: 'relative', width: 860, height: 34, marginTop: 20}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 17, background: 'linear-gradient(90deg,#ff5468,#f5b945,#34e3d0)'}} />
        <div style={{position: 'absolute', top: -40, left: `${leftPct}%`, transform: 'translateX(-50%)', fontSize: 44, color: C.ink}}>▼</div>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', width: 860, color: C.muted, fontSize: 30, fontWeight: 800}}><span>1 😬</span><span>10 🤩</span></div>
      <div style={{opacity: tease, transform: `translateY(${(1 - tease) * 18}px)`, fontSize: 44, color: C.muted, fontWeight: 700, marginTop: 16}}>Meine Zahl? Behalt ich für mich. 🤫</div>
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
        <div style={{fontSize: 80, color: C.ink, fontWeight: 800, lineHeight: 1.08, marginBottom: 32}}>Was gibst <span style={{color: C.violet}}>DU</span> ihr?</div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block'}}>
          <div style={{padding: '26px 50px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 40, fontWeight: 900}}>👇 Kommentier deine Zahl 1–10</div>
        </div>
        <div style={{marginTop: 38, fontSize: 36, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const RateWebsite = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 600], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={90}><HookScene /></Sequence>
      <Sequence from={90} durationInFrames={270}><VerdictScene /></Sequence>
      <Sequence from={360} durationInFrames={130}><ScaleScene /></Sequence>
      <Sequence from={490} durationInFrames={110}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
