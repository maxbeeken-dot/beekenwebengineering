import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";
const HOOK = 56, CASE = 100, CTA_LEN = 120;

// EKG-Monitor: kranke (rot, flach/unruhig) oder gesunde (grün) Kurve
const EKG = ({healthy, seed = 0}) => {
  const f = useCurrentFrame();
  const w = 760, h = 150, mid = h / 2;
  const pts = [];
  for (let x = 0; x <= w; x += 8) {
    const phase = (x + f * 6 + seed * 40) % 160;
    let y = mid;
    if (healthy) {
      // sauberer Puls
      if (phase > 60 && phase < 72) y = mid - 55;
      else if (phase >= 72 && phase < 84) y = mid + 30;
      else y = mid + Math.sin((x + f * 6) * 0.05) * 3;
    } else {
      // schwach + unregelmäßig
      y = mid + Math.sin((x + f * 4) * 0.09) * 8 + (phase > 120 && phase < 128 ? -18 : 0);
    }
    pts.push(`${x},${y.toFixed(1)}`);
  }
  const col = healthy ? C.green : C.red;
  return (
    <div style={{width: w, background: '#0a0f0d', border: `2px solid ${C.border}`, borderRadius: 16, padding: 14, boxShadow: `0 0 30px ${col}22`}}>
      <svg width={w - 4} height={h} style={{display: 'block'}}>
        {[...Array(6)].map((_, i) => <line key={i} x1={0} x2={w} y1={(i + 1) * (h / 7)} y2={(i + 1) * (h / 7)} stroke="#ffffff08" strokeWidth={1} />)}
        <polyline points={pts.join(' ')} fill="none" stroke={col} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" style={{filter: `drop-shadow(0 0 6px ${col})`}} />
      </svg>
    </div>
  );
};

const CASES = [
  {symptom: 'Besucher springen sofort ab', diag: 'Ladezeit-Kollaps', icon: '⏱️', bpm: 38, rezept: 'Rezept: handgecodet → lädt in 0,9 s'},
  {symptom: 'Niemand klickt, keine Anfrage', diag: 'CTA-Mangel', icon: '🎯', bpm: 44, rezept: 'Rezept: ein klarer Button „Jetzt anfragen"'},
  {symptom: 'Unlesbar auf dem Handy', diag: 'Mobil-Fraktur', icon: '📱', bpm: 41, rezept: 'Rezept: mobil-first statt geschrumpft'},
];

const CaseScene = ({data, index}) => {
  const f = useCurrentFrame();
  const intro = spring({frame: f, fps: 30, config: {damping: 15}});
  const diagAt = 40;
  const rezAt = 68;
  const diagShown = f >= diagAt;
  const rezShown = f >= rezAt;
  const diagPop = spring({frame: f - diagAt, fps: 30, config: {damping: 11, mass: 0.7}});
  const rezPop = spring({frame: f - rezAt, fps: 30, config: {damping: 13}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 50, gap: 24}}>
      <div style={{opacity: intro, fontSize: 26, fontWeight: 800, color: C.muted, letterSpacing: 2}}>PATIENT {index + 1}/3</div>
      {/* EKG-Monitor */}
      <div style={{transform: `scale(${0.95 + intro * 0.05})`, position: 'relative'}}>
        <EKG healthy={false} seed={index} />
        <div style={{position: 'absolute', top: 20, right: 30, textAlign: 'right'}}>
          <div style={{fontSize: 42, fontWeight: 900, color: C.red, lineHeight: 1}}>{data.bpm}<span style={{fontSize: 20}}> BPM</span></div>
          <div style={{fontSize: 20, fontWeight: 700, color: C.red}}>kritisch</div>
        </div>
      </div>
      {/* Symptom */}
      <div style={{opacity: intro, fontSize: 34, fontWeight: 700, color: C.ink, textAlign: 'center'}}>🩺 „{data.symptom}"</div>
      {/* Diagnose */}
      {diagShown && (
        <div style={{transform: `scale(${diagPop})`, opacity: diagPop, border: `5px solid ${C.red}`, color: C.red, padding: '10px 30px', borderRadius: 14, fontSize: 44, fontWeight: 900}}>
          {data.icon} {data.diag}
        </div>
      )}
      {/* Rezept */}
      {rezShown && (
        <div style={{opacity: rezPop, transform: `translateY(${(1 - rezPop) * 16}px)`, fontSize: 30, fontWeight: 700, color: C.teal, textAlign: 'center', maxWidth: 760}}>{data.rezept}</div>
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
      <div style={{fontSize: 96, transform: `scale(${a})`}}>🏥</div>
      <div style={{fontSize: 68, fontWeight: 900, color: C.ink, lineHeight: 1.08, opacity: a}}>Website-<br /><span style={{color: C.red}}>Notaufnahme</span></div>
      <div style={{fontSize: 32, fontWeight: 700, color: C.muted, opacity: b, transform: `translateY(${(1 - b) * 24}px)`}}>Diagnose: Warum kommen keine Kunden? 👇</div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line2 = spring({frame: f - 24, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  const healed = spring({frame: f - 6, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 22}}>
      <div style={{transform: `scale(${healed})`, opacity: healed}}><EKG healthy={true} /></div>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 28, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 10}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 56, color: C.ink, fontWeight: 900, lineHeight: 1.12}}>Handgecodet =<br /><span style={{color: C.green}}>kerngesund</span> ✅</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 14}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '22px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 32, fontWeight: 900}}>👇 Welche Diagnose hat DEINE Seite?</div>
        </div>
        <div style={{marginTop: 26, fontSize: 32, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const WebsiteNotaufnahme = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at 540px 820px, rgba(255,84,104,0.10), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      {CASES.map((c, i) => (
        <Sequence key={i} from={HOOK + i * CASE} durationInFrames={CASE}><CaseScene data={c} index={i} /></Sequence>
      ))}
      <Sequence from={HOOK + CASES.length * CASE} durationInFrames={CTA_LEN}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
