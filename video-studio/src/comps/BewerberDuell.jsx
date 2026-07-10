import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring} from 'remotion';
import {MusicBed} from './MusicBed.jsx';

const C = {
  bg: '#08080b', ink: '#f6f5fa', muted: '#8b8a99', dim: '#56555f',
  violet: '#7c5cff', teal: '#34e3d0', red: '#ff5468', gold: '#f5b945', green: '#3ddc84',
  card: '#15141d', cardHi: '#1c1b26', border: '#26242f',
};
const FONT = "'Helvetica Neue','Arial',system-ui,sans-serif";

const HOOK = 48, DUEL = 222, REVEAL = 90, INSIGHT = 90, CTA = 90; // 540 = 18 s

const Phone = ({tone, f, delay, dim}) => {
  const s = spring({frame: f - delay, fps: 30, config: {damping: 16, mass: 0.8}});
  const good = tone === 'good';
  const col = good ? C.teal : C.red;
  const dir = good ? 1 : -1;
  const spin = (f * 6) % 360;
  return (
    <div style={{
      width: 452, height: 830, opacity: (dim ? 0.4 : 1) * s, transform: `translateX(${(1 - s) * dir * 90}px) scale(${0.9 + s * 0.1})`,
      background: C.card, border: `3px solid ${col}${dim ? '44' : '99'}`, borderRadius: 40, padding: 24,
      display: 'flex', flexDirection: 'column', gap: 18, boxShadow: dim ? 'none' : `0 0 44px ${col}22`,
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, background: C.bg, borderRadius: 12, padding: '10px 14px'}}>
        <div style={{width: 12, height: 12, borderRadius: 12, background: col}} />
        <div style={{fontSize: 21, color: C.dim, fontWeight: 600}}>{good ? 'karriere · modern' : 'karriere · 2011'}</div>
      </div>
      {good ? (
        <>
          <div style={{fontSize: 74, textAlign: 'center', marginTop: 8}}>✅</div>
          <div style={{fontSize: 34, fontWeight: 900, color: C.ink, textAlign: 'center'}}>In 2 Minuten bewerben</div>
          <div style={{background: C.cardHi, borderRadius: 14, padding: '14px 16px', fontSize: 24, color: C.muted, fontWeight: 700}}>👥 Lern das Team kennen</div>
          <div style={{background: C.cardHi, borderRadius: 14, padding: '14px 16px', fontSize: 24, color: C.muted, fontWeight: 700}}>📱 Blitzschnell am Handy</div>
          <div style={{flex: 1}} />
          <div style={{background: C.teal, color: '#04120f', borderRadius: 16, padding: '18px', fontSize: 30, fontWeight: 900, textAlign: 'center', boxShadow: `0 0 30px ${C.teal}55`}}>Jetzt bewerben →</div>
        </>
      ) : (
        <>
          <div style={{fontSize: 74, textAlign: 'center', marginTop: 8}}>🚧</div>
          <div style={{fontSize: 32, fontWeight: 900, color: C.muted, textAlign: 'center'}}>Bewerbung bitte per Fax 📠</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, background: C.cardHi, borderRadius: 14, padding: '14px 16px'}}>
            <div style={{width: 26, height: 26, borderRadius: 26, border: `3px solid ${C.dim}`, borderTopColor: C.red, transform: `rotate(${spin}deg)`}} />
            <div style={{fontSize: 24, color: C.dim, fontWeight: 700}}>Lädt…</div>
          </div>
          <div style={{background: 'rgba(255,84,104,0.12)', border: `1px solid ${C.red}55`, borderRadius: 12, padding: '10px 14px', fontSize: 22, color: C.red, fontWeight: 700}}>zuletzt aktualisiert: 2011</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4}}>
            {[0, 1, 2].map((i) => <div key={i} style={{height: 10, width: `${80 - i * 14}%`, background: C.border, borderRadius: 8}} />)}
          </div>
        </>
      )}
    </div>
  );
};

const HookScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 12, mass: 0.6}});
  const b = spring({frame: f - 18, fps: 30, config: {damping: 14}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 26}}>
      <div style={{fontSize: 62, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.9 + a * 0.1})`}}>POV: Du suchst<br />einen Job. 💼</div>
      <div style={{fontSize: 42, fontWeight: 800, color: C.gold, opacity: b, transform: `translateY(${(1 - b) * 22}px)`}}>Beide Firmen zahlen 3.500 €.</div>
    </AbsoluteFill>
  );
};

const DuelScene = () => {
  const f = useCurrentFrame();
  const voteOn = f > 110;
  const votePulse = 1 + Math.sin(f * 0.32) * 0.05;
  const vote = spring({frame: f - 110, fps: 30, config: {damping: 13}});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '90px 34px 0'}}>
      <div style={{display: 'flex', gap: 30, alignItems: 'flex-start'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
          <Phone tone="bad" f={f} delay={0} dim={voteOn} />
          <div style={{fontSize: 40, fontWeight: 900, color: C.red}}>LINKS</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
          <Phone tone="good" f={f} delay={10} dim={voteOn} />
          <div style={{fontSize: 40, fontWeight: 900, color: C.teal}}>RECHTS</div>
        </div>
      </div>
      {voteOn && (
        <div style={{position: 'absolute', top: '40%', left: 0, right: 0, textAlign: 'center', opacity: vote}}>
          <div style={{transform: `scale(${votePulse})`, display: 'inline-block', background: 'rgba(8,8,11,0.86)', border: `2px solid ${C.violet}`, borderRadius: 22, padding: '26px 40px'}}>
            <div style={{fontSize: 52, fontWeight: 900, color: C.ink}}>Wo bewirbst DU dich? 👇</div>
            <div style={{fontSize: 34, fontWeight: 800, color: C.muted, marginTop: 8}}>
              <span style={{color: C.red}}>LINKS</span> oder <span style={{color: C.teal}}>RECHTS</span>?
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const RevealScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{fontSize: 50, fontWeight: 900, color: C.ink, opacity: a, transform: `scale(${0.92 + a * 0.08})`, lineHeight: 1.2, maxWidth: 920}}>
        Die beste Fachkraft entscheidet in <span style={{color: C.teal}}>8 Sekunden</span>.<br />
        <span style={{fontSize: 40, color: C.muted}}>Und sie sieht zuerst deine Website — nicht dein Gehalt.</span>
      </div>
    </AbsoluteFill>
  );
};

const InsightScene = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f, fps: 30, config: {damping: 14, mass: 0.6}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60}}>
      <div style={{fontSize: 54, fontWeight: 900, color: C.ink, opacity: a, transform: `translateY(${(1 - a) * 24}px)`, lineHeight: 1.2, maxWidth: 900}}>
        Eine schlechte Website kostet dich nicht nur Kunden.<br /><span style={{color: C.red}}>Sie kostet dich Bewerber.</span>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const f = useCurrentFrame();
  const pop = spring({frame: f, fps: 30, config: {damping: 13, mass: 0.6}});
  const line = spring({frame: f - 24, fps: 30, config: {damping: 15}});
  const pulse = 1 + Math.sin(f * 0.16) * 0.04;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 60, gap: 18}}>
      <div style={{opacity: pop, transform: `translateY(${(1 - pop) * -18}px)`, fontSize: 34, fontWeight: 800, color: C.gold}}>
        👇 Team <span style={{color: C.red}}>Links</span> oder Team <span style={{color: C.teal}}>Rechts</span>?
      </div>
      <div style={{opacity: line, transform: `scale(${0.9 + line * 0.1})`, marginTop: 12}}>
        <div style={{fontSize: 27, color: C.teal, fontWeight: 800, letterSpacing: 4}}>BEEKEN WEB ENGINEERING</div>
        <div style={{fontSize: 48, color: C.ink, fontWeight: 900, lineHeight: 1.12, marginTop: 8}}>
          Eine <span style={{color: C.teal}}>Karriereseite</span>, die einstellt.
        </div>
      </div>
      <div style={{opacity: line, transform: `translateY(${(1 - line) * 20}px)`, marginTop: 22}}>
        <div style={{transform: `scale(${pulse})`, padding: '20px 40px', background: C.violet, borderRadius: 18, color: '#fff', fontSize: 34, fontWeight: 900}}>
          beekenwebengineering.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BewerberDuell = () => {
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <MusicBed />
      <AbsoluteFill style={{background: 'radial-gradient(820px 820px at 540px 520px, rgba(52,227,208,0.07), transparent 70%)'}} />
      <Sequence from={0} durationInFrames={HOOK}><HookScene /></Sequence>
      <Sequence from={HOOK} durationInFrames={DUEL}><DuelScene /></Sequence>
      <Sequence from={HOOK + DUEL} durationInFrames={REVEAL}><RevealScene /></Sequence>
      <Sequence from={HOOK + DUEL + REVEAL} durationInFrames={INSIGHT}><InsightScene /></Sequence>
      <Sequence from={HOOK + DUEL + REVEAL + INSIGHT} durationInFrames={CTA}><CtaScene /></Sequence>
    </AbsoluteFill>
  );
};
