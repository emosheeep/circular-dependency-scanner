import type { TsConfigResult } from 'get-tsconfig';
import type { Edge } from './worker';
import { createPathsMatcher, getTsconfig } from 'get-tsconfig';
import { Listr, PRESET_TIMER } from 'listr2';
import { minimatch } from 'minimatch';
import { chalk, globby, path } from 'zx';
import { getImportSpecifiers } from './ast';
import { logger } from './logger';
import { extensions, revertExtension } from './utils';
import { analyzeGraph } from './worker';

export interface DetectOptions {
  /**
   * Base path to execute command.
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * Whether to use absolute path.
   * @default false
   */
  absolute?: boolean;
  /**
   * Glob patterns to exclude from matches.
   * @default node_modules/.git/dist
   */
  ignore?: string[];
  /**
   * Glob pattern to filter output circles.
   * @default ['node_modules']
   */
  filter?: string;
  /**
   * Exclude pure type-references when calculating circles.
   * @default false
   */
  excludeTypes?: boolean;
}

interface TaskCtx {
  files: string[];
  entries: Edge[];
  result: string[][];
}

/**
 * Detect circles among dependencies.
 */
export async function circularDepsDetect(
  options?: DetectOptions,
): Promise<string[][]> {
  let {
    cwd = process.cwd(),
    ignore = [],
    absolute = false,
    filter,
    excludeTypes = false,
  } = options || ({} as DetectOptions);

  /* ----------- Parameters pre-handle start ----------- */

  cwd = path.resolve(cwd);
  ignore = [...new Set([...ignore, '**/{.git,node_modules,dist}/**'])];

  /* ------------ Parameters pre-handle end ------------ */

  const globPattern = `**/*.{${extensions.join(',')}}`;

  logger.info(
    `Working directory is ${chalk.underline.cyan(cwd)}`,
  );
  logger.info(`Ignored paths: ${ignore.map((v) => chalk.yellow(v)).join(',')}`);

  const tsconfig = [
    'tsconfig.json',
    'jsconfig.json',
  ].reduceRight<TsConfigResult | null>(
    (config, filename) => config ?? getTsconfig(cwd, filename),
    null,
  );

  if (tsconfig?.config.compilerOptions?.paths) {
    logger.info(`Config file detected: ${chalk.cyan(tsconfig.path)}`);
  }

  const runner = new Listr<TaskCtx>(
    [
      {
        title: `Globbing files with ${chalk.underline.cyan(globPattern)}`,
        task: async (_, task) =>
          task.newListr([
            {
              title: 'Wait a moment...',
              task: async (ctx, task) => {
                const files = await globby(globPattern, {
                  absolute: true,
                  gitignore: true,
                  cwd,
                  ignore,
                });
                task.title = `${chalk.cyan(files.length)} files were detected.`;
                ctx.files = files;
              },
            },
          ]),
      },
      {
        title: 'Pulling out import specifiers from files...',
        rendererOptions: { outputBar: 1 },
        task: async ({ files, entries }, task) => {
          const pathMatcher = tsconfig && createPathsMatcher(tsconfig);

          const getRealPathOfSpecifier = (
            filename: string,
            specifier: string,
          ) =>
            revertExtension(
              specifier.startsWith('.')
                ? path.resolve(path.posix.dirname(filename), specifier)
                : (pathMatcher?.(specifier)[0] ?? specifier),
            );

          for (const [i, filename] of files.entries()) {
            task.output = `${i + 1}/${files.length} - ${filename}`;

            const relFileName = path.relative(cwd, filename);
            const deps: string[] = [];

            for (const value of await getImportSpecifiers(filename, excludeTypes)) {
              const resolvedPath = getRealPathOfSpecifier(filename, value);
              resolvedPath && deps.push(resolvedPath);
            }

            entries.push(
              absolute
                ? [filename, deps]
                : [relFileName, deps.map((v) => path.relative(cwd, v))],
            );
          }
        },
      },
      {
        title: 'Analyzing circular dependencies...',
        task: async (_, task) =>
          task.newListr([
            {
              title: 'Wait a moment...',
              task: async (ctx, task) => {
                let result = await analyzeGraph(ctx.entries);

                if (filter) {
                  const matcher = minimatch.filter(filter);
                  result = result.filter((v) => v.some(matcher));
                }

                task.title = `${chalk.cyan(result.length)} circles were found${
                  filter ? `, filtered with ${chalk.yellow(filter)}` : ''
                }.`;

                ctx.result = result;
              },
            },
          ]),
      },
    ],
    {
      ctx: { entries: [], result: [], files: [] },
      rendererOptions: {
        collapseSubtasks: false,
        timer: PRESET_TIMER,
      },
    },
  );

  const { result } = await runner.run();
  return result;
}
