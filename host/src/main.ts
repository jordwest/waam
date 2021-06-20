import './style.css'
import { WaamNode } from './wasm/waam-node';

const app = document.querySelector<HTMLDivElement>('#app')!

import processorUrl from './wasm/waam-processor.js?url';
import sineWasm from '../../modules/simple_sine/build/optimized.wasm?url';
import distortWasm from '../../modules/distortion/build/optimized.wasm?url';

app.innerHTML = `
  <h1>Hello Vite!</h1>
  ${processorUrl}
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`

const start = async () => {
  alert('Take off headphones!');
  
  const wasmBytes = await (await fetch(sineWasm)).arrayBuffer();
  const distortWasmBytes = await (await fetch(distortWasm)).arrayBuffer();
  
  const ctx = new AudioContext({sampleRate: 44100});
  ctx.audioWorklet.addModule(processorUrl);
  
  setTimeout(() => {
    console.log('instantiating node');
    const node = new WaamNode(ctx, 'WaamProcessor');
    node.loadWasm(wasmBytes);
    
    const distortNode = new WaamNode(ctx, 'WaamProcessor');
    distortNode.loadWasm(distortWasmBytes);
    
    node.connect(distortNode);
    distortNode.connect(ctx.destination);
  }, 2000);
  
  setInterval(() => {
    console.log('time', ctx.currentTime);
  }, 1000);
}

start();