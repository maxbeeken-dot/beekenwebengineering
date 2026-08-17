// „Probefilm AI" — Rundgang aus KI-animierten Einstellungen.
//
// Unterschied zum normalen Probefilm: Dort fährt die Kamera über ein Standbild
// (Ken Burns). Hier hat Higgsfield/Seedance aus jedem Foto eine echte Bewegung im
// Raum erzeugt — es liest sich, als ginge man durch die Wohnung.
//
// Jede Einstellung startet auf einem ECHTEN Foto des Inserats. Die KI erfindet keine
// Räume, sie bewegt nur die Kamera darin. Das ist die Bedingung dafür, dass der Film
// überhaupt als Vorschlag für DIESES Objekt taugt.
//
// KENNZEICHNUNG bleibt Pflicht: Das Label „Probefilm" steht in jedem Frame.
import {AbsoluteFill, Sequence, Video, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {bg: '#08080b', ink: '#f6f5fa', muted: '#b9b7c4', teal: '#34e3d0'};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const SHOT = 120;   // 4 s je KI-Clip
const XFADE = 16;   // weiche Blende
const OUTRO = 105;

const FadeIn = ({dur, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

/** Dauerhaftes Label — siehe Kopfkommentar, nicht verhandelbar. */
const Label = () => (
  <AbsoluteFill style={{padding: 54, pointerEvents: 'none'}}>
    <div style={{
      alignSelf: 'flex-start', fontFamily: FONT, fontSize: 26, fontWeight: 800, letterSpacing: 3,
      color: C.ink, textTransform: 'uppercase', padding: '10px 18px', borderRadius: 999,
      border: `2px solid ${C.teal}`, background: 'rgba(8,8,11,.46)',
    }}>Probefilm</div>
  </AbsoluteFill>
);

const Title = ({name, location}) => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 12, fps: 30, config: {damping: 18}});
  const b = spring({frame: f - 36, fps: 30, config: {damping: 18}});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', padding: '0 76px 190px', textAlign: 'center'}}>
      {/* Schwarzverlauf unten, sonst verschwindet Schrift auf hellen Aufnahmen. */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 55%, rgba(8,8,11,.82) 100%)'}} />
      <div style={{opacity: a, transform: `translateY(${(1 - a) * 22}px)`, fontFamily: FONT, fontSize: 74, fontWeight: 900, color: C.ink, lineHeight: 1.1, zIndex: 1}}>
        {name}
      </div>
      {location ? (
        <div style={{opacity: b, marginTop: 18, fontFamily: FONT, fontSize: 32, fontWeight: 600, color: C.muted, zIndex: 1}}>
          {location}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Outro = ({name}) => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 8, fps: 30, config: {damping: 18}});
  const b = spring({frame: f - 32, fps: 30, config: {damping: 18}});
  const c = spring({frame: f - 56, fps: 30, config: {damping: 18}});
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center', padding: 80, textAlign: 'center', gap: 24}}>
      <div style={{opacity: a, fontFamily: FONT, fontSize: 46, fontWeight: 800, color: C.ink}}>{name}</div>
      <div style={{opacity: b, fontFamily: FONT, fontSize: 34, fontWeight: 600, color: C.muted, lineHeight: 1.35, maxWidth: 820}}>
        Ihre eigenen Fotos.<br />Als Rundgang.
      </div>
      <div style={{opacity: c, marginTop: 20, fontFamily: FONT, fontSize: 30, fontWeight: 800, color: C.bg, background: C.teal, padding: '16px 30px', borderRadius: 14}}>
        beekenwebengineering.com
      </div>
    </AbsoluteFill>
  );
};

export const ProbefilmAI = ({slug, name, location, clips}) => {
  const {durationInFrames} = useVideoConfig();
  const list = clips && clips.length ? clips : ['schmolti-01.mp4'];
  const outroStart = Math.max(SHOT, durationInFrames - OUTRO);

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      {list.map((file, i) => {
        const from = i * (SHOT - XFADE);
        if (from >= outroStart) return null;
        return (
          <Sequence key={file} from={from} durationInFrames={SHOT + XFADE}>
            <FadeIn dur={i === 0 ? 1 : XFADE}>
              <Video src={staticFile(`probefilm/${slug}/clips/${file}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </FadeIn>
            {i === 0 ? <Title name={name} location={location} /> : null}
          </Sequence>
        );
      })}

      <Sequence from={outroStart} durationInFrames={OUTRO}>
        <FadeIn dur={XFADE}><Outro name={name} /></FadeIn>
      </Sequence>

      <Label />
      <MusicBed volume={0.32} />
    </AbsoluteFill>
  );
};
