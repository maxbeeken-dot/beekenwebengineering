import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f', pitch: '#0b7a3e',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 5 Web-Fouls. card: 'gelb' | 'rot' | 'gelbrot'
const FOULS = [
  {foul: 'Auto-Play-Musik beim Laden', emoji: '🔊', card: 'rot',     verdict: 'Glatt Rot', why: 'verjagt Besucher in Sekunde 1'},
  {foul: 'Popup, bevor man was sieht',  emoji: '🪧', card: 'rot',     verdict: 'Glatt Rot', why: 'Werbung vor Inhalt = Foulspiel'},
  {foul: 'Kein Schloss (kein HTTPS)',   emoji: '🔓', card: 'rot',     verdict: 'Glatt Rot', why: 'unsicher + Google straft ab'},
  {foul: 'Lädt über 3 Sekunden',        emoji: '🐌', card: 'gelbrot', verdict: 'Gelb-Rot',  why: 'die Hälfte springt vorher ab'},
  {foul: 'Stockfoto-Handschlag',        emoji: '🤝', card: 'gelb',    verdict: 'Gelb',      why: 'unecht — kostet Vertrauen'},
];
const ROUND_LEN = 100;
const HOOK = 74;
const REVEAL = 58; // Frame innerhalb der Runde, ab dem die Karte kommt

const cardColor = (c) => (c === 'gelb' ? C.gold : c === 'rot' ? C.red : C.gold);
const cardColor2 = (c) => (c === 'gelbrot' ? C.red : cardColor(c));

const Whistle = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 12, mass: 0.5}});
  return (
    <div style={{position: 'absolute', top: 60, left: '50%', transform: `translateX(-50%) scale(${0.85 + a * 0.15})`, opacity: a, zIndex: 20,
      display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: '12px 26px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)'}}>
      <span style={{fontSize: 34}}>🧑‍⚖️</span>
      <span style={{fontSize: 26, fontWeight: 800, color: C.ink, letterSpacing: 1}}>DER WEB-SCHIRI</span>
      <span style={{fontSize: 30}}>🟨🟥</span>
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const b = spring({frame: f - 24, fps: 30, config: {damping: 15}});
  const cardFlip = interpolate(f, [28, 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 28}}>
      <div style={{opacity: a, transform: `scale(${0.9 + a * 0.1})`, fontSize: 40}}>🧑‍⚖️⚽</div>
      <div style={{opacity: b, transform: `translateY(${(1 - b) * 30}px)`, fontSize: 74, fontWeight: 900, color: C.ink, lineHeight: 1.05}}>
        <span style={{color: C.red}}>Rote Karte</span><br />für deine<br />Website?
      </div>
      <div style={{transform: `rotateY(${(1 - cardFlip) * 90}deg) scale(${0.7 + cardFlip * 0.3})`, opacity: cardFlip,
        width: 150, height: 210, borderRadius: 14, background: C.red, boxShadow: `0 0 50px ${C.red}`, marginTop: 6}} />
      <div style={{opacity: b, fontSize: 30, color: C.muted, fontWeight: 700}}>5 Fouls. Welche Karte? 🤔</div>
    </AbsoluteFill>
  );
};

const FoulScene = ({item}) => {
  const f = useCurrentFrame();
  const intro = spring({frame: f, fps: 30, config: {damping: 15}});
  const guess = f >= REVEAL - 20 && f < REVEAL; // "Gelb oder Rot?" Denkpause
  const revealed = f >= REVEAL;
  const pop = spring({frame: f - REVEAL, fps: 30, config: {damping: 10, mass: 0.7}});
  const flip = interpolate(f, [REVEAL, REVEAL + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shake = revealed && f < REVEAL + 12 ? Math.sin(f * 3) * 4 : 0;
  const dual = item.card === 'gelbrot';
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 54, gap: 34, transform: `translateX(${shake}px)`}}>
      {/* Foul */}
      <div style={{opacity: intro, transform: `translateY(${(1 - intro) * -18}px)`, textAlign: 'center'}}>
        <div style={{fontSize: 24, fontWeight: 800, color: C.muted, letterSpacing: 2}}>FOUL</div>
        <div style={{fontSize: 72, marginTop: 10}}>{item.emoji}</div>
        <div style={{fontSize: 52, fontWeight: 900, color: C.ink, marginTop: 12, maxWidth: 860, lineHeight: 1.1}}>{item.foul}</div>
      </div>

      {/* Denkpause */}
      {guess && (
        <div style={{fontSize: 46, fontWeight: 900, color: C.gold, letterSpacing: 1}}>🟨 Gelb oder Rot? 🟥</div>
      )}

      {/* Karten-Reveal */}
      {revealed && (
        <div style={{display: 'flex', gap: 18, alignItems: 'center', transform: `scale(${0.6 + pop * 0.4})`}}>
          {(dual ? [C.gold, C.red] : [cardColor(item.card)]).map((col, i) => (
            <div key={i} style={{width: 168, height: 236, borderRadius: 16, background: col,
              transform: `rotateY(${(1 - flip) * 90}deg) rotate(${dual ? (i === 0 ? -6 : 6) : 0}deg)`,
              boxShadow: `0 0 55px ${col}`, border: '3px solid rgba(255,255,255,0.18)'}} />
          ))}
        </div>
      )}
      {revealed && (
        <div style={{opacity: pop, textAlign: 'center'}}>
          <div style={{fontSize: 54, fontWeight: 900, color: cardColor2(item.card)}}>{item.verdict} {dual ? '🟨🟥' : item.card === 'rot' ? '🟥' : '🟨'}</div>
          <div style={{fontSize: 30, color: C.muted, fontWeight: 700, marginTop: 8, maxWidth: 760}}>{item.why}</div>
        </div>
      )}
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
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 20}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 60, color: C.ink, fontWeight: 900, lineHeight: 1.12}}>Ich baue Seiten,<br />die <span style={{color: C.teal}}>kein Foul</span> spielen.</div>
        <div style={{fontSize: 30, color: C.muted, fontWeight: 700, marginTop: 20}}>Schnell · sicher · fair zu deinen Besuchern</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 44}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 44px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>👇 Welches Foul ist am schlimmsten?</div>
        </div>
        <div style={{marginTop: 32, fontSize: 34, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const RoteKarte = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 600], [-200, 200]);
  const showWhistle = f >= HOOK && f < HOOK + FOULS.length * ROUND_LEN;
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${540 + bgGlowX}px 940px, rgba(255,84,104,0.14), transparent 70%)`}} />
      {showWhistle && <Whistle />}
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      {FOULS.map((item, i) => (
        <Sequence key={i} from={HOOK + i * ROUND_LEN} durationInFrames={ROUND_LEN}>
          <FoulScene item={item} />
        </Sequence>
      ))}
      <Sequence from={HOOK + FOULS.length * ROUND_LEN} durationInFrames={120}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
