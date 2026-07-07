import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f', link: '#5b8dff',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";
const HOOK = 56, SEARCH = 330, CTA_LEN = 116;

const QUERY = 'Handwerker Bad Homburg';

const Stars = ({n}) => (
  <span style={{color: C.gold, fontSize: 22, letterSpacing: 1}}>{'★'.repeat(n)}<span style={{color: C.dim}}>{'★'.repeat(5 - n)}</span></span>
);

const Result = ({data, localF, tapped}) => {
  const show = spring({frame: localF - data.at, fps: 30, config: {damping: 16}});
  if (show <= 0.01) return null;
  const isWinner = data.winner;
  const dead = data.dead;
  const highlight = isWinner && tapped;
  return (
    <div style={{opacity: show, transform: `translateY(${(1 - show) * 24}px)`, width: 800, background: highlight ? 'rgba(52,227,208,0.10)' : C.card,
      border: `2px solid ${highlight ? C.teal : (dead ? '#3a2a2e' : C.border)}`, borderRadius: 16, padding: '20px 24px', position: 'relative',
      boxShadow: highlight ? `0 0 40px ${C.teal}44` : 'none', opacity: dead ? 0.55 : show}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{width: 40, height: 40, borderRadius: 40, background: dead ? '#2a2730' : data.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22}}>{data.icon}</div>
        <div>
          <div style={{fontSize: 30, fontWeight: 800, color: dead ? C.muted : C.link}}>{data.name}</div>
          <div style={{fontSize: 20, color: C.dim}}>{data.url}</div>
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap'}}>
        {data.rating ? <><Stars n={data.rating} /><span style={{fontSize: 20, color: C.muted}}>· {data.speed}</span></> : <span style={{fontSize: 22, color: C.red, fontWeight: 700}}>{data.speed}</span>}
      </div>
      {isWinner && tapped && (
        <div style={{position: 'absolute', right: 18, top: 18, background: C.teal, color: '#04120f', fontWeight: 900, fontSize: 22, padding: '6px 16px', borderRadius: 10}}>GEKLICKT ✅</div>
      )}
    </div>
  );
};

const RESULTS = [
  {at: 96, name: 'Müller Handwerk', url: 'muellerhandwerk.de', icon: '🔨', color: '#2a3b3d', rating: 5, speed: 'lädt in 0,8 s', winner: true},
  {at: 128, name: 'Schmidt & Söhne', url: 'schmidt-bau.de', icon: '🧱', color: '#3a2a2e', rating: 3, speed: 'lädt in 5 s 🐌', dead: false},
  {at: 160, name: 'Deine Firma?', url: 'keine schnelle Website', icon: '❓', color: '#2a2730', rating: 0, speed: '— nicht auf Seite 1 gefunden', dead: true},
];

const SearchScene = () => {
  const f = useCurrentFrame();
  const typed = QUERY.slice(0, Math.floor(interpolate(f, [8, 60], [0, QUERY.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
  const caret = Math.floor(f / 8) % 2 === 0 ? '|' : ' ';
  const tapAt = 208;
  const tapped = f >= tapAt;
  // Cursor fährt zum Gewinner
  const cursor = spring({frame: f - 176, fps: 30, config: {damping: 18}});
  const cursorY = interpolate(cursor, [0, 1], [-40, 0]);
  const tapScale = tapped ? 1 - Math.max(0, 1 - (f - tapAt) / 6) * 0.3 : 1;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '430px 40px 0', gap: 22}}>
      {/* Suchleiste */}
      <div style={{width: 820, background: '#fff', borderRadius: 40, padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>
        <div style={{fontSize: 30}}>🔍</div>
        <div style={{fontSize: 32, fontWeight: 600, color: '#202124'}}>{typed}<span style={{color: '#888'}}>{f < 62 ? caret : ''}</span></div>
      </div>
      <div style={{fontSize: 22, color: C.dim, alignSelf: 'flex-start', marginLeft: 60}}>Ca. 3 Ergebnisse — dein Kunde klickt nur eins 👇</div>
      {/* Ergebnisse */}
      {RESULTS.map((r, i) => <Result key={i} data={r} localF={f} tapped={tapped} />)}
      {/* Cursor */}
      {f > 176 && f < 240 && (
        <div style={{position: 'absolute', left: 700, top: 710 + cursorY, fontSize: 54, transform: `scale(${tapScale})`}}>👆</div>
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
      <div style={{fontSize: 96, transform: `scale(${a})`}}>🔍</div>
      <div style={{fontSize: 62, fontWeight: 900, color: C.ink, lineHeight: 1.08, opacity: a}}>POV: Dein Kunde<br /><span style={{color: C.teal}}>googelt gerade</span></div>
      <div style={{fontSize: 32, fontWeight: 700, color: C.muted, opacity: b, transform: `translateY(${(1 - b) * 24}px)`}}>Wen findet er — dich? 👇</div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line2 = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 18}}>
      <div style={{opacity: pop, transform: `scale(${0.9 + pop * 0.1})`, fontSize: 46, fontWeight: 900, color: C.gold, maxWidth: 860, lineHeight: 1.2}}>Wer nicht gefunden wird,<br />existiert nicht.</div>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop, marginTop: 10}}>
        <div style={{fontSize: 28, color: C.teal, fontWeight: 700, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 52, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 8}}>Schnelle Seiten<br /><span style={{color: C.teal}}>werden gefunden</span>.</div>
      </div>
      <div style={{opacity: line2, transform: `translateY(${(1 - line2) * 20}px)`, marginTop: 26}}>
        <div style={{transform: `scale(${pulse})`}}>
          <div style={{padding: '22px 42px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 32, fontWeight: 900}}>👇 Wirst DU gefunden?</div>
        </div>
        <div style={{marginTop: 26, fontSize: 32, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const GoogleSuche = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(720px 720px at 540px 400px, rgba(52,227,208,0.08), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={SEARCH}><SearchScene /></Sequence>
      <Sequence from={HOOK + SEARCH} durationInFrames={CTA_LEN}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
