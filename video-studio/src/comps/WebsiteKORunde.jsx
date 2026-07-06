import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f', pitch: '#0c2a1a',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";
const HOOK = 56, ROUND = 104, CUP = 132;

// Handgecodet läuft durch die K.-o.-Runde. Gegner = Website-Sünden.
const ROUNDS = [
  {stage: 'ACHTELFINALE', foe: 'Baukasten-Seite', foeIcon: '🧩', crit: '⚡ Ladezeit', score: '0,9 s : 6 s', why: 'lädt in 0,9 s statt 6 s'},
  {stage: 'VIERTELFINALE', foe: 'Template-Seite', foeIcon: '📄', crit: '✨ Einzigartig', score: '1 : 0', why: 'individuell statt Vorlage von der Stange'},
  {stage: 'HALBFINALE', foe: 'KI-Website', foeIcon: '🤖', crit: '🎯 Qualität', score: '2 : 0', why: 'Handarbeit schlägt KI-Zufall'},
  {stage: 'FINALE', foe: 'Miet-Website', foeIcon: '🔒', crit: '🔑 Eigentum', score: '1 : 0', why: 'die Seite gehört DIR — kein Mietmodell'},
];

const Bracket = ({won}) => (
  <div style={{position: 'absolute', top: 54, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, zIndex: 20}}>
    {ROUNDS.map((r, i) => (
      <div key={i} style={{width: 60, height: 10, borderRadius: 10, background: i < won ? C.teal : C.border, boxShadow: i < won ? `0 0 12px ${C.teal}` : 'none'}} />
    ))}
  </div>
);

const Team = ({name, icon, isCode, win, resolved, stamp}) => (
  <div style={{width: 340, borderRadius: 22, padding: 26, textAlign: 'center',
    background: resolved && win ? 'rgba(52,227,208,0.12)' : C.card,
    border: `3px solid ${resolved && win ? C.teal : (resolved ? '#2a2730' : C.border)}`,
    opacity: resolved && !win ? 0.45 : 1,
    boxShadow: resolved && win ? `0 0 44px ${C.teal}55` : 'none'}}>
    <div style={{fontSize: 72}}>{icon}</div>
    <div style={{fontSize: 30, fontWeight: 900, color: isCode ? C.teal : C.ink, marginTop: 10}}>{name}</div>
    {resolved && (
      <div style={{marginTop: 12, transform: `scale(${stamp})`, fontSize: 26, fontWeight: 900, color: win ? C.teal : C.red}}>{win ? 'WEITER →' : 'RAUS ❌'}</div>
    )}
  </div>
);

const RoundScene = ({data, index}) => {
  const f = useCurrentFrame();
  const intro = spring({frame: f, fps: 30, config: {damping: 15}});
  const resolveAt = 56;
  const resolved = f >= resolveAt;
  const stamp = spring({frame: f - resolveAt, fps: 30, config: {damping: 11, mass: 0.7}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 50, gap: 26}}>
      <Bracket won={resolved ? index + 1 : index} />
      <div style={{opacity: intro, transform: `translateY(${(1 - intro) * -18}px)`, textAlign: 'center'}}>
        <div style={{fontSize: 34, fontWeight: 900, color: C.gold, letterSpacing: 3}}>🏆 {data.stage}</div>
        <div style={{fontSize: 30, fontWeight: 700, color: C.muted, marginTop: 8}}>{data.crit}</div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 6}}>
        <Team name="Handgecodet" icon="⚡" isCode win={true} resolved={resolved} stamp={stamp} />
        <div style={{fontSize: 40, fontWeight: 900, color: C.dim}}>VS</div>
        <Team name={data.foe} icon={data.foeIcon} isCode={false} win={false} resolved={resolved} stamp={stamp} />
      </div>
      {resolved && (
        <div style={{opacity: stamp, textAlign: 'center'}}>
          <div style={{fontSize: 40, fontWeight: 900, color: C.teal}}>{data.score}</div>
          <div style={{fontSize: 27, fontWeight: 600, color: C.ink, marginTop: 6, maxWidth: 760}}>{data.why}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const b = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg,#0e3322,#081d13)`, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 24}}>
      <div style={{fontSize: 100, transform: `scale(${a})`}}>🏆</div>
      <div style={{fontSize: 66, fontWeight: 900, color: C.ink, lineHeight: 1.06, opacity: a}}>Das Website-<br /><span style={{color: C.teal}}>Achtelfinale</span></div>
      <div style={{fontSize: 32, fontWeight: 700, color: '#cfe9df', opacity: b, transform: `translateY(${(1 - b) * 24}px)`}}>Wer kommt weiter? K.-o.-Runde 👇</div>
    </AbsoluteFill>
  );
};

const CupScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 12, mass: 0.7}});
  const rise = interpolate(f, [0, 30], [40, 0], {extrapolateRight: 'clamp'});
  const line2 = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  const shine = 0.5 + Math.sin(f * 0.2) * 0.5;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg,#0e3322,#06140d)`, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{transform: `scale(${pop}) translateY(${rise}px)`, fontSize: 150, filter: `drop-shadow(0 0 ${20 + shine * 30}px ${C.gold})`}}>🏆</div>
      <div style={{opacity: pop, marginTop: 10}}>
        <div style={{fontSize: 30, color: C.gold, fontWeight: 900, letterSpacing: 4}}>WELTMEISTER</div>
        <div style={{fontSize: 60, color: C.ink, fontWeight: 900, lineHeight: 1.1, marginTop: 8}}><span style={{color: C.teal}}>Handgecodet</span></div>
        <div style={{fontSize: 26, color: C.teal, fontWeight: 700, letterSpacing: 3, marginTop: 10}}>BEEKEN WEB ENGINEERING</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 34}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '22px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 32, fontWeight: 900}}>👇 Welche Seite gewinnt bei DIR?</div>
        </div>
        <div style={{marginTop: 26, fontSize: 32, color: '#cfe9df'}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebsiteKORunde = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at 540px 900px, rgba(11,122,62,0.14), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      {ROUNDS.map((r, i) => (
        <Sequence key={i} from={HOOK + i * ROUND} durationInFrames={ROUND}><RoundScene data={r} index={i} /></Sequence>
      ))}
      <Sequence from={HOOK + ROUNDS.length * ROUND} durationInFrames={CUP}><CupScene /></Sequence>
    </AbsoluteFill>
  );
};
