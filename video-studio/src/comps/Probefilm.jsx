// „Probefilm" — immersiver Kurzfilm aus den Original-Fotos EINES Airbnb-Inserats.
//
// Zweck: Verkaufsinstrument für die dritte Säule. Der Host sieht sein eigenes Haus in
// Bewegung, statt ein fremdes Schaustück. Das ersetzt die Gratis-Probe pro Lead nicht —
// es IST die Probe, aber ohne Rückfrage vorab produziert und direkt verlinkt.
//
// KENNZEICHNUNG (User-Anweisung 2026-08-16): Der Film trägt durchgehend das Label
// „Probefilm". Nicht verhandelbar — er entsteht aus fremdem Bildmaterial und darf zu
// keinem Zeitpunkt wie ein fertiges, freigegebenes Werk des Hosts wirken.
//
// Rechtlicher Rahmen: Bildrechte liegen beim Host. Verwendung ausschließlich gegenüber
// diesem Host, Seite unlisted + noindex, Löschung auf Zuruf. Siehe airbnb-media.mjs.
//
// Bildsprache bewusst ruhig: langsame Kamerafahrten, lange Standzeiten, weiche Blenden.
// Schnelle Schnitte würden Luxusobjekte billig wirken lassen — das Gegenteil des Ziels.
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#b9b7c4',
  violet: '#7c5cff', teal: '#34e3d0',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const INTRO = 96;   // 3,2 s Auftakt
const SHOT = 78;    // 2,6 s je Aufnahme
const XFADE = 20;   // weiche Blende
const OUTRO = 120;  // 4 s Abbinder

/** Langsame Kamerafahrt. Richtung wechselt je Aufnahme, sonst wirkt es mechanisch. */
const KenBurns = ({src, index, dur}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], {extrapolateRight: 'clamp'});
  const dir = index % 4;
  const zoom = dir === 1 || dir === 2 ? 1.16 - p * 0.10 : 1.04 + p * 0.10;
  const dx = dir === 0 ? p * 26 - 13 : dir === 2 ? 13 - p * 26 : 0;
  const dy = dir === 1 ? p * 22 - 11 : dir === 3 ? 11 - p * 22 : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: C.bg}}>
      <Img
        src={src}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${zoom}) translate(${dx}px, ${dy}px)`,
        }}
      />
      {/* Verlauf oben/unten, damit Schrift auf jedem Foto lesbar bleibt (WCAG-Denke). */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(8,8,11,.72) 0%, rgba(8,8,11,.10) 26%, rgba(8,8,11,.10) 62%, rgba(8,8,11,.86) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Dauerhaftes Label. Steht in JEDEM Frame — siehe Kopfkommentar. */
const ProbefilmLabel = () => (
  <AbsoluteFill style={{padding: 54, pointerEvents: 'none'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <div
        style={{
          fontFamily: FONT, fontSize: 26, fontWeight: 800, letterSpacing: 3,
          color: C.ink, textTransform: 'uppercase',
          padding: '10px 18px', borderRadius: 999,
          border: `2px solid ${C.teal}`, background: 'rgba(8,8,11,.46)',
        }}
      >
        Probefilm
      </div>
    </div>
  </AbsoluteFill>
);

const Intro = ({name, location}) => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 14, fps: 30, config: {damping: 18}});
  const b = spring({frame: f - 40, fps: 30, config: {damping: 18}});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', padding: '0 76px 200px', textAlign: 'center'}}>
      <div style={{opacity: a, transform: `translateY(${(1 - a) * 26}px)`, fontFamily: FONT, fontSize: 74, fontWeight: 900, color: C.ink, lineHeight: 1.1}}>
        {name}
      </div>
      {location ? (
        <div style={{opacity: b, marginTop: 20, fontFamily: FONT, fontSize: 32, fontWeight: 600, color: C.muted, letterSpacing: 1}}>
          {location}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Outro = ({name}) => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 10, fps: 30, config: {damping: 18}});
  const b = spring({frame: f - 38, fps: 30, config: {damping: 18}});
  const c = spring({frame: f - 66, fps: 30, config: {damping: 18}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center', gap: 26}}>
      <div style={{opacity: a, fontFamily: FONT, fontSize: 46, fontWeight: 800, color: C.ink, lineHeight: 1.2}}>
        {name}
      </div>
      <div style={{opacity: b, fontFamily: FONT, fontSize: 34, fontWeight: 600, color: C.muted, lineHeight: 1.35, maxWidth: 820}}>
        Ihre eigenen Fotos.<br />In Bewegung.
      </div>
      <div
        style={{
          opacity: c, marginTop: 22, fontFamily: FONT, fontSize: 30, fontWeight: 800,
          color: C.bg, background: C.teal, padding: '16px 30px', borderRadius: 14, letterSpacing: 0.5,
        }}
      >
        beekenwebengineering.com
      </div>
    </AbsoluteFill>
  );
};

export const Probefilm = ({slug, name, location, photos}) => {
  const {durationInFrames} = useVideoConfig();
  const files = photos && photos.length ? photos : ['01.jpg'];
  const src = (f) => staticFile(`probefilm/${slug}/${f}`);

  // Auftakt nutzt Foto 1, danach laufen die übrigen als Aufnahmen durch.
  const shots = files.slice(1);
  const outroStart = Math.max(INTRO, durationInFrames - OUTRO);

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Sequence durationInFrames={INTRO + XFADE}>
        <KenBurns src={src(files[0])} index={0} dur={INTRO + XFADE} />
        <Intro name={name} location={location} />
      </Sequence>

      {shots.map((file, i) => {
        const from = INTRO + i * (SHOT - XFADE);
        if (from >= outroStart) return null;
        return (
          <Sequence key={file} from={from} durationInFrames={SHOT}>
            <FadeIn dur={XFADE}>
              <KenBurns src={src(file)} index={i + 1} dur={SHOT} />
            </FadeIn>
          </Sequence>
        );
      })}

      <Sequence from={outroStart} durationInFrames={OUTRO}>
        <FadeIn dur={XFADE}>
          <AbsoluteFill style={{backgroundColor: C.bg}} />
          <Outro name={name} />
        </FadeIn>
      </Sequence>

      <ProbefilmLabel />
      <MusicBed volume={0.34} />
    </AbsoluteFill>
  );
};

/** Weiche Einblendung — überlagert die vorherige Aufnahme, statt hart zu schneiden. */
const FadeIn = ({dur, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

Probefilm.defaultProps = {
  slug: 'chalet-astra',
  name: 'Chalet Astra',
  location: 'Ultental, Südtirol',
  photos: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '11.jpg', '12.jpg'],
};
