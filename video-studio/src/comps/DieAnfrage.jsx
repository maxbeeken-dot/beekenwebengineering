// „Die Anfrage" — Säule 1 (Websites).
//
// INHALTSANSPRUCH (CLAUDE.md Schritt 3a):
// · Achse SPANNEND: ein Verlauf mit offenem Ausgang. Eine abgeschickte Kundenanfrage reist
//   durch fünf Stationen; ob sie ankommt, weiß der Zuschauer bis zum Schluss nicht.
//   Die Auflösung dreht die Frage um — sie kommt an, und genau das ist das Problem.
// · Achse WISSEN: jede Station ist ein echter, prüfbarer Ausfallmechanismus (Overlay über
//   dem Button, tote Weiterleitung, fehlende Absender-Authentifizierung, keine
//   Eingangsbestätigung, Liegezeit).
// · INTERAKTION IM HAUPTTEIL: Wette zu Beginn (Ja/Nein) läuft über das ganze Video mit,
//   dazu an Station 3 der Selbsttest am eigenen Gerät.
//
// NEUES FORMAT: Reise entlang einer Schiene mit wandernder Nachricht. Bisher gab es Karten,
// Zeitleisten, Bänder, Spalten, Suchleiste, Streichliste, Waage, Preisschild, Rangliste —
// keinen Weg, den etwas zurücklegt.
//
// ZUR PSYCHOLOGIE: Der Goal-Gradient steckt hier in der Schiene selbst (sichtbar näher
// rückendes Ziel + Klartext „3 VON 5") statt in <StepProgress/>. Zwei übereinander
// gestapelte Fortschrittsanzeigen wären Doppelung — die Mechanik ist dieselbe.
// Weiter: OpenLoop (Zeigarnik, PFLICHT) · LossTag · YouAre · PeakFlash · LoopSeam.
//
// Keine erfundenen Zahlen: es wird keine Quote behauptet, nur Mechanismen benannt.
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {OpenLoop, LossTag, YouAre, PeakFlash, LoopSeam} from './Psych.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 30 fps → 685 Frames ≈ 22,8 s
const S_LEN = 85;
const HOOK = 105, STATIONEN = 5 * S_LEN, TWIST = 95, CTA = 60;
const OPEN_Q = 'Diese Anfrage ist raus. Kommt sie an?';

const STATIONS = [
  {
    ort: 'Der Button',
    text: 'Auf dem Handy liegt das Cookie-Banner über dem Absenden-Knopf. Beim dritten Tippen sitzt es.',
    chip: 'Knapp vorbei',
    kritisch: true,
  },
  {
    ort: 'Die Adresse',
    text: 'Die Mail geht an einen Mitarbeiter, der seit Februar weg ist. Die Weiterleitung greift – noch.',
    chip: 'Knapp vorbei',
    kritisch: true,
  },
  {
    ort: 'Der Spam-Ordner',
    text: 'Das Formular verschickt von fremder Domain. Ohne Absender-Authentifizierung entscheidet das Glück.',
    chip: 'Knapp vorbei',
    kritisch: true,
  },
  {
    ort: 'Die Stille',
    text: 'Der Kunde bekommt keine Bestätigung. Er weiß nicht, ob es ankam – und schreibt zwei Wettbewerber an.',
    chip: 'Jetzt wird es eng',
    kritisch: true,
  },
  {
    ort: 'Der Posteingang',
    text: 'Sie liegt da. Gelesen am Freitagnachmittag.',
    chip: 'Angekommen',
    kritisch: false,
  },
];

const RAIL_H = 1600, RAIL_PAD = 60;
const knotenY = (i) => RAIL_PAD + (i * (RAIL_H - 2 * RAIL_PAD)) / (STATIONS.length - 1);

