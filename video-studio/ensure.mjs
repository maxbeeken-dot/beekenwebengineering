import {ensureBrowser} from '@remotion/renderer';
console.log('Lade Remotion-Browser...');
await ensureBrowser({onBrowserDownload: () => ({onProgress: ({percent}) => { if (Math.round(percent*100)%20===0) console.log('download '+Math.round(percent*100)+'%'); }})});
console.log('✓ Browser bereit');
