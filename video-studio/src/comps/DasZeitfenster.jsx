// „Das Zeitfenster" — Säule 2 (Autonomous Recruiter).
//
// INHALTSANSPRUCH (CLAUDE.md Schritt 3a):
// · Achse WISSEN: ein Mechanismus, kein Ratgeber. Vier ganz normale Sätze aus dem
//   Bewerbungsprozess legen zusammen fest, WER sich überhaupt bewerben kann — nämlich
//   vor allem der, der gerade keine Arbeit hat. Das ist niemandes Absicht und steht
//   trotzdem in fast jedem Prozess.
// · INTERAKTION IM HAUPTTEIL: Der Zuschauer zählt ab Runde 1 mit, wie viele der vier
//   Sätze bei ihm selbst gelten — jede Runde fragt ausdrücklich nach.
//
// EHRLICH GRADIERT statt plakativ: Nicht alle vier Sätze sind unmöglich. Einer trifft die
// freie Zeit gar nicht, die anderen kosten Abend, Tage oder einen Urlaubstag. Ein
// Strohmann-„geht alles nicht" wäre billiger und unglaubwürdig.
//
// NEUES FORMAT: Tagesleiste 0–24 h, auf der die freie Zeit des Bewerbers konstant liegt und
// die Forderung des jeweiligen Satzes darüber gelegt wird. Bisher: Karten, Zeitleisten,
// Bänder, Spalten, Suchleiste, Streichliste, Waage, Preisschild, Rangliste, Schiene —
// keine Überlagerung zweier Tagesabläufe.
//
// Keine erfundenen Zahlen: es wird keine Quote und keine Studie behauptet, nur der
// Mechanismus gezeigt.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT) · StepProgress (4 Sätze) · LossTag · YouAre
// · PeakFlash · LoopSeam.
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {OpenLoop, StepProgress, LossTag, YouAre, PeakFlash, LoopSeam} from './Psych.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 30 fps → 640 Frames ≈ 21,3 s
const S_LEN = 95;
const HOOK = 100, SAETZE_LEN = 4 * S_LEN, TWIST = 100, CTA = 60;
const OPEN_Q = 'Vier Sätze. Zusammen sagen sie etwas anderes.';

// Seine freie Zeit — bleibt das ganze Video über gleich. Das ist der Punkt:
// sein Tag verhandelt nicht.
const FREI = [[6, 7.5], [12, 13], [17, 23]];

const SAETZE = [
  {
    satz: '„Bitte rufen Sie uns an."',
    fordert: [[8, 16]],
    verdikt: 'Trifft seine freie Zeit nicht',
    detail: 'Bleibt die Mittagspause – im Lärm, neben den Kollegen.',
  },
  {
    satz: '„Bewerbung mit vollständigen Unterlagen."',
    fordert: [[19, 21]],
    verdikt: 'Kostet ihn den Abend',
    detail: 'Zeugnisse suchen, scannen, formulieren. Nach der Schicht.',
  },
  {
    satz: '„Wir melden uns werktags zurück."',
    fordert: [[8, 16]],
    verdikt: 'Kostet ihn drei Tage',
    detail: 'Er schreibt Samstagabend. Antwort frühestens Dienstag.',
  },
  {
    satz: '„Gespräch vormittags im Betrieb."',
    fordert: [[9, 12]],
    verdikt: 'Kostet ihn einen Urlaubstag',
    detail: 'Er muss frei nehmen, um sich zu bewerben – und seinem Chef etwas erzählen.',
  },
];

const BAR_W = 730, BAR_H = 130, LBL = 132;
const x = (h) => (h / 24) * BAR_W;

const Zeile = ({label, farbe, bloecke, anteil}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
    <div style={{width: LBL, textAlign: 'right', fontSize: 28, fontWeight: 900, color: farbe, lineHeight: 1.1}}>
      {label}
    </div>
    <div style={{
      position: 'relative', width: BAR_W, height: BAR_H, boxSizing: 'border-box',
      background: C.cardHi, border: `2px solid ${C.border}`, borderRadius: 14,
    }}>
      {bloecke.map(([a, b], i) => (
        <div key={i} style={{
          position: 'absolute', top: 4, left: x(a), height: BAR_H - 12, boxSizing: 'border-box',
          width: Math.max(0, (x(b) - x(a)) * anteil),
          background: `${farbe}44`, border: `2px solid ${farbe}`, borderRadius: 10,
        }} />
      ))}
    </div>
  </div>
);

