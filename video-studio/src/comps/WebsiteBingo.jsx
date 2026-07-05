import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 3x3 Sünden-Bingo. Index 4 = Free-Field (Mitte).
const CELLS = [
  {e: '🎵', t: 'Auto-Play Musik'},
  {e: '🪧', t: 'Pop-up sofort'},
  {e: '🐌', t: 'Lädt >3 Sek'},
  {e: '📱', t: 'Kein Handy-Layout'},
  {e: '⭐', t: 'Stockfoto-Handschlag', free: true},
  {e: '🎨', t: 'Comic Sans'},
  {e: '🅱️', t: 'Kein klarer Button'},
  {e: '🎠', t: 'Karussell-Slider'},
  {e: '🔢', t: 'Besucherzähler'},
];
const BINGO_LINE = [0, 4, 8]; // Diagonale

const Cell = ({cell, i, localF, inBingo, bingoF}) => {
  const s = spring({frame: localF - (10 + i * 9), fps: 30, config: {damping: 14, mass: 0.6}});
  if (s <= 0.001) return null;
  const lit = inBingo && bingoF > 0;
  const litS = lit ? spring({frame: bingoF - BINGO_LINE.indexOf(i) * 8, fps: 30, config: {damping: 12}}) : 0;
  const base = cell.free ? C.gold : C.red;
  const bg = lit ? `rgba(52,227,208,${0.12 + litS * 0.12})` : (cell.free ? 'rgba(245,185,69,0.10)' : C.card);
  const bord = lit ? C.teal : (cell.free ? C.gold : C.border);
  return (
    <div style={{transform: `scale(${s})`, opacity: s, borderRadius: 20, background: bg, border: `2px solid ${bord}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, textAlign: 'center',
      boxShadow: lit ? `0 0 30px ${C.teal}55` : 'none'}}>
      <div style={{fontSize: 52}}>{cell.e}</div>
      <div style={{fontSize: 22, fontWeight: 800, color: C.ink, lineHeight: 1.1}}>{cell.t}</div>
      {cell.free && <div style={{fontSize: 15, fontWeight: 900, color: C.gold, letterSpacing: 1}}>FREE</div>}
      {lit && litS > 0.4 && <div style={{position: 'absolute', fontSize: 40, transform: `scale(${litS})`}}>✔️</div>}
    </div>
  );
};

const GridScene = () => {
  const f = useCurrentFrame();
  const bingoStart = 150;
  const bingoF = f - bingoStart;
  const showBingoWord = f >= bingoStart + 26;
  const bw = showBingoWord ? spring({frame: f - (bingoStart + 26), fps: 30, config: {damping: 10, mass: 0.7}}) : 0;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 60}}>
      <div style={{fontSize: 34, fontWeight: 900, color: C.gold, letterSpacing: 2, marginBottom: 26, opacity: spring({frame: f, fps: 30, config: {damping: 16}})}}>SÜNDEN-BINGO 🎰</div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 300px)', gridAutoRows: 300, gap: 18, position: 'relative'}}>
        {CELLS.map((c, i) => (
          <Cell key={i} cell={c} i={i} localF={f} inBingo={BINGO_LINE.includes(i)} bingoF={bingoF} />
        ))}
      </div>
      {showBingoWord && (
        <div style={{marginTop: 40, transform: `scale(${bw}) rotate(${-4 + bw * 4}deg)`, opacity: bw,
          padding: '14px 40px', borderRadius: 18, background: C.teal, color: '#04120f', fontSize: 56, fontWeight: 900, letterSpacing: 2}}>
          BINGO? 😬
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
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 26}}>
      <div style={{fontSize: 96, transform: `scale(${a})`}}>🎰</div>
      <div style={{fontSize: 68, fontWeight: 900, color: C.ink, lineHeight: 1.06, opacity: a}}>Website-Sünden-<span style={{color: C.gold}}>Bingo</span></div>
      <div style={{fontSize: 33, fontWeight: 700, color: C.muted, opacity: b, transform: `translateY(${(1 - b) * 24}px)`}}>Wie viele triffst DU? 👇</div>
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
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.12}}>3 in einer Reihe?<br /><span style={{color: C.teal}}>Zeit für was Neues.</span></div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 42}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 46px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 35, fontWeight: 900}}>👇 Wie viele hast DU getroffen?</div>
        </div>
        <div style={{marginTop: 32, fontSize: 34, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebsiteBingo = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(720px 720px at 540px 760px, rgba(245,185,69,0.10), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={56}><HookScene /></Sequence>
      <Sequence from={56} durationInFrames={250}><GridScene /></Sequence>
      <Sequence from={306} durationInFrames={124}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
