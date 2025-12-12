import { createRequire } from 'module';
// import { analyzeGraph } from 'graph-cycles';
// import { analyzeGraph as nodeAnalyzeGraph } from './dist/index.js';
import { analyze_graph as wasmAnalyzeGraph } from '../wasm/bridge.js';

const require = createRequire(import.meta.url);

async function run(name, fn) {
  const time = Date.now();
  const result = await fn(require('./medium-graph.json'));
  // console.log('Graph analysis result:', result);
  console.log(`${name} analyze time: ${(Date.now() - time) / 1000} seconds`);
  return result;
}

// const nodeResult = await run('node', nodeAnalyzeGraph);
const wasmResult = await run('wasm', wasmAnalyzeGraph);
console.log(wasmResult.length);
// const jsResult = await run('js', analyzeGraph);
