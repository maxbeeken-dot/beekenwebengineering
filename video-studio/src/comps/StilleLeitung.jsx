// „Die stille Leitung" — Säule 1 (Websites).
// Unbespieltes Thema: das kaputte Kontaktformular. Anfragen werden abgeschickt und kommen
// nie an — der Betrieb hält es für fehlende Nachfrage. Unsichtbarer, sehr realer Verlust.
//
// Dramaturgie: Ausschlussverfahren. Jeder entkräftete Verdächtige ist eine kleine offene
// Schleife und hält bis zur Auflösung (Intro-Retention + Watch-Time).
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (Goal-Gradient, 3 Verdächtige)
// · PeakFlash (Peak-End beim Reveal) · LossTag · YouAre (Unity) · LoopSeam (Rewatch).
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {OpenLoop, StepProgress, LossTag, YouAre, PeakFlash, LoopSeam} from './Psych.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 30 fps → 600 Frames = 20 s
const HOOK = 110, SUSPECTS = 250, REVEAL = 120, INSIGHT = 70, CTA = 50;
const OPEN_Q = 'Woran liegt es?';

// ---------- 1) Micro-Szenario ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 6, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 40, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 68, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 74, gap: 24}}>
      <div style={{opacity: a, fontSize: 29, letterSpacing: 5, color: C.muted, fontWeight: 900, textTransform: 'uppercase'}}>
        Seit 4 Monaten
      </div>
      <div style={{opacity: a, fontSize: 66, fontWeight: 900, color: C.ink, lineHeight: 1.14, maxWidth: 920}}>
        Keine einzige Anfrage<br />über die Website.
      </div>
      <div style={{
        opacity: b, marginTop: 8, background: C.card, border: `2px solid ${C.border}`,
        borderRadius: 18, padding: '18px 26px', fontSize: 30, color: C.muted, fontWeight: 700,
      }}>„Läuft halt gerade schlecht."</div>
      <div style={{opacity: c, fontSize: 34, fontWeight: 900, color: C.gold, marginTop: 6}}>
        Stimmt nicht. 👀
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2) Ausschlussverfahren ----------
const SUSPECTS_LIST = [
  {at: 10,  n: 1, title: 'Google?', fact: 'Platz 3 für „Dachdecker Bad Homburg"', verdict: 'Nicht schuld.'},
  {at: 90,  n: 2, title: 'Die Seite selbst?', fact: 'Lädt in 1,2 s · mobil einwandfrei', verdict: 'Nicht schuld.'},
  {at: 170, n: 3, title: 'Die Nachfrage?', fact: 'Konkurrenz ist ausgebucht bis Oktober', verdict: 'Nicht schuld.'},
];

const SuspectCard = ({localF, s}) => {
  const inS = spring({frame: localF - s.at, fps: 30, config: {damping: 16}});
  const cleared = localF > s.at + 42;
  const strike = interpolate(localF, [s.at + 42, s.at + 58], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (inS <= 0.001) return null;
  return (
    <div style={{
      opacity: inS, transform: `translateY(${(1 - inS) * 24}px)`, width: 900,
      background: C.card, border: `2px solid ${cleared ? C.green + '55' : C.border}`,
      borderRadius: 20, padding: '22px 26px', position: 'relative',
    }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16}}>
        <div style={{textAlign: 'left'}}>
          <div style={{fontSize: 36, fontWeight: 900, color: C.ink}}>{s.title}</div>
          <div style={{fontSize: 26, color: C.muted, fontWeight: 700, marginTop: 4}}>{s.fact}</div>
        </div>
        <div style={{
          fontSize: 26, fontWeight: 900, color: cleared ? C.green : C.dim,
          border: `2px solid ${cleared ? C.green + '66' : C.border}`, borderRadius: 999,
          padding: '10px 18px', whiteSpace: 'nowrap',
        }}>{cleared ? s.verdict : 'prüfe …'}</div>
      </div>
      {/* Durchstreichen als sichtbares „abgehakt" */}
      <div style={{
        position: 'absolute', left: 26, right: 26, top: '50%', height: 3, background: C.green,
        width: `calc((100% - 52px) * ${strike / 100})`, opacity: 0.55,
      }} />
    </div>
  );
};

