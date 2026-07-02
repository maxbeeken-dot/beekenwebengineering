import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
  flagRed: '#dd0000', flagGold: '#ffce00',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Schwarz-Rot-Gold Akzentband
const FlagBar = ({w = 8}) => (
  <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: w, display: 'flex', flexDirection: 'column'}}>
    <div style={{flex: 1, background: '#111'}} />
    <div style={{flex: 1, background: C.flagRed}} />
    <div style={{flex: 1, background: C.flagGold}} />
  </div>
);

const Browser = ({url, children, w = 700, h = 560}) => (
  <div style={{width: w, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 55px rgba(0,0,0,0.5)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '11px 16px', background: C.cardHi, borderBottom: `1px solid ${C.border}`}}>
      <div style={{width: 10, height: 10, borderRadius: '50%', background: C.red}} />
      <div style={{width: 10, height: 10, borderRadius: '50%', background: C.gold}} />
      <div style={{width: 10, height: 10, borderRadius: '50%', background: C.teal}} />
      <div style={{marginLeft: 10, flex: 1, height: 18, background: C.card, borderRadius: 9, paddingLeft: 10, color: C.muted, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center'}}>{url}</div>
    </div>
    <div style={{height: h, position: 'relative'}}>{children}</div>
  </div>
);

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14}});
  const b = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 40, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 26}}>
      <div style={{opacity: a, transform: `scale(${0.9 + a * 0.1})`, display: 'inline-flex', alignItems: 'center', gap: 12, background: '#111', border: `2px solid ${C.flagGold}`, borderRadius: 12, padding: '12px 22px'}}>
        <span style={{fontSize: 40}}>⚽</span>
        <span style={{fontSize: 40, fontWeight: 900, color: C.ink, letterSpacing: 1}}>DEUTSCHLAND-SPIEL</span>
      </div>
      <div style={{opacity: b, transform: `translateY(${(1 - b) * 24}px)`, fontSize: 34, fontWeight: 800, color: C.flagGold}}>Heute · 20:45 Uhr · Anpfiff</div>
      <div style={{opacity: c, transform: `translateY(${(1 - c) * 24}px)`, fontSize: 54, fontWeight: 900, color: C.ink, lineHeight: 1.12, marginTop: 10}}>Halb Deutschland<br />bestellt jetzt <span style={{color: C.flagRed}}>Pizza</span>. 🍕</div>
    </AbsoluteFill>
  );
};

const FailScene = () => {
  const f = useCurrentFrame();
  const secs = (f / 30);
  const timer = `0:${String(Math.min(9, Math.floor(secs))).padStart(2, '0')}`;
  const spin = (f * 9) % 360;
  const kickoff = f > 120 && f < 160 && Math.sin(f * 0.8) > 0;
  const missIn = spring({frame: f - 165, fps: 30, config: {damping: 14}});
  const barW = 14 + Math.sin(f * 0.2) * 6; // hängt bei ~14%
  const capA = interpolate(f, [10, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 44, gap: 26}}>
      <div style={{fontSize: 34, fontWeight: 800, color: C.muted, opacity: capA}}>Du bestellst bei… 🍕</div>
      <Browser url="pizzeria-roma-muc.de">
        <div style={{position: 'relative', height: '100%', background: '#0f0d0c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26}}>
          <FlagBar />
          {/* Spinner */}
          <div style={{width: 120, height: 120, borderRadius: '50%', border: `10px solid ${C.border}`, borderTopColor: C.flagRed, transform: `rotate(${spin}deg)`}} />
          <div style={{fontSize: 30, fontWeight: 700, color: C.muted}}>Seite lädt…</div>
          {/* Ladebalken hängt */}
          <div style={{width: 360, height: 12, borderRadius: 6, background: C.card, overflow: 'hidden'}}>
            <div style={{width: `${barW}%`, height: '100%', background: C.flagGold}} />
          </div>
          {/* Live-Timer */}
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 4}}>
            <span style={{fontSize: 24, color: C.dim}}>Ladezeit</span>
            <span style={{fontSize: 40, fontWeight: 900, color: C.red, fontVariantNumeric: 'tabular-nums'}}>{timer}</span>
          </div>
          {/* Anpfiff-Blitz */}
          {kickoff && <div style={{position: 'absolute', top: 24, right: 24, background: C.flagRed, color: '#fff', fontWeight: 900, fontSize: 26, padding: '8px 16px', borderRadius: 8}}>⚽ ANPFIFF!</div>}
        </div>
      </Browser>
      <div style={{height: 70, display: 'flex', alignItems: 'center'}}>
        {f > 165 && <div style={{opacity: missIn, transform: `scale(${0.8 + missIn * 0.2})`, fontSize: 48, fontWeight: 900, color: C.red}}>Anpfiff verpasst. 😩</div>}
      </div>
    </AbsoluteFill>
  );
};

