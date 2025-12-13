import { getImportSpecifiers } from './ast';
import 'zx/globals';

function mockFile(filename: string, fileContent: string): string {
  const filePath = path.resolve(
    __dirname,
    `../node_modules/.fs-cache/${filename}.ts`,
  );

  fs.ensureFileSync(filePath);
  fs.writeFileSync(filePath, fileContent);
  return filePath;
}

/**
 * This file's content is same with the test playground in ./ast.ts
 */
const mockedFilePath = mockFile(
  'ast-mocked-file',
  `
  // dynamic import
  require('./require');
  import('./dynamic-import');

  // import statement
  import './pure-import'; // ✅
  import * as a from './import * as a'; // ✅
  import*as a from './import*as a'; // ✅
  import type * as a from './import type * as a';
  import type*as a from './import type*as a';

  import a from './import a'; // ✅
  import type a from './import type a';
  import type { a } from './import type { a }';
  import { type a } from './import { type a }';
  import { a } from './import { a }'; // ✅
  import { a as b } from './import { a as b }'; // ✅
  import { type a as b } from './import { type a as b }';
  import type { a as b } from './import type { a as b }';

  import type from './import type'; // ✅
  import type type from './import type type';
  import type { type } from './import type { type }';
  import { type type } from './import { type type }';

  import { type a, b } from './import { type a, b }'; // ✅
  import { type a, type } from './import { type a, type }'; // ✅

  // export statement
  export * from './export *'; // ✅
  export*from './export*'; // ✅
  export * as a from './export * as a'; // ✅
  export*as a from './export*as a'; // ✅
  export { a } from './export { a }'; // ✅
  export { type a } from './export { type a }';
  export type { a } from './export type { a }';
  export { type a, b } from './export { type a, b }'; // ✅

  export type * from './export type *';
  export type*from './export type*';
  export type * as a from './export type * as a';
  export type*as a from './export type*as a';
  export { type } from './export { type }';
  export { type type } from './export { type type }';
  export type { type } from './export type { type }';

  // ⚠️ ast-grep's bug
  // export { type } from './export { type }'; // ✅
  // export { type a, type } from './export { type a, type }'; // ✅
  `,
);

it('total references', async () => {
  const paths = await getImportSpecifiers(mockedFilePath);
  expect(paths).toStrictEqual([
    './require',
    './dynamic-import',
    './pure-import',
    './import * as a',
    './import*as a',
    './import type * as a',
    './import type*as a',
    './import a',
    './import type a',
    './import type { a }',
    './import { type a }',
    './import { a }',
    './import { a as b }',
    './import { type a as b }',
    './import type { a as b }',
    './import type',
    './import type type',
    './import type { type }',
    './import { type type }',
    './import { type a, b }',
    './import { type a, type }',
    './export *',
    './export*',
    './export * as a',
    './export*as a',
    './export { a }',
    './export { type a }',
    './export type { a }',
    './export { type a, b }',
    './export type *',
    './export type*',
    './export type * as a',
    './export type*as a',
    './export { type }',
    './export { type type }',
    './export type { type }',
  ]);
});

it('exclude types', async () => {
  const paths = await getImportSpecifiers(mockedFilePath, true);
  expect(paths).toStrictEqual([
    './require',
    './dynamic-import',
    './pure-import',
    './import * as a',
    './import*as a',
    './import a',
    './import { a }',
    './import { a as b }',
    './import type',
    './import { type a, b }',
    './import { type a, type }',
    './export *',
    './export*',
    './export * as a',
    './export*as a',
    './export { a }',
    './export { type a, b }',
  ]);
});
