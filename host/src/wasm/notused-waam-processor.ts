// AudioWorkletProcessor type definition is missing #28308
// https://github.com/microsoft/TypeScript/issues/28308
interface AudioWorkletProcessor {
    readonly port: MessagePort;
    process(
        inputs: Float32Array[][],
        outputs: Float32Array[][],
        parameters: Record<string, Float32Array>
    ): boolean;
}

declare var AudioWorkletProcessor: {
    prototype: AudioWorkletProcessor;
    new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare function registerProcessor(
    name: string,
    processorCtor: (new (
        options?: AudioWorkletNodeOptions
    ) => AudioWorkletProcessor) & {
        parameterDescriptors?: AudioParamDescriptor[];
    }
);

type PointerAddr = number & { __pointerAddr: never };

type WaamInterface = {
    process(number): PointerAddr;
}

class WaamProcessor extends AudioWorkletProcessor {
    private wasmModule: WebAssembly.Instance | undefined;
    
    constructor() {
        super();
        
        this.port.onmessage = event => this.onMessage(event.data);
    }
    
    onMessage(data) {
        WebAssembly.instantiate(data.wasmData).then(module => this.wasmModule = module.instance);
    }
    
    process(inputs, outputs) {
        if (this.wasmModule != null) {
            (this.wasmModule.exports as WaamInterface).process(2048);
        }
        
        return true;
    }
}
registerProcessor('WaamProcessor', WaamProcessor);