import { parentPort, workerData, Worker, isMainThread } from 'worker_threads';
import { analyze_graph as analyzeGraphWasm } from '../wasm/bridge';

export function analyzeGraph(edges: [string, string[]][]) {
  const { resolve, reject, promise } = Promise.withResolvers<string[][]>();
  const worker = new Worker(__filename, { workerData: edges });
  worker.on('message', (message) => {
    resolve(message);
    worker.terminate();
  });
  worker.on('error', (error) => {
    reject(error);
    worker.terminate();
  });
  return promise;
}

if (!isMainThread && parentPort) {
  const result = analyzeGraphWasm(workerData);
  parentPort.postMessage(result);
}
