import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f', pitch: '#0b7a3e',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 5 Elfmeter-Runden. winner: 'code' | 'bau'
const ROUNDS = [
  {resolve: 60, crit: 'Ladezeit', icon: '⚡', winner: 'code', why: 'lädt in <2 s statt Baukasten-Ballast'},
  {resolve: 60, crit: 'Mobil', icon: '📱', winner: 'code', why: 'fürs Handy gebaut, nicht geschrumpft'},
  {resolve: 60, crit: 'DSGVO', icon: '🔒', winner: 'code', why: 'selbst gehostete Fonts, sicher'},
  {resolve: 60, crit: 'Günstiger Start', icon: '💶', winner: 'bau', why: 'Baukasten startet billiger'},
  {resolve: 60, crit: 'Eigentum', icon: '🔑', winner: 'code', why: 'die Seite gehört dir'},
];
const ROUND_LEN = 96;
const HOOK = 70;

const scoreAt = (f) => {
  let bau = 0, code = 0;
  ROUNDS.forEach((r, i) => {
    const resolvedAt = HOOK + i * ROUND_LEN + r.resolve;
    if (f >= resolvedAt) { if (r.winner === 'code') code++; else bau++; }
  });
  return {bau, code};
};

const Scoreboard = () => {
  const f = useCurrentFrame();
  const {bau, code} = scoreAt(f);
  return (
    <div style={{position: 'absolute', top: 54, left: '50%', transform: 'translateX(-50%)', zIndex: 20,
      display: 'flex', alignItems: 'stretch', borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: '0 12px 40px rgba(0,0,0,0.5)'}}>
      <div style={{background: C.card, padding: '14px 22px', textAlign: 'center', minWidth: 220}}>
        <div style={{fontSize: 20, fontWeight: 800, color: C.muted, letterSpacing: 1}}>BAUKASTEN</div>
        <div style={{fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1}}>{bau}</div>
      </div>
      <div style={{background: C.pitch, display: 'flex', alignItems: 'center', padding: '0 14px', color: '#fff', fontSize: 30, fontWeight: 900}}>⚽</div>
      <div style={{background: C.card, padding: '14px 22px', textAlign: 'center', minWidth: 220}}>
        <div style={{fontSize: 20, fontWeight: 800, color: C.teal, letterSpacing: 1}}>HANDGECODET</div>
        <div style={{fontSize: 56, fontWeight: 900, color: C.ink, lineHeight: 1}}>{code}</div>
      </div>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const b = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 26}}>
      <div style={{opacity: a, transform: `scale(${0.9 + a * 0.1})`, fontSize: 40, fontWeight: 900, color: C.gold, letterSpacing: 2}}>⚽ ELFMETERSCHIESSEN</div>
      <div style={{opacity: b, transform: `translateY(${(1 - b) * 30}px)`, fontSize: 66, fontWeight: 900, color: C.ink, lineHeight: 1.08}}>
        <span style={{color: C.muted}}>Baukasten</span><br />vs.<br /><span style={{color: C.teal}}>Handgecodet</span>
      </div>
      <div style={{opacity: b, fontSize: 30, color: C.muted, fontWeight: 700, marginTop: 8}}>5 Schüsse. Wer trifft? 🥅</div>
    </AbsoluteFill>
  );
};

const RoundScene = ({round, index}) => {
  const f = useCurrentFrame();
  const intro = spring({frame: f, fps: 30, config: {damping: 15}});
  const isCode = round.winner === 'code';
  const shoot = interpolate(f, [round.resolve - 24, round.resolve], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const resolved = f >= round.resolve;
  const stamp = spring({frame: f - round.resolve, fps: 30, config: {damping: 10, mass: 0.7}});
  // Ball fliegt zur Seite des Gewinners
  const ballX = interpolate(shoot, [0, 1], [0, isCode ? 250 : -250]);
  const ballY = -Math.sin(shoot * Math.PI) * 120;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 50, gap: 30}}>
      <div style={{opacity: intro, transform: `translateY(${(1 - intro) * -20}px)`, textAlign: 'center'}}>
        <div style={{fontSize: 26, fontWeight: 800, color: C.gold, letterSpacing: 2}}>RUNDE {index + 1}/5</div>
        <div style={{fontSize: 60, fontWeight: 900, color: C.ink, marginTop: 8}}>{round.icon} {round.crit}</div>
      </div>
      {/* Zwei Tore */}
      <div style={{position: 'relative', display: 'flex', gap: 60, marginTop: 20}}>
        {[{k: 'bau', label: 'Baukasten', win: !isCode}, {k: 'code', label: 'Handgecodet', win: isCode}].map((g) => (
          <div key={g.k} style={{width: 300, height: 190, borderRadius: 16, border: `3px solid ${resolved && g.win ? C.teal : C.border}`,
            background: resolved && g.win ? 'rgba(52,227,208,0.12)' : C.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: resolved && g.win ? `0 0 40px ${C.teal}` : 'none'}}>
            <div style={{fontSize: 40}}>🥅</div>
            <div style={{fontSize: 24, fontWeight: 800, color: g.k === 'code' ? C.teal : C.muted}}>{g.label}</div>
            {resolved && (
              <div style={{transform: `scale(${stamp})`, fontSize: 30, fontWeight: 900, color: g.win ? C.teal : C.red}}>{g.win ? 'TOR ⚽' : 'daneben ❌'}</div>
            )}
          </div>
        ))}
        {/* Ball */}
        {!resolved && <div style={{position: 'absolute', left: '50%', bottom: -10, transform: `translate(calc(-50% + ${ballX}px), ${ballY}px)`, fontSize: 44}}>⚽</div>}
      </div>
      {resolved && <div style={{opacity: stamp, fontSize: 28, color: C.muted, fontWeight: 700, textAlign: 'center', maxWidth: 720}}>{round.why}</div>}
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line2 = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 34, fontWeight: 900, color: C.gold, letterSpacing: 2, marginBottom: 12}}>ENDSTAND 4 : 1</div>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 22}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 62, color: C.ink, fontWeight: 900, lineHeight: 1.1}}>Handgecodet<br /><span style={{color: C.teal}}>gewinnt</span>.</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 42}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 46px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 900}}>👇 Wer gewinnt bei DIR?</div>
        </div>
        <div style={{marginTop: 34, fontSize: 34, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const ElfmeterDuell = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 620], [-200, 200]);
  const showBoard = f >= HOOK && f < HOOK + ROUNDS.length * ROUND_LEN;
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${540 + bgGlowX}px 900px, rgba(11,122,62,0.16), transparent 70%)`}} />
      {showBoard && <Scoreboard />}
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      {ROUNDS.map((r, i) => (
        <Sequence key={i} from={HOOK + i * ROUND_LEN} durationInFrames={ROUND_LEN}>
          <RoundScene round={r} index={i} />
        </Sequence>
      ))}
      <Sequence from={HOOK + ROUNDS.length * ROUND_LEN} durationInFrames={110}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