const Schiene = ({pos, idx}) => (
  <div style={{position: 'relative', width: 96, height: RAIL_H, flexShrink: 0}}>
    {/* Spur */}
    <div style={{
      position: 'absolute', left: 45, top: RAIL_PAD, width: 6, height: RAIL_H - 2 * RAIL_PAD,
      background: C.border, borderRadius: 3,
    }} />
    {/* Zurückgelegter Weg */}
    <div style={{
      position: 'absolute', left: 45, top: RAIL_PAD, width: 6, borderRadius: 3,
      height: Math.max(0, knotenY(Math.max(0, pos)) - RAIL_PAD),
      background: `linear-gradient(180deg, ${C.violet}, ${C.teal})`,
    }} />
    {/* Knoten */}
    {STATIONS.map((_, i) => {
      const erreicht = i <= idx;
      return (
        <div key={i} style={{
          position: 'absolute', left: 32, top: knotenY(i) - 16, width: 32, height: 32,
          borderRadius: '50%', boxSizing: 'border-box',
          background: erreicht ? C.teal : C.bg,
          border: `4px solid ${erreicht ? C.teal : C.border}`,
        }} />
      );
    })}
    {/* Die Nachricht */}
    <div style={{
      position: 'absolute', left: 12, top: knotenY(Math.max(-0.4, pos)) - 36, width: 72, height: 72,
      borderRadius: 18, background: C.cardHi, border: `3px solid ${C.gold}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34,
      boxShadow: `0 0 34px ${C.gold}55`,
    }}>✉️</div>
  </div>
);

// ---------- 1) Hook: die Wette ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 38, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 68, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 74, gap: 22}}>
      <div style={{opacity: a, fontSize: 28, fontWeight: 900, color: C.violet, letterSpacing: 5, textTransform: 'uppercase'}}>
        14:12 Uhr
      </div>
      <div style={{opacity: a, fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 940}}>
        Ein Kunde füllt euer<br />Kontaktformular aus<br />und drückt Absenden.
      </div>
      <div style={{opacity: b, fontSize: 36, fontWeight: 900, color: C.gold, lineHeight: 1.3, maxWidth: 900}}>
        Wetten? 👇
      </div>
      <div style={{opacity: b, display: 'flex', gap: 18, marginTop: 2}}>
        <div style={{
          background: C.card, border: `3px solid ${C.green}`, borderRadius: 20,
          padding: '18px 30px', fontSize: 32, fontWeight: 900, color: C.green,
        }}>Kommt an</div>
        <div style={{
          background: C.card, border: `3px solid ${C.red}`, borderRadius: 20,
          padding: '18px 30px', fontSize: 32, fontWeight: 900, color: C.red,
        }}>Kommt nicht an</div>
      </div>
      <div style={{opacity: c, fontSize: 29, fontWeight: 800, color: C.muted, maxWidth: 880, marginTop: 4}}>
        Fünf Stationen liegen<br />zwischen ihm und euch.
      </div>
      <PeakFlash at={68} color={C.violet} strength={0.13} />
    </AbsoluteFill>
  );
};

// ---------- 2) Die Reise ----------
const ReiseScene = () => {
  const f = useCurrentFrame();
  const idx = Math.min(STATIONS.length - 1, Math.floor(f / S_LEN));
  const local = f - idx * S_LEN;
  const s = STATIONS[idx];
  // Die Nachricht wandert zu Beginn jeder Station zum nächsten Knoten
  const pos = idx - 1 + Math.min(1, local / 26);
  const karte = spring({frame: local - 8, fps: 30, config: {damping: 16}});
  const chip = spring({frame: local - 44, fps: 30, config: {damping: 14}});
  const selbsttest = spring({frame: local - 34, fps: 30, config: {damping: 15}});
  const farbe = s.kritisch ? C.red : C.teal;

  // Die Karte reist mit: ihr Platz folgt dem Knoten, an dem die Nachricht gerade steht.
  // Dadurch nutzt die Szene die ganze Bildhöhe, statt in der Mitte zu kleben.
  const kartenH = idx === 2 ? 640 : 460;
  const roh = knotenY(idx) - kartenH / 2;
  const oben = Math.max(0, Math.min(RAIL_H - kartenH, roh));

  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '210px 44px 110px'}}>
      <div style={{display: 'flex', gap: 26, width: 992, alignItems: 'flex-start'}}>
        <Schiene pos={pos} idx={idx} />
        <div style={{flex: 1, position: 'relative', height: RAIL_H}}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: oben,
            display: 'flex', flexDirection: 'column', gap: 20,
          }}>
          <div style={{
            opacity: karte, transform: `translateX(${(1 - karte) * 26}px)`,
            background: C.card, border: `3px solid ${farbe}66`, borderRadius: 22,
            padding: '32px 30px', height: 460, boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left',
          }}>
            {/* Goal-Gradient im Klartext: das Ziel rückt sichtbar näher */}
            <div style={{fontSize: 24, fontWeight: 900, color: C.muted, letterSpacing: 4}}>
              STATION {idx + 1} VON {STATIONS.length}
            </div>
            <div style={{fontSize: 46, fontWeight: 900, color: C.ink, lineHeight: 1.15, marginTop: 8}}>{s.ort}</div>
            <div style={{fontSize: 34, fontWeight: 800, color: C.ink, lineHeight: 1.26, marginTop: 16, opacity: 0.92}}>
              {s.text}
            </div>
            <div style={{opacity: chip, marginTop: 20}}>
              <div style={{
                display: 'inline-block', fontSize: 28, fontWeight: 900, color: farbe,
                background: `${farbe}1a`, border: `2px solid ${farbe}66`, borderRadius: 12, padding: '10px 20px',
              }}>{s.chip}</div>
            </div>
          </div>

          {/* Mitmachen mitten im Hauptteil, nicht im Abspann */}
          {idx === 2 && (
            <div style={{
              opacity: selbsttest, transform: `translateY(${(1 - selbsttest) * 16}px)`,
              background: `${C.gold}12`, border: `2px solid ${C.gold}77`, borderRadius: 18,
              padding: '22px 26px', textAlign: 'left',
            }}>
              <div style={{fontSize: 23, fontWeight: 900, color: C.gold, letterSpacing: 3, textTransform: 'uppercase'}}>
                Kurz anhalten
              </div>
              <div style={{fontSize: 31, fontWeight: 800, color: C.ink, lineHeight: 1.24, marginTop: 6}}>
                Wann hast du deinem eigenen Formular zuletzt geschrieben?
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
      <PeakFlash at={3 * S_LEN + 44} color={C.red} strength={0.17} />
      <PeakFlash at={4 * S_LEN + 8} color={C.teal} strength={0.18} />
    </AbsoluteFill>
  );
};

// ---------- 3) Die Auflösung: die Frage kippt ----------
const TwistScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const b = spring({frame: f - 26, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 52, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{
      alignItems: 'center', textAlign: 'center', padding: '290px 66px 230px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <PeakFlash at={2} color={C.gold} strength={0.22} />
      <div style={{opacity: a, fontSize: 52, fontWeight: 900, color: C.ink, lineHeight: 1.22, maxWidth: 940}}>
        Sie ist angekommen.<br />
        <span style={{color: C.gold}}>Der Auftrag war da schon weg.</span>
      </div>
      <div style={{opacity: b}}>
        <LossTag text="Und du erfährst nie, dass es knapp war. Es sieht aus wie ein ruhiger Monat." />
      </div>
      <div style={{opacity: c, maxWidth: 930}}>
        <YouAre text="Ein Formular ist nicht fertig, wenn es abschickt. Es ist fertig, wenn die Antwort raus ist." color={C.teal} />
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
          👇 Schick dir selbst<br />eine Testanfrage.
        </div>
        <div style={{opacity: q, fontSize: 31, color: C.muted, fontWeight: 700, maxWidth: 900, lineHeight: 1.32, marginTop: 22}}>
          Über dein eigenes Formular, jetzt. Schreib in die Kommentare, wie lange sie gebraucht hat.
        </div>
      </div>
      <div style={{opacity: line}}>
        <div style={{fontSize: 25, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 50, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 10}}>
          Websites, die <span style={{color: C.teal}}>ankommen</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 26}}>
          <div style={{transform: `scale(${pulse})`, padding: '19px 34px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 30, fontWeight: 900}}>
            beekenwebengineering.com
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DieAnfrage = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(880px 880px at 540px 700px, rgba(124,92,255,0.09), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={STATIONEN}><ReiseScene /></Sequence>
      <Sequence from={HOOK + STATIONEN} durationInFrames={TWIST}><TwistScene /></Sequence>
      <Sequence from={HOOK + STATIONEN + TWIST} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Auflösung (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + STATIONEN}>
        <OpenLoop text={OPEN_Q} hint="5 Stationen · Wette läuft" color={C.gold} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
