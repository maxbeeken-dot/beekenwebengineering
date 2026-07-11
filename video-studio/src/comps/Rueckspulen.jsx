import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Reverse-Timecode-Story · 30 fps → Summe = 555 Frames (18,5 s)
const ABSAGE = 60, REWIND = 60, MOMENT = 120, WEG = 90, DAVOR = 120, CTA = 105;

// 1) ABSAGE — die Nachricht fällt ein, der Auftrag wird durchgestrichen
const AbsageScene = () => {
  const f = useCurrentFrame();
  const drop = spring({frame: f, fps: 30, config: {damping: 12, mass: 0.9}});
  const sub = spring({frame: f - 24, fps: 30, config: {damping: 16}});
  const strike = interpolate(f, [32, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const flash = Math.max(0, 1 - f / 12) * 0.10;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 70, gap: 40}}>
      <AbsoluteFill style={{background: C.red, opacity: flash}} />
      <div style={{
        opacity: drop, transform: `translateY(${(1 - drop) * -170}px) rotate(${(1 - drop) * -2}deg)`,
        maxWidth: 820, background: C.card, border: `2px solid ${C.border}`,
        borderRadius: 28, borderTopLeftRadius: 6, padding: '30px 36px', boxShadow: '0 26px 64px rgba(0,0,0,0.55)',
      }}>
        <div style={{fontSize: 24, fontWeight: 800, color: C.muted, letterSpacing: 1, marginBottom: 14}}>Neue Nachricht</div>
        <div style={{fontSize: 47, fontWeight: 800, color: C.ink, lineHeight: 1.24}}>
          „Wir haben jemand<br />anderen genommen.“
        </div>
      </div>
      <div style={{opacity: sub, transform: `translateY(${(1 - sub) * 22}px)`, position: 'relative', display: 'inline-block'}}>
        <span style={{fontSize: 42, fontWeight: 900, color: C.dim, letterSpacing: 2}}>Auftrag: weg.</span>
        <div style={{position: 'absolute', top: '55%', left: -4, height: 5, borderRadius: 5, background: C.red, width: `calc(${strike * 100}% + ${strike * 8}px)`, boxShadow: `0 0 14px ${C.red}88`}} />
      </div>
    </AbsoluteFill>
  );
};

// 2) REWIND — ⏪, rückwärts laufender Timecode, ruckelnder Jitter
const RewindScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 9, mass: 0.5}});
  const txt = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  const jx = Math.sin(f * 2.3) * 4 + Math.sin(f * 0.9) * 2;
  const jy = Math.cos(f * 2.7) * 2.6;
  const secs = Math.max(0, interpolate(f, [4, 56], [8.6, 2.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const ss = String(Math.floor(secs)).padStart(2, '0');
  const cc = String(Math.floor((secs % 1) * 100)).padStart(2, '0');
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 70, gap: 30, transform: `translate(${jx}px, ${jy}px)`}}>
      <div style={{fontSize: 128, opacity: pop, transform: `scale(${0.55 + pop * 0.45})`, filter: `drop-shadow(0 0 24px ${C.teal}44)`}}>⏪</div>
      <div style={{fontSize: 100, fontWeight: 900, color: C.teal, fontVariantNumeric: 'tabular-nums', letterSpacing: 6, textShadow: `0 0 30px ${C.teal}55`}}>
        00:{ss}:{cc}
      </div>
      <div style={{fontSize: 46, fontWeight: 900, color: C.ink, textAlign: 'center', lineHeight: 1.24, opacity: txt, transform: `translateY(${(1 - txt) * 18}px)`}}>
        Spul zurück.<br /><span style={{color: C.muted, fontSize: 34, fontWeight: 700}}>Wo hast du sie verloren?</span>
      </div>
    </AbsoluteFill>
  );
};

// 3) DER MOMENT — eingefrorenes Handy, Inhalts-Kästen laufen über den Rand
const ROWS = [
  {w: 244, h: 46, tint: C.cardHi, broken: false},
  {w: 398, h: 54, tint: 'rgba(255,84,104,0.18)', broken: true},
  {w: 172, h: 40, tint: C.cardHi, broken: false},
  {w: 430, h: 60, tint: 'rgba(255,84,104,0.18)', broken: true},
  {w: 214, h: 44, tint: C.cardHi, broken: false},
];

