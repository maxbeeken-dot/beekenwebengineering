// „Die Rangliste" — Säule 2 (Autonomous Recruiter).
//
// INHALTSANSPRUCH (CLAUDE.md Schritt 3a):
// · KONTROVERS: Das freie Gespräch nach Bauchgefühl – das meistgenutzte Auswahlmittel im
//   Mittelstand – landet ganz unten. Dem widerspricht ein Teil der Zielgruppe sofort.
// · WISSEN: Die Rangfolge stammt aus der Metaanalyse-Literatur zur Personalauswahl
//   (strukturiertes Gespräch vor Arbeitsprobe; Berufsjahre und freies Gespräch weit dahinter).
//   BEWUSST OHNE ZAHLEN: Validitätskoeffizienten sind im Kurzvideo missverständlich, und die
//   Reihenfolge der beiden hinteren Plätze ist quellenabhängig – deshalb stehen sie
//   gleichauf statt auf erfundenen Plätzen 3 und 4.
// · INTERAKTION IM HAUPTTEIL: Der Zuschauer tippt bei laufendem Countdown seinen Platz 1
//   (Buchstabe A–D), bevor sich die Liste sortiert.
//
// NEUES FORMAT: Karten, die sich vor den Augen des Zuschauers umsortieren. Bisher gab es
// Karten, Zeitleisten, Bänder, Spalten, Suchleiste, Streichliste, Waage, Preisschild —
// keine Rangliste, die sich selbst neu ordnet.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT — eingelöst in der Schluss-Auflösung)
// · StepProgress (3 Auflösungsschritte) · LossTag · YouAre · ProofChip (Quelle statt Zahl)
// · PeakFlash · LoopSeam.
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {OpenLoop, StepProgress, LossTag, YouAre, ProofChip, PeakFlash, LoopSeam} from './Psych.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 30 fps → 650 Frames ≈ 21,7 s
const WAHL = 190;                 // Phase A innerhalb der Listen-Szene
const LISTE = WAHL + 300, LEHRE = 100, CTA = 60;
// Einzeilig halten, sonst läuft der Banner in den Fortschrittszähler (top: 168).
const OPEN_Q = 'Eins nutzt fast jeder – und es liegt unten.';

const CARD_H = 158, GAP = 16;

// start = Reihenfolge auf dem Schirm, ziel = Platz nach der Auflösung
const METHODEN = [
  {b: 'A', titel: 'Freies Gespräch', sub: '„Man merkt doch, ob’s passt."', ziel: 3},
  {b: 'B', titel: 'Berufsjahre im Lebenslauf', sub: '„15 Jahre Erfahrung."', ziel: 2},
  {b: 'C', titel: 'Strukturiertes Gespräch', sub: 'Alle bekommen dieselben Fragen.', ziel: 0},
  {b: 'D', titel: 'Arbeitsprobe', sub: 'Zwei Stunden mitarbeiten.', ziel: 1},
];

const WARUM = [
  {
    kopf: 'Platz 1',
    farbe: C.gold,
    text: 'Gleiche Fragen, feste Bewertung. Erst dadurch vergleichst du Leistung statt Sympathie.',
  },
  {
    kopf: 'Platz 2',
    farbe: C.teal,
    text: 'Wer die Arbeit macht, zeigt sie. Reden lässt sich über alles.',
  },
  {
    kopf: 'Weit dahinter',
    farbe: C.red,
    text: 'Berufsjahre und das freie Gespräch – ausgerechnet die zwei, auf die fast jeder zuerst schaut.',
  },
];

