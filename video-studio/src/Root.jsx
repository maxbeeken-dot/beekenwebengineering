import {Composition} from 'remotion';
import {WebsiteGlowUp} from './comps/WebsiteGlowUp.jsx';
import {WebRedFlags} from './comps/WebRedFlags.jsx';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="WebsiteGlowUp"
        component={WebsiteGlowUp}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="WebRedFlags"
        component={WebRedFlags}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
