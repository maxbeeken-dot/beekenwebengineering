import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const HOOK = 45, BAR = 90, RACE = 120, SHIELD = 90, COMMENT = 60, CTA = 105; // 510 = 17 s
const MAXBAR = 780;

const HookScene = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [2, 26], [0, 75], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const snap = spring({frame: f - 26, fps: 30, config: {damping: 10, mass: 0.5}});
  const shield = interpolate(f, [24, 30, 44], [0, 1, 0.35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sub = spring({frame: f - 22, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 14}}>
      <div style={{fontSize: 74, opacity: shield}}>🛡️</div>
      <div style={{fontSize: 190, fontWeight: 900, color: C.teal, lineHeight: 1, fontVariantNumeric: 'tabular-nums', transform: `scale(${1 + snap * 0.06})`, textShadow: `0 0 40px ${C.teal}55`}}>
        {n} %
      </div>
      <div style={{fontSize: 40, fontWeight: 800, color: C.ink, opacity: sub, maxWidth: 860, lineHeight: 1.2}}>
        urteilen <span style={{color: C.gold}}>sofort</span> über deine Firma.
      </div>
    </AbsoluteFill>
  );
};

const BarScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const fill = interpolate(f, [14, 66], [0, 75], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 34}}>
      <div style={{fontSize: 44, fontWeight: 900, color: C.ink, opacity: a, lineHeight: 1.22, maxWidth: 900}}>
        …über die <span style={{color: C.teal}}>Glaubwürdigkeit</span> —<br />
        <span style={{fontSize: 34, color: C.muted}}>allein anhand der Website.</span>
      </div>
      <div style={{width: 820, height: 46, background: C.card, border: `2px solid ${C.border}`, borderRadius: 40, overflow: 'hidden'}}>
        <div style={{width: `${fill}%`, height: '100%', background: `linear-gradient(90deg, ${C.violet}, ${C.teal})`, borderRadius: 40, boxShadow: `0 0 26px ${C.teal}44`}} />
      </div>
      <div style={{fontSize: 46, fontWeight: 900, color: C.teal, fontVariantNumeric: 'tabular-nums'}}>{Math.round(fill)} %</div>
    </AbsoluteFill>
  );
};

const Column = ({f, delay, pct, label, color, tint, big}) => {
  const g = spring({frame: f - delay, fps: 30, config: {damping: 18, mass: 1}});
  const h = (MAXBAR * pct) / 100 * g;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 14, flex: 1}}>
      <div style={{fontSize: big ? 54 : 40, fontWeight: 900, color, opacity: g, fontVariantNumeric: 'tabular-nums'}}>{Math.round(pct * g)} %</div>
      <div style={{width: '78%', height: h, background: tint, border: `2px solid ${color}77`, borderRadius: 16, boxShadow: big ? `0 0 34px ${color}33` : 'none'}} />
      <div style={{fontSize: 26, fontWeight: 800, color: C.muted, textAlign: 'center', minHeight: 76, lineHeight: 1.25, whiteSpace: 'pre-line'}}>{label}</div>
    </div>
  );
};

const RaceScene = () => {
  const f = useCurrentFrame();
  const cap = spring({frame: f - 70, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '170px 60px 0', gap: 26}}>
      <div style={{display: 'flex', gap: 40, alignItems: 'flex-end', width: 860, height: MAXBAR + 150}}>
        <Column f={f} delay={0} pct={75} label={'Website-\nDesign'} color={C.teal} tint="linear-gradient(180deg, rgba(52,227,208,0.35), rgba(124,92,255,0.18))" big />
        <Column f={f} delay={14} pct={25} label={'Preis · Produkt\n· Service'} color={C.dim} tint="rgba(86,85,95,0.22)" />
      </div>
      <div style={{fontSize: 36, fontWeight: 800, color: C.ink, opacity: cap, textAlign: 'center', maxWidth: 860}}>
        Bevor sie <span style={{color: C.gold}}>ein Wort</span> gelesen haben.
      </div>
    </AbsoluteFill>
  );
};

const ShieldScene = () => {
  const f = useCurrentFrame();
  const s = spring({frame: f, fps: 30, config: {damping: 12, mass: 0.6}});
  const lock = spring({frame: f - 30, fps: 30, config: {damping: 9, mass: 0.5}});
  const q = spring({frame: f - 44, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 26}}>
      <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: 300,
          border: `4px solid ${C.teal}`, opacity: lock * 0.5, transform: `scale(${0.7 + lock * 0.3})`,
        }} />
        <div style={{fontSize: 180, transform: `scale(${0.6 + s * 0.4})`, filter: `drop-shadow(0 0 34px ${C.teal}66)`}}>🛡️</div>
      </div>
      <div style={{fontSize: 48, fontWeight: 900, color: C.ink, opacity: q, transform: `translateY(${(1 - q) * 22}px)`, lineHeight: 1.2, maxWidth: 900}}>
        Sieht deine Seite <span style={{color: C.teal}}>vertrauenswürdig</span> aus —<br />oder <span style={{color: C.red}}>billig</span>?
      </div>
    </AbsoluteFill>
  );
};

const CommentScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const pulse = 1 + Math.sin(f * 0.3) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{fontSize: 50, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${pulse})`, lineHeight: 1.2, maxWidth: 920}}>
        Woran erkennst <span style={{color: C.gold}}>DU</span> sofort<br />eine unseriöse Website? 👇
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 24, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 18}}>
      <div style={{opacity: pop, transform: `scale(${0.9 + pop * 0.1})`}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 48, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 10, maxWidth: 900}}>
          Der <span style={{color: C.teal}}>erste Klick</span> entscheidet<br />über Vertrauen.
        </div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`, marginTop: 24}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DreiVonVier = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(780px 780px at 540px 460px, rgba(52,227,208,0.08), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={BAR}><BarScene /></Sequence>
      <Sequence from={HOOK + BAR} durationInFrames={RACE}><RaceScene /></Sequence>
      <Sequence from={HOOK + BAR + RACE} durationInFrames={SHIELD}><ShieldScene /></Sequence>
      <Sequence from={HOOK + BAR + RACE + SHIELD} durationInFrames={COMMENT}><CommentScene /></Sequence>
      <Sequence from={HOOK + BAR + RACE + SHIELD + COMMENT} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