const Karte = ({m, pos, rang, hell}) => {
  const rand = rang === 0 ? C.gold : rang === 1 ? C.teal : hell ? C.red : C.border;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, height: CARD_H, boxSizing: 'border-box',
      transform: `translateY(${pos * (CARD_H + GAP)}px)`,
      background: rang === 0 ? `${C.gold}12` : C.card,
      border: `3px solid ${rand}`, borderRadius: 20,
      display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px',
      opacity: hell && rang >= 2 ? 0.55 : 1,
    }}>
      <div style={{
        width: 74, height: 74, flexShrink: 0, borderRadius: 16,
        background: rang <= 1 ? rand : C.cardHi, border: `2px solid ${rand}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 38, fontWeight: 900, color: rang <= 1 ? '#0b0a10' : C.muted,
      }}>{m.b}</div>
      <div style={{flex: 1, textAlign: 'left'}}>
        <div style={{fontSize: 37, fontWeight: 900, color: C.ink, lineHeight: 1.15}}>{m.titel}</div>
        <div style={{fontSize: 26, fontWeight: 700, color: C.muted, marginTop: 5}}>{m.sub}</div>
      </div>
      {rang <= 1 && (
        <div style={{
          fontSize: 26, fontWeight: 900, color: rand, letterSpacing: 2, whiteSpace: 'nowrap',
        }}>{rang === 0 ? 'PLATZ 1' : 'PLATZ 2'}</div>
      )}
    </div>
  );
};

// ---------- 1) Liste: erst Wahl des Zuschauers, dann Umsortierung ----------
const ListeScene = () => {
  const f = useCurrentFrame();
  const kopf = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const karten = spring({frame: f - 26, fps: 30, config: {damping: 17}});
  const rest = interpolate(f, [70, WAHL - 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const aufgeloest = f >= WAHL;
  // Bewusst träge: die Bewegung der Karten IST die Auflösung – sie muss lesbar sein.
  const sort = spring({frame: f - WAHL - 10, fps: 30, config: {damping: 20, stiffness: 55}});
  const lokal = f - WAHL;
  const schritt = lokal < 100 ? 0 : lokal < 190 ? 1 : 2;
  const w = WARUM[schritt];
  const wS = spring({frame: lokal - (schritt === 0 ? 46 : schritt === 1 ? 100 : 190), fps: 30, config: {damping: 15}});

  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '244px 46px 56px'}}>
      {aufgeloest && <StepProgress current={schritt + 1} total={3} color={C.gold} />}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', width: 988,
        minHeight: 1420, justifyContent: 'space-between', marginTop: 22,
      }}>
        {/* Kopf */}
        <div style={{opacity: kopf, textAlign: 'center', minHeight: 170}}>
          <div style={{fontSize: 27, fontWeight: 900, color: aufgeloest ? C.gold : C.teal, letterSpacing: 4, textTransform: 'uppercase'}}>
            {aufgeloest ? 'Die Auflösung' : 'Einstellen'}
          </div>
          <div style={{fontSize: 44, fontWeight: 900, color: C.ink, lineHeight: 1.2, marginTop: 10, whiteSpace: 'pre-line'}}>
            {aufgeloest
              ? 'So ordnet die Forschung sie.'
              : 'Was sagt am besten voraus,\nob jemand den Job kann?'}
          </div>
        </div>

        {/* Die Karten */}
        <div style={{position: 'relative', width: '100%', height: 4 * CARD_H + 3 * GAP, opacity: karten}}>
          {METHODEN.map((m, i) => {
            const pos = interpolate(sort, [0, 1], [i, m.ziel]);
            // Platz-Abzeichen erst, wenn die Karte wirklich angekommen ist
            const rang = sort > 0.86 ? m.ziel : 9;
            return <Karte key={m.b} m={m} pos={pos} rang={rang} hell={aufgeloest && schritt >= 2} />;
          })}
        </div>

        {/* Unten: erst das Urteilsfenster, danach die Begründung */}
        <div style={{
          width: '100%', minHeight: 330, boxSizing: 'border-box',
          background: C.card, border: `2px solid ${aufgeloest ? `${w.farbe}66` : `${C.teal}55`}`,
          borderRadius: 20, padding: '26px 28px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          {!aufgeloest ? (
            <>
              <div style={{fontSize: 25, fontWeight: 900, color: C.teal, letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center'}}>
                Du zuerst
              </div>
              <div style={{fontSize: 40, fontWeight: 900, color: C.ink, lineHeight: 1.22, marginTop: 10, textAlign: 'center'}}>
                Tippe deinen Platz 1:<br />A, B, C oder D?
              </div>
              <div style={{height: 10, background: C.border, borderRadius: 999, marginTop: 18, overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${rest * 100}%`, background: C.gold, borderRadius: 999}} />
              </div>
            </>
          ) : wS < 0.05 ? (
            // Solange die Karten noch wandern: Platzhalter statt leerer Kasten
            <div style={{fontSize: 40, fontWeight: 900, color: C.dim, letterSpacing: 10, textAlign: 'center'}}>
              • • •
            </div>
          ) : (
            <>
              <div style={{opacity: wS, fontSize: 25, fontWeight: 900, color: w.farbe, letterSpacing: 3, textTransform: 'uppercase'}}>
                {w.kopf}
              </div>
              <div style={{
                opacity: wS, transform: `translateY(${(1 - wS) * 16}px)`,
                fontSize: 35, fontWeight: 800, color: C.ink, lineHeight: 1.25, marginTop: 8, textAlign: 'left',
              }}>{w.text}</div>
            </>
          )}
        </div>
      </div>
      <PeakFlash at={WAHL + 10} color={C.gold} strength={0.18} />
      <PeakFlash at={WAHL + 190} color={C.red} strength={0.16} />
    </AbsoluteFill>
  );
};

