// The entry file of your WebAssembly module.

let t = 0.0 as f32;
const sample_rate = 44100;

const hz = 2 * Math.PI as f32;

export const outputBuffer = new Array<f32>(4096);

export function process(nSamples: i32): i32 {
  t += (nSamples as f32) / (sample_rate as f32)
  
  for (let i = 0; i < nSamples; i++) {
    outputBuffer[i] = Math.sin(t * 440 * hz) as f32;
  }
  
  return Math.sin(t) as i32;
}
