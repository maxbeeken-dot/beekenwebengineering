import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";
const HOOK = 56, ITEM = 98, CTA_LEN = 104;

// true = WAHR, false = MYTHOS
const ITEMS = [
  {claim: '„Ladezeit ist ein Google-Ranking-Faktor."', truth: true, why: 'Stimmt. Schnelle Seiten ranken besser & werden öfter gefunden.'},
  {claim: '„Eine schöne Website reicht, um Kunden zu gewinnen."', truth: false, why: 'Mythos. Ohne klaren Button & schnelle Ladezeit bringt Schönheit keine Anfrage.'},
  {claim: '„Ein Baukasten ist langfristig günstiger."', truth: false, why: 'Mythos. Monatliche Miete + Abhängigkeit kosten auf Dauer mehr.'},
  {claim: '„Deine Website sollte dir gehören."', truth: true, why: 'Stimmt. Kein Mietmodell — die fertige Seite ist dein Eigentum.'},
];

const MythScene = ({data, index}) => {
  const f = useCurrentFrame();
  const intro = spring({frame: f, fps: 30, config: {damping: 15}});
  const resolveAt = 52;
  const resolved = f >= resolveAt;
  const stamp = spring({frame: f - resolveAt, fps: 30, config: {damping: 11, mass: 0.7}});
  const vc = data.truth ? C.green : C.red;
  const label = data.truth ? 'WAHR ✅' : 'MYTHOS ❌';
  // vor Reveal blinkt "WAHR oder MYTHOS?"
  const prompt = interpolate(f % 24, [0, 12, 24], [0.4, 1, 0.4]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 56, gap: 30}}>
      <div style={{opacity: intro, fontSize: 28, fontWeight: 800, color: C.muted, letterSpacing: 2}}>FRAGE {index + 1}/4</div>
      {/* Aussage-Karte */}
      <div style={{transform: `scale(${0.94 + intro * 0.06})`, opacity: intro, width: 860, background: C.card, border: `3px solid ${resolved ? vc : C.border}`, borderRadius: 26, padding: '40px 40px', textAlign: 'center',
        boxShadow: resolved ? `0 0 50px ${vc}44` : 'none'}}>
        <div style={{fontSize: 46, fontWeight: 800, color: C.ink, lineHeight: 1.25}}>{data.claim}</div>
      </div>
      {/* Prompt oder Verdict */}
      {!resolved ? (
        <div style={{opacity: prompt, fontSize: 40, fontWeight: 900, color: C.gold, letterSpacing: 1}}>🤔 WAHR oder MYTHOS?</div>
      ) : (
        <>
          <div style={{transform: `scale(${stamp})`, opacity: stamp, border: `6px solid ${vc}`, color: vc, padding: '10px 34px', borderRadius: 16, fontSize: 56, fontWeight: 900, letterSpacing: 2}}>{label}</div>
          <div style={{opacity: stamp, fontSize: 30, fontWeight: 600, color: C.ink, textAlign: 'center', maxWidth: 800}}>{data.why}</div>
        </>
      )}
    </AbsoluteFill>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const b = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 24}}>
      <div style={{fontSize: 96, transform: `scale(${a})`}}>🤔</div>
      <div style={{fontSize: 66, fontWeight: 900, color: C.ink, lineHeight: 1.08, opacity: a}}>Website:<br /><span style={{color: C.gold}}>Wahr oder Mythos?</span></div>
      <div style={{fontSize: 32, fontWeight: 700, color: C.muted, opacity: b, transform: `translateY(${(1 - b) * 24}px)`}}>4 Aussagen — wie viele errätst du? 👇</div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line2 = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 16}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12}}>Kein Mythos:<br /><span style={{color: C.teal}}>schnell, sicher, deins</span>.</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 42}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 44px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>👇 Wie viele hattest du richtig?</div>
        </div>
        <div style={{marginTop: 32, fontSize: 34, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebsiteMythos = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at 540px 820px, rgba(124,92,255,0.13), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      {ITEMS.map((it, i) => (
        <Sequence key={i} from={HOOK + i * ITEM} durationInFrames={ITEM}><MythScene data={it} index={i} /></Sequence>
      ))}
      <Sequence from={HOOK + ITEMS.length * ITEM} durationInFrames={CTA_LEN}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
