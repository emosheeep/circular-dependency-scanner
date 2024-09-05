import { fs } from 'zx';
import { tsx } from '@ast-grep/napi';
import { parse } from '@vue/compiler-sfc';

/**
 * Test Playground Link
 * @see https://ast-grep.github.io/playground.html#eyJtb2RlIjoiQ29uZmlnIiwibGFuZyI6InR5cGVzY3JpcHQiLCJxdWVyeSI6ImZvbygkJCRBLCBiLCAkJCRDKSIsInJld3JpdGUiOiIiLCJzdHJpY3RuZXNzIjoic21hcnQiLCJzZWxlY3RvciI6IiIsImNvbmZpZyI6InJ1bGU6XG4gIGtpbmQ6IHN0cmluZ19mcmFnbWVudFxuICBhbnk6XG4gICAgLSBpbnNpZGU6XG4gICAgICAgIGtpbmQ6IHN0cmluZ1xuICAgICAgICBpbnNpZGU6XG4gICAgICAgICAga2luZDogYXJndW1lbnRzXG4gICAgICAgICAgaW5zaWRlOlxuICAgICAgICAgICAga2luZDogY2FsbF9leHByZXNzaW9uXG4gICAgICAgICAgICBoYXM6XG4gICAgICAgICAgICAgIGZpZWxkOiBmdW5jdGlvblxuICAgICAgICAgICAgICByZWdleDogJ14oaW1wb3J0fHJlcXVpcmUpJCdcbiAgICAtIGluc2lkZTpcbiAgICAgICAgc3RvcEJ5OiBlbmRcbiAgICAgICAga2luZDogZXhwb3J0X3N0YXRlbWVudFxuICAgICAgICBmaWVsZDogc291cmNlXG4gICAgLSBpbnNpZGU6XG4gICAgICAgIGtpbmQ6IGltcG9ydF9zdGF0ZW1lbnRcbiAgICAgICAgc3RvcEJ5OiBlbmRcbiAgICAgICAgZmllbGQ6IHNvdXJjZSIsInNvdXJjZSI6Ii8vIGR5bmFtaWMgaW1wb3J0XG5yZXF1aXJlKCcuL3JlcXVpcmUnKTtcbmltcG9ydCgnLi9keW5hbWljLWltcG9ydCcpO1xuXG4vLyBpbXBvcnQgc3RhdGVtZW50XG5pbXBvcnQgJy4vcHVyZS1pbXBvcnQnOyAvLyDinIVcbmltcG9ydCAqIGFzIGEgZnJvbSAnLi9pbXBvcnQgKiBhcyBhJzsgLy8g4pyFXG5pbXBvcnQqYXMgYSBmcm9tICcuL2ltcG9ydCphcyBhJzsgLy8g4pyFXG5pbXBvcnQgdHlwZSAqIGFzIGEgZnJvbSAnLi9pbXBvcnQgdHlwZSAqIGFzIGEnO1xuaW1wb3J0IHR5cGUqYXMgYSBmcm9tICcuL2ltcG9ydCB0eXBlKmFzIGEnO1xuXG5pbXBvcnQgYSBmcm9tICcuL2ltcG9ydCBhJzsgLy8g4pyFXG5pbXBvcnQgdHlwZSBhIGZyb20gJy4vaW1wb3J0IHR5cGUgYSc7XG5pbXBvcnQgdHlwZSB7IGEgfSBmcm9tICcuL2ltcG9ydCB0eXBlIHsgYSB9JztcbmltcG9ydCB7IHR5cGUgYSB9IGZyb20gJy4vaW1wb3J0IHsgdHlwZSBhIH0nO1xuXG5pbXBvcnQgdHlwZSBmcm9tICcuL2ltcG9ydCB0eXBlJzsgLy8g4pyFXG5pbXBvcnQgdHlwZSB0eXBlIGZyb20gJy4vaW1wb3J0IHR5cGUgdHlwZSc7XG5pbXBvcnQgdHlwZSB7IHR5cGUgfSBmcm9tICcuL2ltcG9ydCB0eXBlIHsgdHlwZSB9JztcbmltcG9ydCB7IHR5cGUgdHlwZSB9IGZyb20gJy4vaW1wb3J0IHsgdHlwZSB0eXBlIH0nO1xuXG5pbXBvcnQgeyB0eXBlIGEsIGIgfSBmcm9tICcuL2ltcG9ydCB7IHR5cGUgYSwgYiB9JzsgLy8g4pyFXG5pbXBvcnQgeyB0eXBlIGEsIHR5cGUgfSBmcm9tICcuL2ltcG9ydCB7IHR5cGUgYSwgdHlwZSB9JzsgLy8g4pyFXG5cbi8vIGV4cG9ydCBzdGF0ZW1lbnRcbmV4cG9ydCAqIGZyb20gJy4vZXhwb3J0IConOyAvLyDinIVcbmV4cG9ydCpmcm9tICcuL2V4cG9ydConOyAvLyDinIVcbmV4cG9ydCAqIGFzIGEgZnJvbSAnLi9leHBvcnQgKiBhcyBhJyAvLyDinIVcbmV4cG9ydCphcyBhIGZyb20gJy4vZXhwb3J0KmFzIGEnIC8vIOKchVxuXG5leHBvcnQgdHlwZSAqIGZyb20gJy4vZXhwb3J0IHR5cGUgKic7XG5leHBvcnQgdHlwZSpmcm9tICcuL2V4cG9ydCB0eXBlKic7XG5leHBvcnQgdHlwZSAqIGFzIGEgZnJvbSAnLi9leHBvcnQgdHlwZSAqIGFzIGEnO1xuZXhwb3J0IHR5cGUqYXMgYSBmcm9tICcuL2V4cG9ydCB0eXBlKmFzIGEnO1xuXG5leHBvcnQgdHlwZSB7IGEgfSBmcm9tICcuL2V4cG9ydCB0eXBlIHsgYSB9JztcbmV4cG9ydCB7IHR5cGUgYSB9IGZyb20gJy4vZXhwb3J0IHsgdHlwZSBhIH0nO1xuZXhwb3J0IHsgdHlwZSB0eXBlIH0gZnJvbSAnLi9leHBvcnQgeyB0eXBlIHR5cGUgfSc7XG5cbmV4cG9ydCB7IHR5cGUgYSwgYiB9IGZyb20gJy4vZXhwb3J0IHsgdHlwZSBhLCBiIH0nOyAvLyDinIVcblxuLy8g4pqg77iPIGFzdC1ncmVwJ3MgYnVnXG4vLyBleHBvcnQgdHlwZSB7IHR5cGUgfSBmcm9tICcuL2V4cG9ydCB0eXBlIHsgdHlwZSB9Jztcbi8vIGV4cG9ydCB7IHR5cGUgYSwgdHlwZSB9IGZyb20gJy4vZXhwb3J0IHsgdHlwZSBhLCB0eXBlIH0nOyAvLyDinIVcbi8vIGV4cG9ydCB7IHR5cGUgfSBmcm9tICcuL2V4cG9ydCB7IHR5cGUgfSc7IC8vIOKchSJ9
 */