const WinScene = () => {
  const f = useCurrentFrame();
  const load = interpolate(f, [8, 26], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const done = f > 26;
  const badge = spring({frame: f - 28, fps: 30, config: {damping: 12, mass: 0.7}});
  const msg = spring({frame: f - 60, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 44, gap: 26}}>
      <div style={{fontSize: 34, fontWeight: 800, color: C.teal}}>Bei der schnellen Seite… ⚡</div>
      <Browser url="da-mario.de">
        <div style={{height: '100%', background: 'linear-gradient(140deg,#141a12,#0c0f0a)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 30, position: 'relative'}}>
          {!done ? (
            <div style={{width: `${load}%`, height: 6, background: C.teal, borderRadius: 3, position: 'absolute', top: 0, left: 0}} />
          ) : null}
          <div style={{fontSize: 40, fontWeight: 900, color: '#fff'}}>Pizzeria Da Mario 🍕</div>
          <div style={{fontSize: 18, color: '#b7c2ab', marginTop: 10}}>In 30 Min. am Tisch – pünktlich zum Anpfiff.</div>
          <div style={{marginTop: 22, alignSelf: 'flex-start', padding: '14px 30px', borderRadius: 10, background: C.teal, color: '#06140f', fontSize: 20, fontWeight: 900}}>Jetzt bestellen →</div>
          {done && <div style={{position: 'absolute', top: 20, right: 20, transform: `scale(${badge})`, background: '#1c3a22', border: `2px solid ${C.teal}`, color: C.teal, fontWeight: 900, fontSize: 22, padding: '8px 16px', borderRadius: 10}}>✓ geladen in 0,8 s</div>}
        </div>
      </Browser>
      <div style={{opacity: msg, transform: `translateY(${(1 - msg) * 20}px)`, textAlign: 'center', maxWidth: 860}}>
        <div style={{fontSize: 40, fontWeight: 900, color: C.ink}}>Bestellt. Tor UND Pizza. ⚽🍕</div>
        <div style={{fontSize: 28, color: C.muted, fontWeight: 700, marginTop: 10}}>Beim großen Andrang entscheidet die <span style={{color: C.teal}}>Ladezeit</span> — wer lädt, verliert.</div>
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
        <div style={{fontSize: 56, color: C.ink, fontWeight: 900, lineHeight: 1.12}}>Wäre die Seite deiner<br />Stamm-Pizzeria <span style={{color: C.flagGold}}>bereit</span>?</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 44}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 46px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 900}}>👇 Tor oder Timeout? Tag sie!</div>
        </div>
        <div style={{marginTop: 34, fontSize: 34, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const DeutschlandSpiel = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 560], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${540 + bgGlowX}px 820px, rgba(221,0,0,0.10), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={85}><HookScene /></Sequence>
      <Sequence from={85} durationInFrames={200}><FailScene /></Sequence>
      <Sequence from={285} durationInFrames={150}><WinScene /></Sequence>
      <Sequence from={435} durationInFrames={110}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
