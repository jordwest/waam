export class WaamNode extends AudioWorkletNode {
    loadWasm(wasmBytes: unknown) {
        console.log(wasmBytes);
        this.port.postMessage({wasmBytes})
    }
}