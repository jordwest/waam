// The entry file of your WebAssembly module.

export const inputBuffer = new ArrayBuffer(4096 * 4);
export const inputView = new DataView(inputBuffer);

export const outputBuffer = new ArrayBuffer(4096 * 4);
export const outputView = new DataView(outputBuffer);

const bit_depth = 3;

export function process(nSamples: i32): ArrayBuffer {
  for (let i = 0; i < nSamples; i++) {
    const offset = i * 4;
    let val = inputView.getFloat32(offset, true);
    // val = Math.max(val, -0.7) as f32;
    // val = Math.min(val, 0.7) as f32;
    val = Math.floor(val * (bit_depth as f32)) / bit_depth as f32;
    outputView.setFloat32(i * 4, val, true)
  }

  return outputBuffer;
}
