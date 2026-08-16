// „Die Waage" — Säule 2 (Autonomous Recruiter).
//
// ERSTES VIDEO NACH DEM NEUEN INHALTSANSPRUCH (CLAUDE.md Schritt 3a, Nutzer 16.08.2026):
// · Achse: KONTROVERS — eine These, der ein Teil der Zielgruppe widersprechen will.
// · Interaktion im HAUPTTEIL, nicht im Abspann: ab Sekunde ~3 wählt der Zuschauer eine
//   Seite und zählt anschließend mit, bei wie vielen Runden er beim Gegenargument bleibt.
// · Wissen trägt mit: jede Runde bringt ein echtes Gegenargument und einen Konter.
//
// FAIRNESS-REGEL (macht die Kontroverse glaubwürdig statt billig): Die Gegenseite bekommt
// ihre besten Argumente, nicht Strohmänner, und am Ende wird ein Fall eingeräumt, in dem
// sie recht hat. Provokation nie auf Kosten von Personen oder Gruppen.
//
// NEUES FORMAT: kippende Waage (Balken rotiert mit dem Zwischenstand). Bisher gab es
// Karten, Zeitleisten, Bänder, Spalten, Suchleiste, Streichliste, Gerät — keine Waage.
//
// Keine erfundenen Statistiken: es wird keine Zahl zur Wirkung von Gehaltsangaben behauptet.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (3 Runden) · LossTag
// · YouAre (Unity) · PeakFlash · LoopSeam.
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
const HOOK = 110, RUNDEN = 275, TWIST = 80, POS = 85, CTA = 50;
const OPEN_Q = 'Bleibst du bei deiner Seite?';

// ---------- 1) Hook: These + Seitenwahl ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 40, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 74, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 74, gap: 24}}>
      <div style={{opacity: a, fontSize: 28, fontWeight: 900, color: C.red, letterSpacing: 5, textTransform: 'uppercase'}}>
        Streitfrage
      </div>
      <div style={{opacity: a, fontSize: 54, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 930}}>
        Gehört das Gehalt in die<br />Stellenanzeige?
      </div>
      <div style={{opacity: b, fontSize: 34, fontWeight: 900, color: C.gold, lineHeight: 1.3, maxWidth: 900}}>
        Entscheide dich jetzt. 👇
      </div>
      <div style={{opacity: b, display: 'flex', gap: 18, marginTop: 4}}>
        <div style={{
          background: C.card, border: `3px solid ${C.red}`, borderRadius: 20,
          padding: '20px 26px', fontSize: 32, fontWeight: 900, color: C.red,
        }}>NEIN – raus damit</div>
        <div style={{
          background: C.card, border: `3px solid ${C.green}`, borderRadius: 20,
          padding: '20px 26px', fontSize: 32, fontWeight: 900, color: C.green,
        }}>JA – rein damit</div>
      </div>
      <div style={{opacity: c, fontSize: 29, fontWeight: 800, color: C.muted, maxWidth: 880, marginTop: 6}}>
        Drei Runden. Zähl mit, wie oft<br />du deine Seite behältst.
      </div>
      <PeakFlash at={74} color={C.gold} strength={0.13} />
    </AbsoluteFill>
  );
};

// ---------- 2) Drei Runden mit kippender Waage ----------
const RUNDEN_DATEN = [
  {
    contra: '„Dann wollen plötzlich alle dasselbe."',
    konter: 'Sie erfahren es ohnehin – nur später, im Gespräch. Bis dahin habt ihr beide Zeit verbrannt.',
  },
  {
    contra: '„Meine Leute sehen, was der Neue kriegt."',
    konter: 'Das ist kein Anzeigenproblem. Und geredet wird im Pausenraum sowieso.',
  },
  {
    contra: '„Ich will erst wissen, was er kann."',
    konter: 'Er will erst wissen, ob es sich lohnt. Einer muss anfangen – und du hast die Stelle offen.',
  },
];
const R_LEN = 92;

const Waage = ({neigung}) => {
  // neigung: -1 (ganz links/contra) … +1 (ganz rechts/pro)
  const grad = neigung * 11;
  return (
    <div style={{width: 900, height: 190, position: 'relative'}}>
      {/* Balken */}
      <div style={{
        position: 'absolute', left: '50%', top: 64, width: 760, height: 12,
        transform: `translateX(-50%) rotate(${grad}deg)`, transformOrigin: '50% 50%',
        background: C.border, borderRadius: 8,
      }}>
        <div style={{
          position: 'absolute', left: -16, top: -46, width: 150, textAlign: 'center',
          fontSize: 26, fontWeight: 900, color: C.red, letterSpacing: 2,
        }}>DAGEGEN</div>
        <div style={{
          position: 'absolute', right: -16, top: -46, width: 150, textAlign: 'center',
          fontSize: 26, fontWeight: 900, color: C.green, letterSpacing: 2,
        }}>DAFÜR</div>
      </div>
      {/* Ständer */}
      <div style={{
        position: 'absolute', left: '50%', top: 70, width: 12, height: 108,
        transform: 'translateX(-50%)', background: C.border, borderRadius: 6,
      }} />
      <div style={{
        position: 'absolute', left: '50%', bottom: 0, width: 260, height: 12,
        transform: 'translateX(-50%)', background: C.border, borderRadius: 6,
      }} />
    </div>
  );
};

