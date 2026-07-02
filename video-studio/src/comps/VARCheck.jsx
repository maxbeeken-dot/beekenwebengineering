import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
  pitch: '#0b7a3e', off: '#ff2e5e', blue: '#26c6ff',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";
const REVEAL = 235;

// Fußballverein-Landingpage: schöner Hero, aber der CTA-Button liegt UNTER der Falz → „im Abseits".
const MockSite = () => (
  <div style={{height: '100%', background: '#0d1512', fontFamily: FONT, display: 'flex', flexDirection: 'column'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px'}}>
      <div style={{fontSize: 21, fontWeight: 900, color: '#fff'}}>TSV Sonnendorf ⚽</div>
      <div style={{display: 'flex', gap: 14, color: '#7c9a86', fontSize: 14, fontWeight: 600}}><span>Verein</span><span>Teams</span><span>Kontakt</span></div>
    </div>
    <div style={{flex: 1, margin: '0 22px 22px', borderRadius: 14, background: 'linear-gradient(140deg,#12452a,#0a2a1a)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 28}}>
      <div style={{fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1.1}}>Werde Teil<br />des Teams.</div>
      <div style={{fontSize: 17, color: '#a9c4b4', marginTop: 12, maxWidth: 440}}>Training für alle Altersklassen. Komm vorbei, schnupper rein und werde Teil der Sonnendorf-Familie.</div>
    </div>
  </div>
);

const Browser = ({children, w = 720, h = 640}) => (
  <div style={{width: w, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 55px rgba(0,0,0,0.5)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '11px 16px', background: C.cardHi, borderBottom: `1px solid ${C.border}`}}>
      <div style={{width: 10, height: 10, borderRadius: '50%', background: C.red}} />
      <div style={{width: 10, height: 10, borderRadius: '50%', background: C.gold}} />
      <div style={{width: 10, height: 10, borderRadius: '50%', background: C.teal}} />
      <div style={{marginLeft: 10, flex: 1, height: 18, background: C.card, borderRadius: 9, paddingLeft: 10, color: C.muted, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center'}}>tsv-sonnendorf.de</div>
    </div>
    <div style={{height: h}}>{children}</div>
  </div>
);

const Stage = () => {
  const f = useCurrentFrame();
  const title = spring({frame: f, fps: 30, config: {damping: 14}});
  const rec = Math.sin(f * 0.5) > 0;
  // Abseitslinie fährt während des Checks ein und rastet an der „Falz" (Browser-Unterkante) ein
  const lineIn = interpolate(f, [80, 160], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const checking = f < REVEAL;
  const stamp = spring({frame: f - REVEAL, fps: 30, config: {damping: 10, mass: 0.7}});
  const guessPulse = 1 + Math.sin(f * 0.18) * 0.05;
  const guessOut = interpolate(f, [REVEAL - 15, REVEAL], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const reasonIn = interpolate(f, [REVEAL + 20, REVEAL + 42], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ghostGlow = checking ? 0.6 : 1;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 70, gap: 22}}>
      {/* VAR-Header */}
      <div style={{opacity: title, transform: `translateY(${(1 - title) * -20}px)`, textAlign: 'center'}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, background: C.off, color: '#fff', fontWeight: 900, fontSize: 26, letterSpacing: 3, padding: '8px 18px', borderRadius: 8}}>
          <span style={{width: 12, height: 12, borderRadius: '50%', background: rec ? '#fff' : 'rgba(255,255,255,0.35)'}} /> VAR-CHECK ⚽
        </div>
        <div style={{fontSize: 50, fontWeight: 900, color: C.ink, marginTop: 14}}>Zählt dieser Treffer?</div>
      </div>

      {/* Replay: Browser + Abseitslinie + Ghost-CTA */}
      <div style={{position: 'relative', width: 720, marginTop: 8}}>
        <Browser><MockSite /></Browser>

        {/* Abseitslinie an der Falz */}
        <div style={{position: 'absolute', left: -30, right: -30, bottom: -2, height: 4, background: checking ? C.blue : C.off, opacity: lineIn, boxShadow: `0 0 18px ${checking ? C.blue : C.off}`}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: -110, height: 110, background: `linear-gradient(${checking ? 'rgba(38,198,255,0.16)' : 'rgba(255,46,94,0.20)'}, transparent)`, opacity: lineIn}} />
        <div style={{position: 'absolute', right: -24, bottom: 6, transform: 'translateY(50%)', color: checking ? C.blue : C.off, fontWeight: 800, fontSize: 20, opacity: lineIn}}>◄ Falz</div>

        {/* Ghost-CTA unter der Falz (im Abseits) */}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: -96, display: 'flex', justifyContent: 'center', opacity: lineIn * ghostGlow}}>
          <div style={{padding: '13px 28px', borderRadius: 10, border: `2px dashed ${checking ? C.blue : C.off}`, color: checking ? C.blue : C.off, fontWeight: 900, fontSize: 22, background: 'rgba(8,8,11,0.7)'}}>⚽ Jetzt Mitglied werden</div>
        </div>

        {/* CHECKING-Pill / Urteil-Stempel */}
        {checking ? (
          <div style={{position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(8,8,11,0.8)', border: `1px solid ${C.blue}`, color: C.blue, fontWeight: 800, fontSize: 20, padding: '6px 14px', borderRadius: 8}}>
            <span style={{width: 10, height: 10, borderRadius: '50%', background: rec ? C.blue : 'transparent', border: `2px solid ${C.blue}`}} /> VAR CHECKING…
          </div>
        ) : (
          <div style={{position: 'absolute', top: 150, left: '50%', transform: `translate(-50%,-50%) rotate(-11deg) scale(${stamp})`, border: `5px solid ${C.off}`, color: C.off, borderRadius: 14, padding: '12px 26px', fontSize: 56, fontWeight: 900, letterSpacing: 2, background: 'rgba(8,8,11,0.72)', whiteSpace: 'nowrap'}}>KEIN TOR ❌</div>
        )}
      </div>

      {/* Prompt / Erklärung */}
      <div style={{position: 'relative', width: '100%', height: 220, display: 'flex', justifyContent: 'center', marginTop: 130}}>
        <div style={{position: 'absolute', opacity: guessOut, transform: `scale(${guessPulse})`, fontSize: 46, fontWeight: 900, color: C.ink, marginTop: 10}}>Tor oder kein Tor? 🤔</div>
        <div style={{position: 'absolute', opacity: reasonIn, textAlign: 'center', maxWidth: 860, marginTop: 4}}>
          <div style={{fontSize: 40, fontWeight: 900, color: C.off, marginBottom: 12}}>CTA im Abseits. 🚩</div>
          <div style={{fontSize: 30, color: C.muted, fontWeight: 700, lineHeight: 1.3}}>Der Button liegt <span style={{color: C.ink}}>unter der Falz</span> — niemand scrollt so weit. Ein klarer CTA gehört <span style={{color: C.teal}}>oben, sofort sichtbar</span>.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 14}});
  const line2 = spring({frame: f - 18, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 24}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 60, color: C.ink, fontWeight: 900, lineHeight: 1.12}}>Steht dein CTA<br />im <span style={{color: C.off}}>Abseits</span>?</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 44}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '24px 46px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 36, fontWeight: 900}}>👇 Tor oder Abseits? Verrat's mir</div>
        </div>
        <div style={{marginTop: 34, fontSize: 34, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const VARCheck = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 540], [-200, 200]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${540 + bgGlowX}px 820px, rgba(11,122,62,0.16), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={430}><Stage /></Sequence>
      <Sequence from={430} durationInFrames={110}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
