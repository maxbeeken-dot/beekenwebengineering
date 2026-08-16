// „Das Preisschild" — Säule 1 (Websites).
//
// INHALTSANSPRUCH (CLAUDE.md Schritt 3a):
// · Achse KONTROVERS: An einem der vier Posten verdiene ich selbst mit — und sage trotzdem
//   „Finger weg". Das ist eine angreifbare Position, keine Provokation gegen Personen.
// · Achse WISSEN: Jede Runde liefert einen Mechanismus (warum), keinen Tipp (was).
// · INTERAKTION IM HAUPTTEIL: pro Runde urteilt der Zuschauer VOR mir — Countdown-Fenster
//   mit zwei Tasten, danach fällt der Stempel. Er zählt seine Treffer mit.
//
// NEUES FORMAT: Preisschild-Urteilsspiel mit einschlagendem Stempel. Bisher gab es Karten,
// Zeitleisten, Bänder, Spalten, Suchleiste, Streichliste, Gerät, Waage — kein Preisurteil.
//
// Keine erfundenen Zahlen: die Preise sind Größenordnungen aus dem Markt, es wird keine
// Wirkungs-Statistik behauptet.
//
// Psychologie: OpenLoop (Zeigarnik, PFLICHT — wird in Runde 3 eingelöst) · StepProgress
// (4 Runden) · LossTag · YouAre · PeakFlash · LoopSeam.
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';
import {OpenLoop, StepProgress, LossTag, YouAre, PeakFlash, LoopSeam} from './Psych.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

// 30 fps → 700 Frames ≈ 23,3 s
const R_LEN = 120;
const HOOK = 100, RUNDEN = 4 * R_LEN, BILANZ = 110, CTA = 60;
// Einzeilig halten: zweizeilig läuft der Banner in den Fortschrittszähler (top: 168).
const OPEN_Q = 'An einem verdiene ich mit – an welchem?';

// ---------- Preisschild ----------
const Preisschild = ({titel, preis, s}) => (
  <div style={{
    position: 'relative', width: 900, opacity: s,
    transform: `translateY(${(1 - s) * -26}px) rotate(${(1 - s) * -3}deg)`,
  }}>
    <div style={{
      background: C.cardHi, border: `3px solid ${C.border}`, borderRadius: 22,
      clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 8% 100%, 0 50%)',
      padding: '44px 34px 44px 140px', boxSizing: 'border-box',
    }}>
      <div style={{fontSize: 44, fontWeight: 900, color: C.ink, lineHeight: 1.16}}>{titel}</div>
      <div style={{fontSize: 54, fontWeight: 900, color: C.gold, marginTop: 10, letterSpacing: 1}}>{preis}</div>
    </div>
    {/* Loch im Schild */}
    <div style={{
      position: 'absolute', left: 74, top: '50%', width: 26, height: 26, marginTop: -13,
      borderRadius: '50%', background: C.bg, border: `3px solid ${C.border}`,
    }} />
  </div>
);