const MomentScene = () => {
  const f = useCurrentFrame();
  const settle = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.8}});
  const txt = spring({frame: f - 44, fps: 30, config: {damping: 15}});
  const sub = spring({frame: f - 62, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '66px 40px 0', gap: 26}}>
      <div style={{position: 'relative', opacity: settle, transform: `translateY(${(1 - settle) * 44}px) scale(${0.93 + settle * 0.07})`}}>
        <div style={{width: 330, height: 560, background: C.bg, border: '10px solid #1c1b26', borderRadius: 46, position: 'relative', overflow: 'visible', boxShadow: '0 30px 84px rgba(0,0,0,0.6)'}}>
          <div style={{position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 120, height: 24, background: '#1c1b26', borderBottomLeftRadius: 14, borderBottomRightRadius: 14, zIndex: 2}} />
          <div style={{position: 'absolute', top: 16, left: 16, right: 16, bottom: 16, overflow: 'visible', display: 'flex', flexDirection: 'column', gap: 14}}>
            <div style={{marginTop: 22, width: 290, height: 72, borderRadius: 12, background: `linear-gradient(120deg, ${C.cardHi}, #241f33)`, border: `1px solid ${C.border}`}} />
            {ROWS.map((r, i) => (
              <div key={i} style={{
                width: r.w, height: r.h, borderRadius: 10, background: r.tint,
                border: r.broken ? `1.5px solid ${C.red}` : `1px solid ${C.border}`,
                boxShadow: r.broken ? `0 0 22px ${C.red}33` : 'none',
              }} />
            ))}
            <div style={{marginTop: 4, width: 290, height: 7, borderRadius: 7, background: C.border, position: 'relative'}}>
              <div style={{position: 'absolute', left: 0, top: 0, height: 7, width: 96, borderRadius: 7, background: C.red}} />
            </div>
          </div>
          <div style={{position: 'absolute', top: -14, right: -16, background: C.red, color: '#fff', fontSize: 22, fontWeight: 900, padding: '6px 14px', borderRadius: 10, fontVariantNumeric: 'tabular-nums', boxShadow: `0 0 20px ${C.red}66`}}>00:05</div>
        </div>
      </div>
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: 54, fontWeight: 900, color: C.ink, opacity: txt, transform: `translateY(${(1 - txt) * 18}px)`}}>
          Hier. <span style={{color: C.red}}>Sekunde 5.</span>
        </div>
        <div style={{fontSize: 32, fontWeight: 700, color: C.muted, opacity: sub, transform: `translateY(${(1 - sub) * 16}px)`, marginTop: 10}}>
          Auf dem Handy sah alles kaputt aus.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4) WEG — der Daumen 👆 tippt ❌, der Tab schließt sich
