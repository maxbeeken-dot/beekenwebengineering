import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const HOOK = 60, P1 = 84, P2 = 78, P3 = 90, REVEAL = 78, FLIP = 72, CTA = 78; // 540 = 18 s

const Browser = ({url, tone = 'bad', children, shift = 0}) => {
  const col = tone === 'good' ? C.teal : C.red;
  return (
    <div style={{
      width: 860, background: C.card, border: `3px solid ${col}66`, borderRadius: 22, overflow: 'hidden',
      boxShadow: `0 0 44px ${col}18`, transform: `translateX(${shift}px)`,
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, background: C.cardHi, padding: '14px 18px', borderBottom: `1px solid ${C.border}`}}>
        {[C.red, C.gold, C.green].map((c, i) => <div key={i} style={{width: 14, height: 14, borderRadius: 14, background: c, opacity: 0.7}} />)}
        <div style={{flex: 1, background: C.bg, borderRadius: 8, padding: '8px 14px', marginLeft: 10, fontSize: 21, color: C.dim, fontWeight: 600}}>{url}</div>
      </div>
      <div style={{padding: '34px 30px', minHeight: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16}}>
        {children}
      </div>
    </div>
  );
};

const Stamp = ({f, at}) => {
  const s = spring({frame: f - at, fps: 30, config: {damping: 9, mass: 0.5}});
  if (s <= 0.01) return null;
  return (
    <div style={{
      marginTop: 26, transform: `rotate(-9deg) scale(${0.45 + s * 0.55})`, opacity: s,
      border: `5px solid ${C.red}`, color: C.red, fontSize: 42, fontWeight: 900,
      padding: '10px 26px', borderRadius: 12, letterSpacing: 2,
    }}>erkannt ✓</div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.7}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 26}}>
      <div style={{fontSize: 54, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.92 + a * 0.08})`, lineHeight: 1.18, maxWidth: 920}}>
        Sag mir, dass ihr <span style={{color: C.red}}>keine Bewerber</span> kriegt —<br />ohne es zu sagen.
      </div>
      <div style={{fontSize: 38, fontWeight: 800, color: C.gold, opacity: b, transform: `translateY(${(1 - b) * 20}px)`}}>Ich fang an: 👇</div>
    </AbsoluteFill>
  );
};

const Proof1 = () => {
  const f = useCurrentFrame();
  const broke = f >= 24;
  const g = broke && f < 36 ? Math.sin(f * 3.6) * 7 : 0;
  const spin = (f * 8) % 360;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 40}}>
      <Browser url="firma.de/karriere" shift={g}>
        {!broke ? (
          <>
            <div style={{fontSize: 34, fontWeight: 800, color: C.muted}}>Menü → <span style={{color: C.teal}}>Karriere</span></div>
            <div style={{width: 34, height: 34, borderRadius: 34, border: `4px solid ${C.border}`, borderTopColor: C.teal, transform: `rotate(${spin}deg)`}} />
          </>
        ) : (
          <>
            <div style={{fontSize: 110, fontWeight: 900, color: C.red, lineHeight: 1}}>404</div>
            <div style={{fontSize: 34, fontWeight: 800, color: C.muted}}>Seite nicht gefunden</div>
          </>
        )}
      </Browser>
      <Stamp f={f} at={48} />
    </AbsoluteFill>
  );
};

const Proof2 = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 40}}>
      <div style={{opacity: a, transform: `scale(${0.9 + a * 0.1})`}}>
        <Browser url="firma.de/kontakt">
          <div style={{fontSize: 92}}>📠</div>
          <div style={{fontSize: 44, fontWeight: 900, color: C.ink, textAlign: 'center'}}>„Bewerbung bitte<br />per Fax.“</div>
        </Browser>
      </div>
      <Stamp f={f} at={44} />
    </AbsoluteFill>
  );
};

const Proof3 = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 16, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 40, gap: 22}}>
      <div style={{
        opacity: a, transform: `translateY(${(1 - a) * -20}px)`, background: 'rgba(255,84,104,0.12)',
        border: `2px solid ${C.red}66`, borderRadius: 14, padding: '14px 28px', fontSize: 36, fontWeight: 900, color: C.red,
      }}>Letztes Update: 2011</div>
      <div style={{
        opacity: b, transform: `scale(${0.9 + b * 0.1})`, width: 300, background: C.card,
        border: `3px solid ${C.border}`, borderRadius: 28, padding: 22, display: 'flex', flexDirection: 'column', gap: 7,
      }}>
        <div style={{fontSize: 13, color: C.dim, fontWeight: 700}}>Über uns · Karriere · Kontakt</div>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{height: 5, width: `${92 - i * 9}%`, background: C.border, borderRadius: 6}} />)}
        <div style={{fontSize: 11, color: C.dim, marginTop: 4}}>Lorem ipsum dolor sit amet consetetur sadipscing elitr sed diam nonumy eirmod tempor</div>
      </div>
      <div style={{opacity: b, fontSize: 30, fontWeight: 800, color: C.muted}}>„Zum Lesen bitte zoomen.“ 🔍</div>
      <Stamp f={f} at={54} />
    </AbsoluteFill>
  );
};

const RevealScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{fontSize: 50, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.92 + a * 0.08})`, lineHeight: 1.2, maxWidth: 920}}>
        Die beste Fachkraft googelt <span style={{color: C.gold}}>3 Firmen</span>.<br />
        <span style={{fontSize: 40, color: C.muted}}>Sie bleibt bei der mit der besten Website.</span>
      </div>
    </AbsoluteFill>
  );
};

const FlipScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const btn = 1 + Math.sin(f * 0.24) * 0.05;
  const checks = ['Blitzschnell', 'Mobil perfekt', 'Echtes Team'];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 40}}>
      <div style={{opacity: a, transform: `scale(${0.92 + a * 0.08})`}}>
        <Browser url="firma.de/karriere" tone="good">
          <div style={{fontSize: 38, fontWeight: 900, color: C.ink}}>Arbeite mit uns</div>
          <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center'}}>
            {checks.map((c, i) => {
              const s = spring({frame: f - 12 - i * 8, fps: 30, config: {damping: 14}});
              return <div key={i} style={{opacity: s, transform: `scale(${s})`, background: 'rgba(52,227,208,0.10)', border: `2px solid ${C.teal}55`, borderRadius: 12, padding: '10px 18px', fontSize: 25, fontWeight: 800, color: C.teal}}>✓ {c}</div>;
            })}
          </div>
          <div style={{transform: `scale(${btn})`, background: C.teal, color: '#04120f', borderRadius: 16, padding: '18px 40px', fontSize: 32, fontWeight: 900, marginTop: 8, boxShadow: `0 0 34px ${C.teal}55`}}>Jetzt bewerben →</div>
        </Browser>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 16}}>
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -18}px)`, fontSize: 33, fontWeight: 800, color: C.gold, maxWidth: 880, lineHeight: 1.3}}>
        👇 Spiel mit: „Sag mir, ohne es zu sagen…“
      </div>
      <div style={{opacity: line, transform: `scale(${0.9 + line * 0.1})`, marginTop: 12}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 46, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 8, maxWidth: 900}}>
          Eine <span style={{color: C.teal}}>Karriereseite</span>,<br />die Bewerber überzeugt.
        </div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`, marginTop: 22}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SagMirOhne = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(800px 800px at 540px 480px, rgba(255,84,104,0.07), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={P1}><Proof1 /></Sequence>
      <Sequence from={HOOK + P1} durationInFrames={P2}><Proof2 /></Sequence>
      <Sequence from={HOOK + P1 + P2} durationInFrames={P3}><Proof3 /></Sequence>
      <Sequence from={HOOK + P1 + P2 + P3} durationInFrames={REVEAL}><RevealScene /></Sequence>
      <Sequence from={HOOK + P1 + P2 + P3 + REVEAL} durationInFrames={FLIP}><FlipScene /></Sequence>
      <Sequence from={HOOK + P1 + P2 + P3 + REVEAL + FLIP} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
