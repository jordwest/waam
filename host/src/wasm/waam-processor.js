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
            const memView = new DataView(this.wasmModule.exports.memory.buffer);
            const inputPtr = this.wasmModule.exports.inputBuffer;
            
            // Copy inputs to audio input
            if (inputs.length > 0 && inputs[0].length > 0) {
                for (let i = 0; i < samples; i++) {
                    const val = inputs[0][0][i];
                    memView.setFloat32(inputPtr + (i * 4), val, true);
                }
            }
            
            const ptr = this.wasmModule.exports.process(samples);
            
            // Copy data to audio output
            for (let i = 0; i < samples; i++) {
                const val = memView.getFloat32(ptr + (i * 4), true);
                outputs[0][0][i] = val;
                // console.log(i, val);
                // outputs[0][0][i] = Math.sin((t + (i * sample_length)) * 440 * hz)
                // outputs[0][0][i] = Math.sin((sampleOffset + i) * ((Math.PI * 2) / waveformSampleCount))
                // outputs[0][0][i] = (i % 100) < 50 ? 1.0 : -1.0;
            }
            // throw new Error('die');
        }
        
        return true;
    }
}
registerProcessor('WaamProcessor', WaamProcessor);
console.log('should be registered');