// Zwei Tagesabläufe übereinander: seiner steht fest, eurer ist eine Entscheidung.
const Tagesleiste = ({fordert, zeigeForderung}) => (
  <div style={{
    width: '100%', boxSizing: 'border-box', background: C.card,
    border: `3px solid ${C.border}`, borderRadius: 20, padding: '26px 28px',
  }}>
    <div style={{fontSize: 23, fontWeight: 900, color: C.muted, letterSpacing: 4, textTransform: 'uppercase'}}>
      Ein Werktag
    </div>
    <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14}}>
      <Zeile label="Er kann" farbe={C.teal} bloecke={FREI} anteil={1} />
      <Zeile label="Ihr wollt" farbe={C.red} bloecke={fordert} anteil={zeigeForderung} />
    </div>
    {/* Stundenachse, bündig unter den Balken */}
    <div style={{position: 'relative', height: 32, marginTop: 10, marginLeft: LBL + 14, width: BAR_W}}>
      {[0, 6, 12, 18, 24].map((h) => (
        <div key={h} style={{
          position: 'absolute', left: x(h) - 30, width: 60, textAlign: 'center',
          fontSize: 24, fontWeight: 800, color: C.dim,
        }}>{h} Uhr</div>
      ))}
    </div>
    <div style={{fontSize: 27, fontWeight: 800, color: C.muted, marginTop: 12, lineHeight: 1.25}}>
      Seine Zeit steht fest. Eure ist eine Entscheidung.
    </div>
  </div>
);

// ---------- 1) Hook ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 36, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 66, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 74, gap: 24}}>
      <div style={{opacity: a, fontSize: 28, fontWeight: 900, color: C.violet, letterSpacing: 5, textTransform: 'uppercase'}}>
        Der Bewerber, den ihr wollt
      </div>
      <div style={{opacity: a, fontSize: 50, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 940}}>
        Er hat schon einen Job.<br />Deshalb wollt ihr ihn.
      </div>
      <div style={{opacity: b, fontSize: 36, fontWeight: 900, color: C.gold, lineHeight: 1.28, maxWidth: 920}}>
        Und genau deshalb<br />erreicht ihr ihn nicht.
      </div>
      <div style={{opacity: c, fontSize: 30, fontWeight: 800, color: C.muted, maxWidth: 890, marginTop: 6}}>
        Vier ganz normale Sätze.<br />Zähl mit, wie viele bei euch gelten. 👇
      </div>
      <PeakFlash at={66} color={C.gold} strength={0.14} />
    </AbsoluteFill>
  );
};

