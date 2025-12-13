import {
  isMainThread,
  parentPort,
  Worker,
  workerData,
} from 'node:worker_threads';
import { analyze_graph as analyzeGraphWasm } from '../wasm/bridge';

export type Edge = [string, string[]];

export function analyzeGraph(edges: Edge[]) {
  return new Promise<string[][]>((resolve, reject) => {
    const worker = new Worker(__filename, { workerData: edges });
    worker.on('message', (message) => {
      resolve(message);
      worker.terminate();
    });
    worker.on('error', (error) => {
      reject(error);
      worker.terminate();
    });
  });
}

if (!isMainThread && parentPort) {
  const result = analyzeGraphWasm(workerData);
  parentPort.postMessage(result);
}