function getImportNodes(content: string) {
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
 * Test Playground Link
 * @see https://ast-grep.github.io/playground.html#eyJtb2RlIjoiQ29uZmlnIiwibGFuZyI6InR5cGVzY3JpcHQiLCJxdWVyeSI6ImZvbygkJCRBLCBiLCAkJCRDKSIsInJld3JpdGUiOiIiLCJzdHJpY3RuZXNzIjoic21hcnQiLCJzZWxlY3RvciI6IiIsImNvbmZpZyI6InJ1bGU6XG4gIGtpbmQ6IHN0cmluZ19mcmFnbWVudFxuICBhbnk6XG4gICAgLSBpbnNpZGU6XG4gICAgICAgIGtpbmQ6IHN0cmluZ1xuICAgICAgICBpbnNpZGU6XG4gICAgICAgICAga2luZDogYXJndW1lbnRzXG4gICAgICAgICAgaW5zaWRlOlxuICAgICAgICAgICAga2luZDogY2FsbF9leHByZXNzaW9uXG4gICAgICAgICAgICBoYXM6XG4gICAgICAgICAgICAgIGZpZWxkOiBmdW5jdGlvblxuICAgICAgICAgICAgICByZWdleDogJ14oaW1wb3J0fHJlcXVpcmUpJCdcbiAgICAtIGluc2lkZTpcbiAgICAgICAgc3RvcEJ5OiBlbmRcbiAgICAgICAga2luZDogZXhwb3J0X3N0YXRlbWVudFxuICAgICAgICBub3Q6XG4gICAgICAgICAgcmVnZXg6IFwiXmV4cG9ydFxcXFxzdHlwZVwiXG4gICAgICAgIGFueTpcbiAgICAgICAgICAtIHJlZ2V4OiBcIl5leHBvcnRcXFxccz9cXFxcKlwiXG4gICAgICAgICAgLSBoYXM6XG4gICAgICAgICAgICAgIGtpbmQ6IGV4cG9ydF9zcGVjaWZpZXJcbiAgICAgICAgICAgICAgc3RvcEJ5OiBlbmRcbiAgICAgICAgICAgICAgbm90OlxuICAgICAgICAgICAgICAgIHJlZ2V4OiBcIl50eXBlXFxcXHNcIlxuICAgIC0gaW5zaWRlOlxuICAgICAgICBraW5kOiBpbXBvcnRfc3RhdGVtZW50XG4gICAgICAgIHN0b3BCeTogZW5kXG4gICAgICAgIGFsbDpcbiAgICAgICAgICAtIG5vdDpcbiAgICAgICAgICAgICAgcmVnZXg6IFwiXmltcG9ydFxcXFxzdHlwZVwiXG4gICAgICAgICAgICAgIG5vdDpcbiAgICAgICAgICAgICAgICByZWdleDogXCJeaW1wb3J0XFxcXHN0eXBlXFxcXHNmcm9tXCJcbiAgICAgICAgICAtIGFueTpcbiAgICAgICAgICAgIC0gaGFzOlxuICAgICAgICAgICAgICAgIGtpbmQ6IHN0cmluZ1xuICAgICAgICAgICAgICAgIGZpZWxkOiBzb3VyY2VcbiAgICAgICAgICAgICAgICBudGhDaGlsZDogMVxuICAgICAgICAgICAgLSBoYXM6XG4gICAgICAgICAgICAgICAga2luZDogaW1wb3J0X3NwZWNpZmllclxuICAgICAgICAgICAgICAgIHN0b3BCeTogZW5kXG4gICAgICAgICAgICAgICAgbm90OlxuICAgICAgICAgICAgICAgICAgcmVnZXg6IFwiXnR5cGVcXFxcc1wiXG4gICAgICAgICAgICAtIGhhczpcbiAgICAgICAgICAgICAgICBzdG9wQnk6IGVuZFxuICAgICAgICAgICAgICAgIGFueTpcbiAgICAgICAgICAgICAgICAgIC0ga2luZDogaWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgLSBraW5kOiBuYW1lc3BhY2VfaW1wb3J0XG4gICAgICAgICAgICAgICAgaW5zaWRlOlxuICAgICAgICAgICAgICAgICAga2luZDogaW1wb3J0X2NsYXVzZSIsInNvdXJjZSI6Ii8vIGR5bmFtaWMgaW1wb3J0XG5yZXF1aXJlKCcuL3JlcXVpcmUnKTtcbmltcG9ydCgnLi9keW5hbWljLWltcG9ydCcpO1xuXG4vLyBpbXBvcnQgc3RhdGVtZW50XG5pbXBvcnQgJy4vcHVyZS1pbXBvcnQnOyAvLyDinIVcbmltcG9ydCAqIGFzIGEgZnJvbSAnLi9pbXBvcnQgKiBhcyBhJzsgLy8g4pyFXG5pbXBvcnQqYXMgYSBmcm9tICcuL2ltcG9ydCphcyBhJzsgLy8g4pyFXG5pbXBvcnQgdHlwZSAqIGFzIGEgZnJvbSAnLi9pbXBvcnQgdHlwZSAqIGFzIGEnO1xuaW1wb3J0IHR5cGUqYXMgYSBmcm9tICcuL2ltcG9ydCB0eXBlKmFzIGEnO1xuXG5pbXBvcnQgYSBmcm9tICcuL2ltcG9ydCBhJzsgLy8g4pyFXG5pbXBvcnQgdHlwZSBhIGZyb20gJy4vaW1wb3J0IHR5cGUgYSc7XG5pbXBvcnQgdHlwZSB7IGEgfSBmcm9tICcuL2ltcG9ydCB0eXBlIHsgYSB9JztcbmltcG9ydCB7IHR5cGUgYSB9IGZyb20gJy4vaW1wb3J0IHsgdHlwZSBhIH0nO1xuXG5pbXBvcnQgdHlwZSBmcm9tICcuL2ltcG9ydCB0eXBlJzsgLy8g4pyFXG5pbXBvcnQgdHlwZSB0eXBlIGZyb20gJy4vaW1wb3J0IHR5cGUgdHlwZSc7XG5pbXBvcnQgdHlwZSB7IHR5cGUgfSBmcm9tICcuL2ltcG9ydCB0eXBlIHsgdHlwZSB9JztcbmltcG9ydCB7IHR5cGUgdHlwZSB9IGZyb20gJy4vaW1wb3J0IHsgdHlwZSB0eXBlIH0nO1xuXG5pbXBvcnQgeyB0eXBlIGEsIGIgfSBmcm9tICcuL2ltcG9ydCB7IHR5cGUgYSwgYiB9JzsgLy8g4pyFXG5pbXBvcnQgeyB0eXBlIGEsIHR5cGUgfSBmcm9tICcuL2ltcG9ydCB7IHR5cGUgYSwgdHlwZSB9JzsgLy8g4pyFXG5cbi8vIGV4cG9ydCBzdGF0ZW1lbnRcbmV4cG9ydCAqIGZyb20gJy4vZXhwb3J0IConOyAvLyDinIVcbmV4cG9ydCpmcm9tICcuL2V4cG9ydConOyAvLyDinIVcbmV4cG9ydCAqIGFzIGEgZnJvbSAnLi9leHBvcnQgKiBhcyBhJyAvLyDinIVcbmV4cG9ydCphcyBhIGZyb20gJy4vZXhwb3J0KmFzIGEnIC8vIOKchVxuXG5leHBvcnQgdHlwZSAqIGZyb20gJy4vZXhwb3J0IHR5cGUgKic7XG5leHBvcnQgdHlwZSpmcm9tICcuL2V4cG9ydCB0eXBlKic7XG5leHBvcnQgdHlwZSAqIGFzIGEgZnJvbSAnLi9leHBvcnQgdHlwZSAqIGFzIGEnO1xuZXhwb3J0IHR5cGUqYXMgYSBmcm9tICcuL2V4cG9ydCB0eXBlKmFzIGEnO1xuXG5leHBvcnQgdHlwZSB7IGEgfSBmcm9tICcuL2V4cG9ydCB0eXBlIHsgYSB9JztcbmV4cG9ydCB7IHR5cGUgYSB9IGZyb20gJy4vZXhwb3J0IHsgdHlwZSBhIH0nO1xuZXhwb3J0IHsgdHlwZSB0eXBlIH0gZnJvbSAnLi9leHBvcnQgeyB0eXBlIHR5cGUgfSc7XG5cbmV4cG9ydCB7IHR5cGUgYSwgYiB9IGZyb20gJy4vZXhwb3J0IHsgdHlwZSBhLCBiIH0nOyAvLyDinIVcblxuLy8g4pqg77iPIGFzdC1ncmVwJ3MgYnVnXG4vLyBleHBvcnQgdHlwZSB7IHR5cGUgfSBmcm9tICcuL2V4cG9ydCB0eXBlIHsgdHlwZSB9Jztcbi8vIGV4cG9ydCB7IHR5cGUgYSwgdHlwZSB9IGZyb20gJy4vZXhwb3J0IHsgdHlwZSBhLCB0eXBlIH0nOyAvLyDinIVcbi8vIGV4cG9ydCB7IHR5cGUgfSBmcm9tICcuL2V4cG9ydCB7IHR5cGUgfSc7IC8vIOKchSJ9
 */
function getTypeExcludedImportNodes(content: string) {
  return tsx
    .parse(content)
    .root()
    .findAll({
      rule: {
        kind: 'string_fragment',
        any: [
          {
            inside: {
              kind: 'import_statement',
              stopBy: 'end',
              all: [
                {
                  not: {
                    regex: '^import\\stype',
                    not: {
                      regex: '^import\\stype\\sfrom',
                    },
                  },
                },
                {
                  any: [
                    {
                      has: {
                        kind: 'string',
                        field: 'source',
                        nthChild: 1,
                      },
                    },
                    {
                      has: {
                        kind: 'import_specifier',
                        stopBy: 'end',
                        not: { regex: '^type\\s' },
                      },
                    },
                    {
                      has: {
                        stopBy: 'end',
                        any: [
                          { kind: 'identifier' },
                          { kind: 'namespace_import' },
                        ],
                        inside: {
                          kind: 'import_clause',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            inside: {
              kind: 'export_statement',
              stopBy: 'end',
              not: {
                regex: '^export\\stype',
              },
              any: [
                { regex: '^export\\s?\\*' },
                {
                  has: {
                    kind: 'export_specifier',
                    stopBy: 'end',
                    not: {
                      regex: '^type\\s',
                    },
                  },
                },
              ],
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

function getScriptContentFromVue(filename: string) {
  const { descriptor: result } = parse(fs.readFileSync(filename, 'utf-8'));
  const { script, scriptSetup } = result;
  const scriptNode = script || scriptSetup;
  return scriptNode?.content;
}

export function getImportSpecifiers(
  filePath: string,
  excludeTypes = false,
): string[] {
  const fileContent = filePath.endsWith('.vue')
    ? (getScriptContentFromVue(filePath) ?? '')
    : fs.readFileSync(filePath, 'utf8');

  const nodes = excludeTypes
    ? getTypeExcludedImportNodes(fileContent)
    : getImportNodes(fileContent);

  return nodes.map((node) => node.text());
}
