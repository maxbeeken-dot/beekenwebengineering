import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Szenenlängen (30 fps) → 45 + 4·105 + 60 + 45 = 570 = 19,0 s
const HOOK = 45, EX = 105, WENDE = 60, CTA = 45;

// Typewriter über Codepoints (Emoji nie mitten zerschneiden)
const glyphs = (t) => Array.from(t);
const typeUpTo = (t, f, s, e) => {
  const g = glyphs(t);
  const n = Math.round(interpolate(f, [s, e], [0, g.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return g.slice(0, n).join('');
};
const caretOn = (f) => Math.floor(f / 7) % 2 === 0;

// Selbst-Ausreden: schwarz getippt → durchgestrichen → teal überschrieben (gleiche Zeile)
const AUSREDEN = [
  {excuse: '„Kunden finden mich auch ohne Website.“', reality: 'Sie googeln dich zuerst.', emoji: '🔎'},
  {excuse: '„Meine Instagram-Seite reicht doch.“', reality: 'Ohne eigene Seite? Halb unsichtbar.', emoji: ''},
  {excuse: '„Mundpropaganda genügt mir.“', reality: 'Empfohlen — und trotzdem gegoogelt.', emoji: ''},
  {excuse: '„Ob’s am Handy läuft, ist egal.“', reality: '8 von 10 Besuchern sind mobil.', emoji: '📱'},
];

const HookScene = () => {
  const f = useCurrentFrame();
  const text = 'Bist du bei deiner Website delulu? 💅';
  const shown = typeUpTo(text, f, 2, 30);
  const done = f >= 30;
  const pop = spring({frame: f - 30, fps: 30, config: {damping: 12, mass: 0.5}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 72}}>
      <div style={{fontSize: 58, fontWeight: 900, color: C.ink, lineHeight: 1.18, maxWidth: 900, transform: `scale(${done ? 1 + pop * 0.04 : 1})`}}>
        {shown}
        {!done && caretOn(f) && <span style={{color: C.violet}}>|</span>}
      </div>
    </AbsoluteFill>
  );
};

const AusredeScene = ({excuse, reality, emoji}) => {
  const f = useCurrentFrame();
  const typeS = 2, typeE = 30, glitchAt = 34;
  const strikeS = 36, strikeE = 56, stampAt = 46;
  const crossS = 62, crossE = 82;

  const shown = typeUpTo(excuse, f, typeS, typeE);
  const typing = f < strikeS;

  const gd = f - glitchAt;
  const gAmt = gd >= 0 && gd < 12 ? 1 - gd / 12 : 0;
  const jitter = Math.sin(f * 3.4) * gAmt * 9;
  const rgb = gAmt > 0.02 ? `${2 + gAmt * 5}px 0 ${C.red}, ${-(2 + gAmt * 5)}px 0 ${C.teal}` : 'none';

  const strikeW = interpolate(f, [strikeS, strikeE], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const stamp = spring({frame: f - stampAt, fps: 30, config: {damping: 9, mass: 0.6}});
  const exOp = interpolate(f, [crossS, crossE], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rSpring = spring({frame: f - crossS, fps: 30, config: {damping: 15, mass: 0.7}});
  const rOp = interpolate(f, [crossS, crossE], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 80px'}}>
      <div style={{position: 'relative', width: 920, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {/* Ausrede + roter Durchstrich */}
        <div style={{position: 'absolute', left: 0, width: '100%', display: 'flex', justifyContent: 'center', opacity: exOp, transform: `translateX(${jitter}px)`}}>
          <span style={{position: 'relative', display: 'inline-block', fontSize: 37, fontWeight: 800, color: C.ink, whiteSpace: 'nowrap', textShadow: rgb, letterSpacing: 0.2}}>
            {shown}
            {typing && caretOn(f) && <span style={{color: C.violet}}>|</span>}
            <div style={{position: 'absolute', left: 0, top: '52%', height: 6, width: `${strikeW * 100}%`, background: C.red, borderRadius: 4, transform: 'translateY(-50%) rotate(-1.5deg)', boxShadow: `0 0 16px ${C.red}88`}} />
          </span>
        </div>

        {/* DELULU-Stempel (knallt drauf) */}
        {stamp > 0.001 && (
          <div style={{position: 'absolute', left: '50%', top: 44, opacity: exOp, transform: `translateX(-50%) rotate(-9deg) scale(${0.6 + stamp * 0.6})`}}>
            <div style={{fontSize: 46, fontWeight: 900, color: C.red, border: `4px solid ${C.red}`, borderRadius: 14, padding: '8px 26px', background: 'rgba(255,84,104,0.10)', letterSpacing: 2, boxShadow: `0 0 30px ${C.red}55`}}>
              DELULU 💅
            </div>
          </div>
        )}

        {/* Realität — überschreibt an gleicher Zeilen-Position (teal) */}
        <div style={{position: 'absolute', left: 0, width: '100%', display: 'flex', justifyContent: 'center', opacity: rOp}}>
          <span style={{transform: `translateY(${(1 - rSpring) * 26}px) scale(${0.92 + rSpring * 0.08})`, fontSize: 46, fontWeight: 900, color: C.teal, textAlign: 'center', maxWidth: 860, lineHeight: 1.18, textShadow: `0 0 26px ${C.teal}44`}}>
            {reality}{emoji ? ' ' + emoji : ''}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const WendeScene = () => {
  const f = useCurrentFrame();
  const mix = interpolate(f, [4, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rot = interpolate(f, [0, WENDE], [-25, 20]);
  const a = spring({frame: f - 8, fps: 30, config: {damping: 14, mass: 0.7}});
  const check = spring({frame: f - 26, fps: 30, config: {damping: 8, mass: 0.5}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(820px 820px at 50% 46%, rgba(124,92,255,0.22), transparent 70%)', transform: `rotate(${rot}deg)`}} />
      <AbsoluteFill style={{opacity: mix, background: 'radial-gradient(820px 820px at 50% 46%, rgba(52,227,208,0.24), transparent 70%)', transform: `rotate(${-rot}deg)`}} />
      <div style={{opacity: a, transform: `translateY(${(1 - a) * 24}px)`, maxWidth: 900}}>
        <div style={{fontSize: 34, fontWeight: 800, color: C.teal, letterSpacing: 3, marginBottom: 16}}>NICHT DELULU</div>
        <div style={{fontSize: 58, fontWeight: 900, color: C.ink, lineHeight: 1.14}}>
          Eine Website, die dich <span style={{color: C.teal}}>sichtbar</span> macht.
          <span style={{display: 'inline-block', transform: `scale(${check})`, marginLeft: 12}}>✅</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 14, fps: 30, config: {damping: 15}});
  const bait = spring({frame: f - 26, fps: 30, config: {damping: 14}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 18}}>
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -18}px)`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 58, color: C.ink, fontWeight: 900, lineHeight: 1.1, marginTop: 10}}>
          Sichtbar werden <span style={{color: C.teal}}>→</span>
        </div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`, marginTop: 14}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900, boxShadow: `0 0 40px ${C.violet}55`}}>
          beekenwebengineering.com
        </div>
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 20, fontSize: 30, fontWeight: 800, color: C.gold, maxWidth: 820, lineHeight: 1.25}}>
        Welcher Gedanke war am delulusten? 💀
      </div>
    </AbsoluteFill>
  );
};

export const DeluluCheck = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(760px 760px at 540px 620px, rgba(124,92,255,0.10), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={EX}><AusredeScene {...AUSREDEN[0]} /></Sequence>
      <Sequence from={HOOK + EX} durationInFrames={EX}><AusredeScene {...AUSREDEN[1]} /></Sequence>
      <Sequence from={HOOK + EX * 2} durationInFrames={EX}><AusredeScene {...AUSREDEN[2]} /></Sequence>
      <Sequence from={HOOK + EX * 3} durationInFrames={EX}><AusredeScene {...AUSREDEN[3]} /></Sequence>
      <Sequence from={HOOK + EX * 4} durationInFrames={WENDE}><WendeScene /></Sequence>
      <Sequence from={HOOK + EX * 4 + WENDE} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