const RundenScene = () => {
  const f = useCurrentFrame();
  const idx = Math.min(RUNDEN_DATEN.length - 1, Math.floor(f / R_LEN));
  const local = f - idx * R_LEN;
  const r = RUNDEN_DATEN[idx];
  const contra = spring({frame: local - 4, fps: 30, config: {damping: 16}});
  const konter = spring({frame: local - 36, fps: 30, config: {damping: 15}});
  // Waage kippt erst zur Contra-Seite, nach dem Konter zurück nach rechts
  const neigung = interpolate(local, [4, 30, 40, 70], [0, -1, -1, 0.85], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '244px 40px 56px'}}>
      <StepProgress current={idx + 1} total={3} color={C.gold} />
      <div style={{
        // space-between: Waage oben, Gegenargument mittig, Konter unten — füllt das 9:16
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        minHeight: 1450, justifyContent: 'space-between', marginTop: 22,
      }}>
        <Waage neigung={neigung} />

        {/* Gegenargument */}
        <div style={{
          opacity: contra, transform: `translateX(${(1 - contra) * -30}px)`, width: 930,
          background: C.card, border: `2px solid ${C.red}66`, borderRadius: 20,
          padding: '34px 30px', minHeight: 300, boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left',
        }}>
          <div style={{fontSize: 24, fontWeight: 900, color: C.red, letterSpacing: 3, textTransform: 'uppercase'}}>
            Dagegen
          </div>
          <div style={{fontSize: 39, fontWeight: 900, color: C.ink, lineHeight: 1.2, marginTop: 8}}>{r.contra}</div>
        </div>

        {/* Konter */}
        <div style={{
          opacity: konter, transform: `translateX(${(1 - konter) * 30}px)`, width: 930,
          background: C.card, border: `2px solid ${C.green}66`, borderRadius: 20,
          padding: '34px 30px', minHeight: 300, boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left',
        }}>
          <div style={{fontSize: 24, fontWeight: 900, color: C.green, letterSpacing: 3, textTransform: 'uppercase'}}>
            Dafür
          </div>
          <div style={{fontSize: 33, fontWeight: 800, color: C.ink, lineHeight: 1.26, marginTop: 8}}>{r.konter}</div>
        </div>
      </div>
      <PeakFlash at={2 * R_LEN + 40} color={C.gold} strength={0.16} />
    </AbsoluteFill>
  );
};

// ---------- 3) Die Wendung ----------
const TwistScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 38, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 78, gap: 26}}>
      <PeakFlash at={2} color={C.gold} strength={0.2} />
      <div style={{opacity: a, fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.22, maxWidth: 930}}>
        Ohne Zahl filterst du nicht<br />die Gierigen raus.<br />
        <span style={{color: C.gold}}>Du filterst die raus, die rechnen müssen.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Und das sind meistens die mit Familie und Miete." />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) Die Position (inkl. Zugeständnis) ----------
const PosScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 52, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 18}}>
      <PeakFlash at={2} color={C.teal} strength={0.18} />
      <div style={{opacity: a, fontSize: 31, fontWeight: 900, color: C.teal, letterSpacing: 3, textTransform: 'uppercase'}}>
        Unsere Position
      </div>
      <div style={{opacity: a, fontSize: 46, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 920}}>
        Spanne statt Punktzahl.<br />Das reicht völlig.
      </div>
      <div style={{opacity: b, display: 'flex', flexDirection: 'column', gap: 13, marginTop: 6}}>
        {['Von–bis nennen, nicht auf den Euro genau', 'Dazuschreiben, was den Unterschied macht', 'Bei Tarif: Entgeltgruppe nennen – die ist öffentlich'].map((t, i) => (
          <div key={i} style={{
            width: 900, background: C.card, border: `2px solid ${C.teal}55`, borderRadius: 16,
            padding: '18px 22px', fontSize: 29, fontWeight: 800, color: C.ink, textAlign: 'left',
          }}>✓ {t}</div>
        ))}
      </div>
      {/* Zugeständnis: macht die These angreifbar und dadurch glaubwürdig */}
      <div style={{opacity: c, maxWidth: 890, marginTop: 8}}>
        <YouAre text="Fair bleibt: Bei stark individuellen Rollen ist eine Spanne schwer. Dann sag wenigstens, wovon es abhängt." color={C.gold} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5) CTA ----------
const CtaScene = () => {
  const f = useCurrentFrame();
  const q = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const line = spring({frame: f - 16, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f / 7) * 0.02;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 68, gap: 14}}>
      <div style={{opacity: q, fontSize: 42, fontWeight: 900, color: C.gold, lineHeight: 1.22, maxWidth: 890}}>
        👇 Hast du deine Seite<br />behalten?
      </div>
      <div style={{opacity: q, fontSize: 27, color: C.muted, fontWeight: 700, maxWidth: 870}}>
        Schreib „RAUS" oder „REIN" – und warum. Widerspruch ausdrücklich erwünscht.
      </div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{fontSize: 24, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 45, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 6}}>
          Der <span style={{color: C.teal}}>Autonomous Recruiter</span>
        </div>
      </div>
      <div style={{opacity: line, marginTop: 12}}>
        <div style={{transform: `scale(${pulse})`, padding: '17px 32px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 28, fontWeight: 900}}>
          beekenwebengineering.com/recruiter
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DieWaage = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(860px 860px at 540px 540px, rgba(245,185,69,0.08), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={RUNDEN}><RundenScene /></Sequence>
      <Sequence from={HOOK + RUNDEN} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={HOOK + RUNDEN + TWIST} durationInFrames={POS}><PosScene /></Sequence>
      <Sequence from={HOOK + RUNDEN + TWIST + POS} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + RUNDEN + TWIST}>
        <OpenLoop text={OPEN_Q} hint="3 Runden · Zähl mit" color={C.gold} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
