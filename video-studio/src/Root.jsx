import {Composition} from 'remotion';
import {WebsiteGlowUp} from './comps/WebsiteGlowUp.jsx';

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
    </>
  );
};
