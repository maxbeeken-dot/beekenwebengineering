import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// Eine Chat-Nachricht: side 'in' = BWE (links, grau) · 'out' = Kunde (rechts, violett).
// Vor jeder 'in'-Nachricht erscheinen ~26f lang Tipp-Punkte ("schreibt …").
const MESSAGES = [
  {side: 'out', at: 30,  text: 'Meine Website bringt einfach keine Kunden 😩'},
  {side: 'in',  at: 100, text: 'Lass mich raten – Baukasten?'},
  {side: 'out', at: 170, text: '…Wix. Woher weißt du das? 😳'},
  {side: 'in',  at: 240, text: 'Sie lädt fast 6 Sekunden. Nach 3 sind 53 % schon weg.'},
  {side: 'out', at: 318, text: 'Was kann ich denn tun?'},
  {side: 'in',  at: 388, text: 'Echte Website. Handgecodet. Unter 1 Sekunde.'},
  {side: 'out', at: 462, text: 'Und die gehört dann mir?'},
  {side: 'in',  at: 532, text: 'Komplett. Du bist der Eigentümer. 🔑'},
  {side: 'out', at: 612, text: 'Wann fangen wir an?? 🚀'},
];
const TYPING_LEAD = 26;

const Avatar = ({size = 64}) => (
  <div style={{width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: `linear-gradient(135deg, ${C.violet}, ${C.teal})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#0b0b10', fontWeight: 900, fontSize: size * 0.46, fontFamily: FONT}}>B</div>
);

const Header = () => (
  <div style={{height: 132, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 20,
    padding: '0 30px', borderBottom: `1px solid ${C.border}`, background: C.cardHi}}>
    <div style={{color: C.violet, fontSize: 40, fontWeight: 700, marginRight: -6}}>‹</div>
    <Avatar />
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{color: C.ink, fontSize: 30, fontWeight: 800, lineHeight: 1.1}}>Beeken Web Engineering</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 4}}>
        <div style={{width: 10, height: 10, borderRadius: '50%', background: C.teal}} />
        <div style={{color: C.teal, fontSize: 21, fontWeight: 600}}>Online</div>
      </div>
    </div>
  </div>
);

const TypingDots = ({frame}) => (
  <div style={{display: 'flex', alignSelf: 'flex-start'}}>
    <div style={{background: C.card, border: `1px solid ${C.border}`, borderRadius: '30px 30px 30px 8px',
      padding: '24px 28px', display: 'flex', gap: 12}}>
      {[0, 1, 2].map((i) => {
        const o = 0.35 + (Math.sin(frame * 0.35 + i * 0.9) * 0.5 + 0.5) * 0.65;
        const y = Math.sin(frame * 0.35 + i * 0.9) * 4;
        return <div key={i} style={{width: 16, height: 16, borderRadius: '50%',
          background: C.muted, opacity: o, transform: `translateY(${y}px)`}} />;
      })}
    </div>
  </div>
);

const Bubble = ({side, text, appear}) => {
  const pop = spring({frame: appear, fps: 30, config: {damping: 14, mass: 0.7}});
  const isOut = side === 'out';
  return (
    <div style={{display: 'flex', justifyContent: isOut ? 'flex-end' : 'flex-start',
      transform: `translateY(${(1 - pop) * 26}px) scale(${0.9 + pop * 0.1})`, opacity: pop,
      transformOrigin: isOut ? 'right bottom' : 'left bottom'}}>
      <div style={{maxWidth: '76%', padding: '24px 30px', fontSize: 35, lineHeight: 1.32,
        fontWeight: 500, fontFamily: FONT, color: isOut ? '#fff' : C.ink,
        background: isOut ? C.violet : C.card,
        border: isOut ? 'none' : `1px solid ${C.border}`,
        borderRadius: isOut ? '32px 32px 8px 32px' : '32px 32px 32px 8px',
        boxShadow: isOut ? '0 10px 30px rgba(124,92,255,0.32)' : '0 8px 22px rgba(0,0,0,0.35)'}}>
        {text}
      </div>
    </div>
  );
};

const Phone = ({children}) => (
  <div style={{width: 880, height: 1620, background: '#0b0a10', borderRadius: 64,
    border: `12px solid ${C.cardHi}`, boxShadow: '0 40px 110px rgba(0,0,0,0.6)',
    overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column'}}>
    <div style={{position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
      width: 200, height: 34, background: '#000', borderRadius: '0 0 20px 20px', zIndex: 10}} />
    {children}
  </div>
);

const ChatScene = () => {
  const f = useCurrentFrame();
  // Tipp-Indikator nur vor 'in'-Nachrichten (BWE "schreibt …"), und nur wenn noch nicht da.
  const typingFor = MESSAGES.find(
    (m) => m.side === 'in' && f >= m.at - TYPING_LEAD && f < m.at
  );
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <Phone>
        <Header />
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          gap: 22, padding: '36px 30px 44px', overflow: 'hidden'}}>
          {MESSAGES.filter((m) => f >= m.at).map((m, i) => (
            <Bubble key={i} side={m.side} text={m.text} appear={f - m.at} />
          ))}
          {typingFor ? <TypingDots frame={f} /> : null}
        </div>
      </Phone>
    </AbsoluteFill>
  );
};

const HookOverlay = () => {
  const f = useCurrentFrame();
  // Kurzer Banner oben, der die Szene rahmt und dann hochfährt.
  const out = interpolate(f, [70, 92], [0, -160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op = interpolate(f, [0, 8, 70, 92], [0, 1, 1, 0], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center',
      transform: `translateY(${out}px)`, opacity: op, zIndex: 20}}>
      <div style={{display: 'inline-block', background: 'rgba(124,92,255,0.16)', color: C.ink,
        border: `1px solid ${C.violet}`, borderRadius: 99, padding: '16px 34px',
        fontSize: 36, fontWeight: 800, fontFamily: FONT}}>
        Diese Unterhaltung passiert täglich 👇
      </div>
    </div>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 14}});
  const pulse = 1 + Math.sin(f * 0.18) * 0.03;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70}}>
      <div style={{transform: `scale(${0.9 + pop * 0.1})`, opacity: pop}}>
        <div style={{fontSize: 30, color: C.teal, fontWeight: 700, letterSpacing: 4, marginBottom: 26}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 84, color: C.ink, fontWeight: 800, lineHeight: 1.05, marginBottom: 30}}>
          Reden wir über<br /><span style={{color: C.violet}}>deine Website.</span></div>
        <div style={{transform: `scale(${pulse})`, display: 'inline-block', marginTop: 10}}>
          <div style={{padding: '26px 52px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 38, fontWeight: 800}}>Kommentier „START" → Website-Check</div>
        </div>
        <div style={{marginTop: 40, fontSize: 38, color: C.muted}}>beekenwebengineering.com</div>
      </div>
    </AbsoluteFill>
  );
};

export const ChatDeal = () => {
  const f = useCurrentFrame();
  const bgGlowX = interpolate(f, [0, 810], [-220, 220]);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${540 + bgGlowX}px 820px, rgba(124,92,255,0.14), transparent 70%)`}} />
      <Sequence from={0} durationInFrames={690}>
        <ChatScene />
        <HookOverlay />
      </Sequence>
      <Sequence from={690} durationInFrames={120}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