const SuspectScene = () => {
  const f = useCurrentFrame();
  const done = SUSPECTS_LIST.filter(s => f > s.at + 42).length;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '250px 40px 60px', gap: 20}}>
      <StepProgress current={done} total={3} color={C.green} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 30}}>
        {SUSPECTS_LIST.map((s, i) => <SuspectCard key={i} localF={f} s={s} />)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3) Der Reveal ----------
const RevealScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 14}});
  const send = spring({frame: f - 30, fps: 30, config: {damping: 13}});
  const fail = spring({frame: f - 62, fps: 30, config: {damping: 13}});
  // Zähler erst einblenden, wenn er auch zählt — „0 Anfragen" als Standbild wäre irreführend
  const tag = spring({frame: f - 78, fps: 30, config: {damping: 14}});
  const count = Math.max(1, Math.round(interpolate(f, [78, 108], [1, 12], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 66, gap: 22}}>
      <PeakFlash at={6} color={C.red} strength={0.3} />
      <div style={{opacity: a, fontSize: 30, letterSpacing: 5, color: C.red, fontWeight: 900, textTransform: 'uppercase'}}>
        Der Täter
      </div>
      <div style={{opacity: a, fontSize: 60, fontWeight: 900, color: C.ink, lineHeight: 1.16}}>
        Dein Kontaktformular
      </div>
      <div style={{
        opacity: send, width: 800, background: C.card, border: `2px solid ${C.border}`,
        borderRadius: 20, padding: '24px 28px', marginTop: 6,
      }}>
        <div style={{fontSize: 30, fontWeight: 900, color: C.green}}>„Nachricht gesendet ✓"</div>
        <div style={{fontSize: 26, color: C.muted, fontWeight: 700, marginTop: 8}}>
          Der Kunde sieht das. Du nie.
        </div>
      </div>
      <div style={{
        opacity: fail, marginTop: 4, fontSize: 30, fontWeight: 800, color: C.red, lineHeight: 1.3, maxWidth: 860,
      }}>
        Die Mail geht an eine Adresse,<br />die es seit dem Anbieterwechsel nicht mehr gibt.
      </div>
      <div style={{opacity: tag, marginTop: 8}}>
        <LossTag text={`${count} Anfragen. Nie angekommen.`} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Einsicht ----------
const InsightScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 24, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 24}}>
      <div style={{opacity: a, fontSize: 54, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 920}}>
        Eine kaputte Leitung<br />fühlt sich an wie<br /><span style={{color: C.gold}}>keine Nachfrage</span>.
      </div>
      <div style={{opacity: b, maxWidth: 880, marginTop: 4}}>
        <YouAre text="Deshalb fällt es monatelang niemandem auf." color={C.gold} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5) CTA ----------
const CtaScene = () => {
  const f = useCurrentFrame();
  const q = spring({frame: f, fps: 30, config: {damping: 15}});
  const line = spring({frame: f - 14, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f / 7) * 0.02;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 70, gap: 16}}>
      <div style={{opacity: q, fontSize: 38, fontWeight: 900, color: C.gold, lineHeight: 1.25, maxWidth: 890}}>
        👇 Wann hast du zuletzt dein<br />eigenes Formular getestet?
      </div>
      <div style={{opacity: q, fontSize: 26, color: C.muted, fontWeight: 700}}>Ehrlich: Monat in die Kommentare.</div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{fontSize: 25, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 46, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
          Websites, bei denen<br />die <span style={{color: C.teal}}>Leitung steht</span>
        </div>
      </div>
      <div style={{opacity: line, marginTop: 14}}>
        <div style={{transform: `scale(${pulse})`, padding: '18px 36px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 30, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const StilleLeitung = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(820px 820px at 540px 560px, rgba(255,84,104,0.07), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={SUSPECTS}><SuspectScene /></Sequence>
      <Sequence from={HOOK + SUSPECTS} durationInFrames={REVEAL}><RevealScene /></Sequence>
      <Sequence from={HOOK + SUSPECTS + REVEAL} durationInFrames={INSIGHT}><InsightScene /></Sequence>
      <Sequence from={HOOK + SUSPECTS + REVEAL + INSIGHT} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zum Reveal (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + SUSPECTS}>
        <OpenLoop text={OPEN_Q} hint="3 Verdächtige · Auflösung am Ende" color={C.gold} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
