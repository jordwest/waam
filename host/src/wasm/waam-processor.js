let t = 0;
let sample_rate = 44100;
let sample_length = 1.0 / sample_rate;
let hz = 2 * Math.PI;
let sampleOffset = 0;

class WaamProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        
        this.port.onmessage = event => this.onMessage(event.data);
        this.wasmModule = undefined;
    }
    
    onMessage(data) {
        const importObject = {
            env: {
                abort: (a, b, c, d) => console.error('Waam module error', a, b, c, d),
            }
        };
        
        WebAssembly.instantiate(data.wasmBytes, importObject).then(module => this.wasmModule = module.instance);
    }
    
    process(inputs, outputs) {
        if (this.wasmModule != null) {
            const samples = outputs[0][0].length;
            
            const ptr = this.wasmModule.exports.process(samples);
            const memView = new DataView(this.wasmModule.exports.memory.buffer);
            
            const waveformSampleCount = sample_rate / 440;
            
            // Copy data to audio output
            for (let i = 0; i < samples; i++) {
                const val = memView.getFloat32(ptr + (i * 4), true);
                outputs[0][0][i] = val;
                // console.log(i, val);
                // outputs[0][0][i] = Math.sin((t + (i * sample_length)) * 440 * hz)
                // outputs[0][0][i] = Math.sin((sampleOffset + i) * ((Math.PI * 2) / waveformSampleCount))
                // outputs[0][0][i] = (i % 100) < 50 ? 1.0 : -1.0;
            }
            t += (samples * sample_length)
            sampleOffset += samples;
            // throw new Error('die');
        }
        
        return true;
    }
}
registerProcessor('WaamProcessor', WaamProcessor);
console.log('should be registered');