// ---------- Urteilsfenster (die Interaktion) ----------
const Urteil = ({local, lohnt}) => {
  const auf = spring({frame: local - 22, fps: 30, config: {damping: 17}});
  const rest = interpolate(local, [30, 62], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const gefallen = local >= 62;
  const st = spring({frame: local - 62, fps: 30, config: {damping: 11, stiffness: 190}});

  const taste = (aktiv, farbe, text, emoji) => (
    <div style={{
      flex: 1, background: C.card, borderRadius: 20, padding: '20px 12px', textAlign: 'center',
      border: `3px solid ${gefallen ? (aktiv ? farbe : C.border) : `${farbe}88`}`,
      opacity: gefallen && !aktiv ? 0.24 : 1,
      fontSize: 27, fontWeight: 900, color: gefallen && !aktiv ? C.dim : farbe,
    }}>
      <div style={{fontSize: 40, marginBottom: 4}}>{emoji}</div>{text}
    </div>
  );

  return (
    <div style={{width: 900, opacity: auf}}>
      <div style={{
        fontSize: 25, fontWeight: 900, color: C.muted, letterSpacing: 4,
        textTransform: 'uppercase', textAlign: 'center', marginBottom: 12,
      }}>
        {gefallen ? 'Mein Urteil' : 'Du zuerst'}
      </div>
      <div style={{position: 'relative'}}>
        <div style={{display: 'flex', gap: 16}}>
          {taste(!lohnt, C.red, 'Geld weg', '💸')}
          {taste(lohnt, C.green, 'Lohnt sich', '✅')}
        </div>
        {/* Stempel schlägt ein */}
        {gefallen && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          }}>
            <div style={{
              transform: `scale(${1 + (1 - st) * 0.7}) rotate(${-9 - (1 - st) * 14}deg)`,
              opacity: Math.min(1, st * 1.6),
              border: `6px solid ${lohnt ? C.green : C.red}`, borderRadius: 14,
              padding: '10px 26px', background: 'rgba(8,8,11,0.82)',
              fontSize: 44, fontWeight: 900, letterSpacing: 4,
              color: lohnt ? C.green : C.red, textTransform: 'uppercase',
            }}>{lohnt ? 'Lohnt sich' : 'Geld weg'}</div>
          </div>
        )}
      </div>
      {/* Countdown-Balken: solange er läuft, gehört die Entscheidung dem Zuschauer */}
      <div style={{height: 10, background: C.border, borderRadius: 999, marginTop: 14, overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${rest * 100}%`, background: C.gold, borderRadius: 999}} />
      </div>
    </div>
  );
};

// ---------- 1) Hook ----------
const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 4, fps: 30, config: {damping: 16}});
  const b = spring({frame: f - 38, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 66, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 74, gap: 22}}>
      <div style={{opacity: a, fontSize: 28, fontWeight: 900, color: C.gold, letterSpacing: 5, textTransform: 'uppercase'}}>
        Lohnt sich das?
      </div>
      <div style={{opacity: a, fontSize: 54, fontWeight: 900, color: C.ink, lineHeight: 1.2, maxWidth: 930}}>
        Vier Posten, die kleine Firmen<br />für ihre Website zahlen.
      </div>
      <div style={{opacity: b, fontSize: 35, fontWeight: 900, color: C.teal, lineHeight: 1.3, maxWidth: 900}}>
        Du urteilst zuerst. 👇
      </div>
      <div style={{opacity: b, display: 'flex', gap: 18, marginTop: 2}}>
        <div style={{
          background: C.card, border: `3px solid ${C.red}`, borderRadius: 20,
          padding: '18px 26px', fontSize: 31, fontWeight: 900, color: C.red,
        }}>💸 Geld weg</div>
        <div style={{
          background: C.card, border: `3px solid ${C.green}`, borderRadius: 20,
          padding: '18px 26px', fontSize: 31, fontWeight: 900, color: C.green,
        }}>✅ Lohnt sich</div>
      </div>
      <div style={{opacity: c, fontSize: 29, fontWeight: 800, color: C.muted, maxWidth: 880, marginTop: 4}}>
        Zähl mit, wie oft wir<br />uns einig sind.
      </div>
      <PeakFlash at={66} color={C.gold} strength={0.13} />
    </AbsoluteFill>
  );
};

// ---------- 2) Vier Runden ----------
const POSTEN = [
  {
    titel: 'Eigene Domain',
    preis: '≈ 15 € im Jahr',
    lohnt: true,
    warum: 'Die Adresse gehört dir. Beim Anbieterwechsel zieht sie mit – sonst fängst du bei null an.',
  },
  {
    titel: 'Cookie-Banner-Tool',
    preis: '≈ 15 € im Monat',
    lohnt: false,
    warum: 'Ein Banner braucht nur, wer einwilligungspflichtige Dienste lädt. Keine Fremd-Fonts, kein Pixel – kein Banner.',
  },
  {
    titel: 'Relaunch alle zwei Jahre',
    preis: 'vierstellig, immer wieder',
    lohnt: false,
    warum: 'Kunden vertreibt nicht die Optik, sondern Ladezeit, Handy-Bedienung und Auffindbarkeit. Die pflegt man.',
    gestaendnis: 'Daran verdiene ich. Ich sage trotzdem: Finger weg.',
  },
  {
    titel: 'Google-Profil pflegen',
    preis: '0 € – nur Zeit',
    lohnt: true,
    warum: 'Bei „in der Nähe" entscheidet die Karte, nicht deine Seite. Wer dort verwaist ist, wird nicht angeklickt.',
  },
];

const RundenScene = () => {
  const f = useCurrentFrame();
  const idx = Math.min(POSTEN.length - 1, Math.floor(f / R_LEN));
  const local = f - idx * R_LEN;
  const p = POSTEN[idx];
  const schild = spring({frame: local - 2, fps: 30, config: {damping: 16}});
  const warum = spring({frame: local - 70, fps: 30, config: {damping: 15}});
  const gest = spring({frame: local - 92, fps: 30, config: {damping: 14}});

  return (
    <AbsoluteFill style={{alignItems: 'center', padding: '244px 40px 56px'}}>
      <StepProgress current={idx + 1} total={4} color={C.gold} />
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        minHeight: 1400, justifyContent: 'space-between', marginTop: 22,
      }}>
        <Preisschild titel={p.titel} preis={p.preis} s={schild} />

        <Urteil local={local} lohnt={p.lohnt} />

        {/* Der Mechanismus – nicht der Tipp. Rahmen steht von Anfang an, damit das
            untere Bilddrittel nie leer läuft; nur der Inhalt blendet ein. */}
        <div style={{
          width: 930, background: C.card, borderRadius: 20,
          border: `2px solid ${warum > 0.05 ? `${p.lohnt ? C.green : C.red}55` : C.border}`,
          padding: '30px 30px', minHeight: 400, boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left',
        }}>
          {warum > 0.05 ? (
            <>
              <div style={{
                opacity: warum, fontSize: 24, fontWeight: 900, letterSpacing: 3,
                textTransform: 'uppercase', color: p.lohnt ? C.green : C.red,
              }}>Warum</div>
              <div style={{
                opacity: warum, transform: `translateY(${(1 - warum) * 18}px)`,
                fontSize: 36, fontWeight: 800, color: C.ink, lineHeight: 1.25, marginTop: 8,
              }}>{p.warum}</div>
              {p.gestaendnis && (
                <div style={{opacity: gest, marginTop: 18}}>
                  <LossTag text={p.gestaendnis} color={C.gold} />
                </div>
              )}
            </>
          ) : (
            <div style={{fontSize: 40, fontWeight: 900, color: C.dim, letterSpacing: 10, textAlign: 'center'}}>
              • • •
            </div>
          )}
        </div>
      </div>
      {/* Höhepunkt: das Eingeständnis in Runde 3 */}
      <PeakFlash at={2 * R_LEN + 92} color={C.gold} strength={0.2} />
      <PeakFlash at={3 * R_LEN + 62} color={C.teal} strength={0.16} />
    </AbsoluteFill>
  );
};

// ---------- 3) Bilanz + Auflösung ----------
// Löst zwei Versprechen ein: den Zeigarnik („an welchem verdiene ich mit") und das
// „Zähl mit" aus dem Hook — ohne Übersicht könnte der Zuschauer seinen Stand nicht prüfen.
const BilanzScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: 30, config: {damping: 15}});
  const c = spring({frame: f - 44, fps: 30, config: {damping: 15}});
  return (
    <AbsoluteFill style={{
      alignItems: 'center', padding: '160px 60px 90px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <PeakFlash at={2} color={C.gold} strength={0.18} />
      <div style={{textAlign: 'center'}}>
        <div style={{opacity: a, fontSize: 30, fontWeight: 900, color: C.gold, letterSpacing: 4, textTransform: 'uppercase'}}>
          Der Stand
        </div>
        <div style={{opacity: a, fontSize: 46, fontWeight: 900, color: C.ink, lineHeight: 1.2, marginTop: 10}}>
          Wie oft lagst du wie ich?
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
        {POSTEN.map((p, i) => {
          const s = spring({frame: f - 10 - i * 12, fps: 30, config: {damping: 16}});
          const istGeheimnis = i === 2;
          return (
            <div key={i} style={{
              opacity: s, transform: `translateX(${(1 - s) * -26}px)`,
              width: 940, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 18,
              background: istGeheimnis ? `${C.gold}14` : C.card,
              border: `2px solid ${istGeheimnis ? C.gold : C.border}`,
              borderRadius: 16, padding: '20px 24px',
            }}>
              <div style={{fontSize: 26, fontWeight: 900, color: C.dim, width: 34}}>{i + 1}</div>
              <div style={{flex: 1, fontSize: 33, fontWeight: 800, color: C.ink, textAlign: 'left'}}>{p.titel}</div>
              <div style={{fontSize: 34}}>{p.lohnt ? '✅' : '💸'}</div>
            </div>
          );
        })}
      </div>

      {/* Feste Höhe: der Block ist von Anfang an eingeplant, sonst springt das Layout
          und das untere Bilddrittel steht sekundenlang leer. */}
      <div style={{
        minHeight: 400, width: 940, display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', gap: 22,
      }}>
        <div style={{opacity: c, textAlign: 'center'}}>
          <div style={{fontSize: 27, fontWeight: 900, color: C.gold, letterSpacing: 3, textTransform: 'uppercase'}}>
            Und Nummer 3?
          </div>
          <div style={{fontSize: 44, fontWeight: 900, color: C.ink, lineHeight: 1.22, marginTop: 10}}>
            Daran verdiene ich –<br />und rate trotzdem ab.
          </div>
        </div>
        <div style={{opacity: c}}>
          <YouAre text="Eine Seite, die dir gehört und gepflegt wird, überlebt drei Relaunch-Runden." color={C.teal} />
        </div>
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
      alignItems: 'center', textAlign: 'center', padding: '330px 68px 300px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{opacity: q, fontSize: 56, fontWeight: 900, color: C.gold, lineHeight: 1.2, maxWidth: 920}}>
          👇 Wie oft waren wir<br />uns einig?
        </div>
        <div style={{opacity: q, fontSize: 32, color: C.muted, fontWeight: 700, maxWidth: 900, lineHeight: 1.32, marginTop: 22}}>
          Schreib deine Zahl von 0 bis 4 – und bei welchem Posten ich falsch liege.
        </div>
      </div>
      <div style={{opacity: line}}>
        <div style={{fontSize: 25, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 52, color: C.ink, fontWeight: 900, lineHeight: 1.14, marginTop: 10}}>
          Websites, die <span style={{color: C.teal}}>dir gehören</span>
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

export const DasPreisschild = () => (
  <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
    <MusicBed />
    <AbsoluteFill style={{background: 'radial-gradient(860px 860px at 540px 620px, rgba(245,185,69,0.08), transparent 70%)'}} />
    <LoopSeam frames={14}>
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={RUNDEN}><RundenScene /></Sequence>
      <Sequence from={HOOK + RUNDEN} durationInFrames={BILANZ}><BilanzScene /></Sequence>
      <Sequence from={HOOK + RUNDEN + BILANZ} durationInFrames={CTA}><CtaScene /></Sequence>
      {/* Offene Schleife bis zur Einlösung in Runde 3 (Zeigarnik) */}
      <Sequence from={0} durationInFrames={HOOK + 3 * R_LEN}>
        <OpenLoop text={OPEN_Q} hint="4 Posten · Urteile mit" color={C.gold} />
      </Sequence>
    </LoopSeam>
  </AbsoluteFill>
);