// ---------- 2) Die vier Sätze ----------
const SaetzeScene = () => {
  const f = useCurrentFrame();
  const idx = Math.min(SAETZE.length - 1, Math.floor(f / S_LEN));
  const local = f - idx * S_LEN;
  const s = SAETZE[idx];
  const satz = spring({frame: local - 2, fps: 30, config: {damping: 16}});
  const forderung = spring({frame: local - 22, fps: 30, config: {damping: 20, stiffness: 70}});
  const urteil = spring({frame: local - 48, fps: 30, config: {damping: 15}});
  const zaehl = spring({frame: local - 70, fps: 30, config: {damping: 15}});

  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '244px 44px 56px'}}>
      <StepProgress current={idx + 1} total={SAETZE.length} color={C.gold} />
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', width: 950,
        minHeight: 1480, justifyContent: 'space-between', marginTop: 22,
      }}>
        {/* Der Satz */}
        <div style={{
          opacity: satz, transform: `translateY(${(1 - satz) * -20}px)`, width: '100%',
          background: C.card, border: `3px solid ${C.border}`, borderRadius: 20,
          padding: '30px 28px', boxSizing: 'border-box', textAlign: 'left', minHeight: 250,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{fontSize: 23, fontWeight: 900, color: C.muted, letterSpacing: 4, textTransform: 'uppercase'}}>
            Steht so im Prozess
          </div>
          <div style={{fontSize: 46, fontWeight: 900, color: C.ink, lineHeight: 1.18, marginTop: 10}}>{s.satz}</div>
        </div>

        <Tagesleiste fordert={s.fordert} zeigeForderung={forderung} />

        {/* Was es ihn kostet */}
        <div style={{
          width: '100%', boxSizing: 'border-box', background: C.card,
          border: `2px solid ${urteil > 0.05 ? `${C.red}66` : C.border}`, borderRadius: 20,
          padding: '28px 28px', minHeight: 440,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left',
        }}>
          {urteil > 0.05 ? (
            <>
              <div style={{opacity: urteil, fontSize: 34, fontWeight: 900, color: C.red, lineHeight: 1.2}}>
                {s.verdikt}
              </div>
              <div style={{
                opacity: urteil * 0.92, transform: `translateY(${(1 - urteil) * 14}px)`,
                fontSize: 31, fontWeight: 800, color: C.ink, lineHeight: 1.26, marginTop: 10,
              }}>{s.detail}</div>
              <div style={{opacity: zaehl, marginTop: 16}}>
                <div style={{
                  display: 'inline-block', fontSize: 26, fontWeight: 900, color: C.gold,
                  background: `${C.gold}14`, border: `2px solid ${C.gold}66`, borderRadius: 12, padding: '10px 18px',
                }}>Gilt der bei euch? Mitzählen.</div>
              </div>
            </>
          ) : (
            <div style={{fontSize: 40, fontWeight: 900, color: C.dim, letterSpacing: 10, textAlign: 'center'}}>
              • • •
            </div>
          )}
        </div>
      </div>
      <PeakFlash at={3 * S_LEN + 48} color={C.red} strength={0.18} />
    </AbsoluteFill>
  );
};

// ---------- 3) Die Auflösung ----------
const TwistScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 28, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 56, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{
      alignItems: 'center', textAlign: 'center', padding: '280px 66px 220px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <PeakFlash at={2} color={C.gold} strength={0.22} />
      <div style={{opacity: a, fontSize: 48, fontWeight: 900, color: C.ink, lineHeight: 1.22, maxWidth: 940}}>
        Jeder Satz für sich ist normal.<br />
        <span style={{color: C.gold}}>Zusammen sagen sie:<br />Bewirb dich nur, wenn du gerade keine Arbeit hast.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Gemeint hat das niemand. Gefiltert wird trotzdem." />
      </div>
      <div style={{opacity: c, maxWidth: 930}}>
        <YouAre text="Wer nachts antworten kann, spricht mit denen, die tagsüber arbeiten." color={C.teal} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4) CTA ----------
const CtaScene = () => {
  const f = useCurrentFrame();
  const q = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const line = spring({frame: f - 16, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f / 7) * 0.02;
  return (
    <AbsoluteFill style={{
      alignItems: 'center', textAlign: 'center', padding: '320px 68px 300px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{opacity: q, fontSize: 54, fontWeight: 900, color: C.gold, lineHeight: 1.2, maxWidth: 920}}>
          👇 Wie viele der vier<br />gelten bei euch?
        </div>
        <div style={{opacity: q, fontSize: 31, color: C.muted, fontWeight: 700, maxWidth: 900, lineHeight: 1.32, marginTop: 22}}>
          Schreib deine Zahl von 0 bis 4 – und welchen ihr als Erstes streichen würdet.
        </div>
      </div>
      <div style={{opacity: line}}>
        <div style={{fontSize: 25, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 50, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 10}}>
          Der <span style={{color: C.teal}}>Autonomous Recruiter</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 26}}>
          <div style={{transform: `scale(${pulse})`, padding: '19px 34px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 30, fontWeight: 900}}>
            beekenwebengineering.com/recruiter
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DasZeitfenster = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(880px 880px at 540px 620px, rgba(52,227,208,0.07), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={SAETZE_LEN}><SaetzeScene /></Sequence>
      <Sequence from={HOOK + SAETZE_LEN} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={HOOK + SAETZE_LEN + TWIST} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + SAETZE_LEN}>
        <OpenLoop text={OPEN_Q} hint="Was? Am Ende · Zähl mit" color={C.gold} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
