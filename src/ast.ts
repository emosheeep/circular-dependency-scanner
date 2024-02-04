import { fs } from 'zx';
import { tsx } from '@ast-grep/napi';
import sfc from '@vue/compiler-sfc';

function getScriptContentFromVue(filename: string) {
  const { descriptor: result } = sfc.parse(fs.readFileSync(filename, 'utf-8'));
  const { script, scriptSetup } = result;
  const scriptNode = script || scriptSetup;
  return scriptNode?.content;
}

/**
 * Get import/require source from ts ast
 * @example
 * ```
 * import test from './test'; // got './test'
 * export * from './test'; // got './test'
 * import './test'; // got './test'
 * import('./test'); // got './test'
 * require('./test'); // got './test'
 * ```
 */
export function getImportNodes(content: string) {
  const sgNode = tsx.parse(content).root();
  return sgNode.findAll({
    rule: {
      kind: 'string_fragment',
      any: [
        {
          inside: {
            stopBy: 'end',
            kind: 'import_statement',
            field: 'source',
          },
        },
        {
          inside: {
            stopBy: 'end',
            kind: 'export_statement',
            field: 'source',
          },
        },
        {
          inside: {
            kind: 'string',
            inside: {
              kind: 'arguments',
              inside: {
                kind: 'call_expression',
                has: {
                  field: 'function',
                  regex: '^(import|require)$',
                },
              },
            },
          },
        },
      ],
    },
  });
}

/**
 * @param file - absolute file path
 * @param visitor - ast visitor
 */
export function getImportSpecifiers(filePath: string): string[] {
  const fileContent = filePath.endsWith('.vue')
    ? getScriptContentFromVue(filePath) ?? ''
    : fs.readFileSync(filePath, 'utf8');

  return getImportNodes(fileContent).map((node) => node.text());
}