// ---------- 2) Die Lehre ----------
const LehreScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 20, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 42, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{
      alignItems: 'center', textAlign: 'center', padding: '300px 66px 240px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <PeakFlash at={2} color={C.gold} strength={0.2} />
      <div style={{opacity: a, fontSize: 50, fontWeight: 900, color: C.ink, lineHeight: 1.22, maxWidth: 940}}>
        Das freie Gespräch fühlt sich am aussagekräftigsten an.<br />
        <span style={{color: C.gold}}>Genau das ist die Falle.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Es sortiert nach Sympathie – und die macht die Arbeit nicht." />
      </div>
      <div style={{opacity: c, maxWidth: 930}}>
        <YouAre text="Struktur ist kein Bürokram. Sie ist der ganze Unterschied zwischen raten und wissen." color={C.teal} />
      </div>
      <div style={{opacity: c}}>
        <ProofChip text="Quelle: Metaanalysen der Personalauswahl" color={C.teal} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3) CTA ----------
const CtaScene = () => {
  const f = useCurrentFrame();
  const q = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const line = spring({frame: f - 16, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f / 7) * 0.02;
  return (
    <AbsoluteFill style={{
      alignItems: 'center', textAlign: 'center', padding: '330px 68px 300px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{opacity: q, fontSize: 56, fontWeight: 900, color: C.gold, lineHeight: 1.2, maxWidth: 920}}>
          👇 Was war dein<br />Platz 1?
        </div>
        <div style={{opacity: q, fontSize: 32, color: C.muted, fontWeight: 700, maxWidth: 900, lineHeight: 1.32, marginTop: 22}}>
          Schreib A, B, C oder D – und ob du beim freien Gespräch bleiben würdest.
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

export const DieRangliste = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(880px 880px at 540px 640px, rgba(124,92,255,0.09), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={LISTE}><ListeScene /></Sequence>
      <Sequence from={LISTE} durationInFrames={LEHRE}><LehreScene /></Sequence>
      <Sequence from={LISTE + LEHRE} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Einlösung im dritten Auflösungsschritt (Zeigarnik) */}
      <Sequence from={0} durationInFrames={WAHL + 190}>
        <OpenLoop text={OPEN_Q} hint="Welches? Auflösung folgt" color={C.gold} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
