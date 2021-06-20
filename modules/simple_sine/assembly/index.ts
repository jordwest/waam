// The entry file of your WebAssembly module.

let t = 0.0 as f32;

const sample_rate = 44100;

const hz = 2 * Math.PI as f32;

const sample_length = 1.0 / (sample_rate as f32);

// Unused for now
export const inputBuffer = new ArrayBuffer(4096 * 4);

export const outputBuffer = new ArrayBuffer(4096 * 4);
export const outputView = new DataView(outputBuffer);

export function process(nSamples: i32): ArrayBuffer {
  for (let i = 0; i < nSamples; i++) {
    const val = Math.sin((t + ((i as f32) * sample_length)) * 440 * hz as f32) as f32;
    outputView.setFloat32(i * 4, val, true);
  }
  
  t += (nSamples as f32) * (sample_length as f32);
  
  return outputBuffer;
}
