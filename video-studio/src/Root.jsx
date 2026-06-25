import {Composition} from 'remotion';
import {WebsiteGlowUp} from './comps/WebsiteGlowUp.jsx';
import {WebRedFlags} from './comps/WebRedFlags.jsx';
import {LadezeitSchock} from './comps/LadezeitSchock.jsx';
import {WebsiteRettung} from './comps/WebsiteRettung.jsx';
import {MobileFail} from './comps/MobileFail.jsx';

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
      <Composition
        id="LadezeitSchock"
        component={LadezeitSchock}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="WebsiteRettung"
        component={WebsiteRettung}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MobileFail"
        component={MobileFail}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