const WegScene = () => {
  const f = useCurrentFrame();
  const cardIn = spring({frame: f, fps: 30, config: {damping: 15, mass: 0.7}});
  const thumbY = interpolate(f, [6, 30], [360, 66], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const press = Math.max(0, 1 - Math.abs(f - 36) / 6);
  const xFlash = Math.max(0, 1 - Math.abs(f - 36) / 8);
  const close = f >= 40 ? spring({frame: f - 40, fps: 30, config: {damping: 16, mass: 0.7}}) : 0;
  const cardScale = cardIn * interpolate(close, [0, 1], [1, 0.18]);
  const cardOpacity = cardIn * interpolate(close, [0, 1], [1, 0]);
  const gone = spring({frame: f - 58, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '120px 40px 0'}}>
      <div style={{position: 'relative', width: 620, height: 460}}>
        <div style={{
          position: 'absolute', top: 40, left: 60, width: 500,
          opacity: cardOpacity, transform: `scale(${cardScale}) rotate(${close * -7}deg)`, transformOrigin: '90% 10%',
          background: C.card, border: `2px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
        }}>
          <div style={{height: 46, background: C.cardHi, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10}}>
            <div style={{width: 12, height: 12, borderRadius: 12, background: C.dim}} />
            <div style={{flex: 1, height: 20, borderRadius: 8, background: C.border}} />
            <div style={{
              width: 30, height: 30, borderRadius: 8, background: xFlash > 0.05 ? C.red : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, transform: `scale(${1 + xFlash * 0.35})`,
            }}>❌</div>
          </div>
          <div style={{padding: 22, display: 'flex', flexDirection: 'column', gap: 12}}>
            <div style={{width: '80%', height: 30, borderRadius: 8, background: C.cardHi}} />
            <div style={{width: '96%', height: 16, borderRadius: 6, background: C.border}} />
            <div style={{width: '70%', height: 16, borderRadius: 6, background: C.border}} />
            <div style={{width: 150, height: 34, borderRadius: 9, background: C.violet, marginTop: 6}} />
          </div>
        </div>
        <div style={{position: 'absolute', top: thumbY, left: 470, fontSize: 96, transform: `translateY(${press * 16}px) scale(${1 - press * 0.08})`, filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.5))'}}>👆</div>
      </div>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{fontSize: 58, fontWeight: 900, color: C.ink, opacity: gone, transform: `translateY(${(1 - gone) * 20}px)`, textAlign: 'center'}}>
          Sie war <span style={{color: C.red}}>schon weg</span>.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 5) DAVOR — Kamera zieht auf die Zeitleiste zurück, Marker faden rückwärts
const MARKERS = [
  {label: 'Absage', color: C.red},
  {label: 'Der Anruf', color: C.ink},
  {label: 'Das Angebot', color: C.ink},
  {label: 'Ihr Name', color: C.violet},
];

const DavorScene = () => {
  const f = useCurrentFrame();
  const enter = spring({frame: f, fps: 30, config: {damping: 16}});
  const zoom = interpolate(f, [0, 110], [1.32, 0.82], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const panX = interpolate(f, [0, 110], [-150, 130], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const outro = spring({frame: f - 88, fps: 30, config: {damping: 16}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
      <div style={{position: 'relative', width: 900, height: 300, opacity: enter, transform: `translateX(${panX}px) scale(${zoom})`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 3, background: C.border}} />
        {MARKERS.map((m, i) => {
          const fade = 1 - interpolate(f, [14 + i * 20, 30 + i * 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const x = 720 - i * 210;
          const up = i % 2 === 0;
          return (
            <div key={i} style={{position: 'absolute', left: x, top: '50%', opacity: fade * enter, transform: `translate(-50%,-50%)`}}>
              <div style={{width: 20, height: 20, borderRadius: 20, background: m.color, boxShadow: `0 0 18px ${m.color}66`, transform: 'translateY(-50%)', position: 'absolute', left: '50%', marginLeft: -10, top: '50%'}} />
              <div style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: up ? -74 : 34, fontSize: 30, fontWeight: 900, color: m.color, whiteSpace: 'nowrap'}}>{m.label}</div>
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 70}}>
        <div style={{fontSize: 50, fontWeight: 900, color: C.ink, textAlign: 'center', lineHeight: 1.24, opacity: outro, transform: `translateY(${(1 - outro) * 22}px)`, maxWidth: 900}}>
          Bevor du je von ihr<br /><span style={{color: C.muted}}>gehört hast.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 6) CTA — fast schwarz, blinkender Cursor, Aussage + Marke + Button + Köder
const CtaScene = () => {
  const f = useCurrentFrame();
  const brand = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const line = spring({frame: f, fps: 30, config: {damping: 15, mass: 0.7}});
  const btn = spring({frame: f - 30, fps: 30, config: {damping: 14}});
  const bait = spring({frame: f - 48, fps: 30, config: {damping: 16}});
  const cursorOn = Math.floor(f / 14) % 2 === 0;
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{background: '#050506', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 64, gap: 22}}>
      <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 5, opacity: brand}}>BEEKEN WEB ENGINEERING</div>
      <div style={{fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 920, opacity: line, transform: `translateY(${(1 - line) * 18}px)`}}>
        Der teuerste Auftrag ist der,<br />den du <span style={{color: C.red}}>nie bemerkst</span>.
        <span style={{display: 'inline-block', width: 6, height: 44, marginLeft: 8, verticalAlign: '-6px', background: cursorOn ? C.teal : 'transparent'}} />
      </div>
      <div style={{opacity: btn, transform: `translateY(${(1 - btn) * 20}px) scale(${pulse})`, marginTop: 12, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>
        beekenwebengineering.com
      </div>
      <div style={{opacity: bait, transform: `translateY(${(1 - bait) * 18}px)`, marginTop: 10, fontSize: 29, fontWeight: 800, color: C.gold, maxWidth: 880, lineHeight: 1.3}}>
        Wie viele solche Kunden hattest du diesen Monat —<br /><span style={{color: C.muted, fontWeight: 700}}>ohne es zu merken?</span>
      </div>
    </AbsoluteFill>
  );
};

export const Rueckspulen = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(760px 760px at 540px 520px, rgba(124,92,255,0.10), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={ABSAGE}><AbsageScene /></Sequence>
      <Sequence from={ABSAGE} durationInFrames={REWIND}><RewindScene /></Sequence>
      <Sequence from={ABSAGE + REWIND} durationInFrames={MOMENT}><MomentScene /></Sequence>
      <Sequence from={ABSAGE + REWIND + MOMENT} durationInFrames={WEG}><WegScene /></Sequence>
      <Sequence from={ABSAGE + REWIND + MOMENT + WEG} durationInFrames={DAVOR}><DavorScene /></Sequence>
      <Sequence from={ABSAGE + REWIND + MOMENT + WEG + DAVOR} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
