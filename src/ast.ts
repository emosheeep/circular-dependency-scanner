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
 * @see https://ast-grep.github.io/playground.html#eyJtb2RlIjoiQ29uZmlnIiwibGFuZyI6InR5cGVzY3JpcHQiLCJxdWVyeSI6InJlcXVpcmUoJCQkQSkiLCJyZXdyaXRlIjoiIiwic3RyaWN0bmVzcyI6InNtYXJ0Iiwic2VsZWN0b3IiOiIiLCJjb25maWciOiJ1dGlsczpcbiAgaXMtbm90LWZvbGxvd3MtdHlwZTpcbiAgICBmb2xsb3dzOlxuICAgICAgcGF0dGVybjogJCRVTk5BTUVEXG4gICAgICBub3Q6XG4gICAgICAgIHJlZ2V4OiB0eXBlXG5ydWxlOlxuICBraW5kOiBzdHJpbmdfZnJhZ21lbnRcbiAgYW55OlxuICAgIC0gaW5zaWRlOlxuICAgICAgICBraW5kOiBzdHJpbmdcbiAgICAgICAgaW5zaWRlOlxuICAgICAgICAgIGtpbmQ6IGFyZ3VtZW50c1xuICAgICAgICAgIGluc2lkZTpcbiAgICAgICAgICAgIGtpbmQ6IGNhbGxfZXhwcmVzc2lvblxuICAgICAgICAgICAgaGFzOlxuICAgICAgICAgICAgICBmaWVsZDogZnVuY3Rpb25cbiAgICAgICAgICAgICAgcmVnZXg6ICdeKGltcG9ydHxyZXF1aXJlKSQnXG4gICAgLSBpbnNpZGU6XG4gICAgICAgIHN0b3BCeTogZW5kXG4gICAgICAgIGtpbmQ6IGV4cG9ydF9zdGF0ZW1lbnRcbiAgICAgICAgYW55OlxuICAgICAgICAgIC0gaGFzOlxuICAgICAgICAgICAgICBraW5kOiBzdHJpbmdcbiAgICAgICAgICAgICAgZmllbGQ6IHNvdXJjZVxuICAgICAgICAgICAgICBudGhDaGlsZDogMVxuICAgICAgICAgIC0gaGFzOlxuICAgICAgICAgICAgICBtYXRjaGVzOiBpcy1ub3QtZm9sbG93cy10eXBlXG4gICAgICAgICAgICAgIGFueTpcbiAgICAgICAgICAgICAgICAtIGtpbmQ6IG5hbWVzcGFjZV9leHBvcnRcbiAgICAgICAgICAgICAgICAtIGtpbmQ6IGV4cG9ydF9jbGF1c2VcbiAgICAgICAgICAgICAgICAgIGhhczpcbiAgICAgICAgICAgICAgICAgICAga2luZDogZXhwb3J0X3NwZWNpZmllclxuICAgICAgICAgICAgICAgICAgICBzdG9wQnk6IGVuZFxuICAgICAgICAgICAgICAgICAgICBub3Q6XG4gICAgICAgICAgICAgICAgICAgICAgcmVnZXg6IFwiXnR5cGVcXFxcc1wiXG4gICAgLSBpbnNpZGU6XG4gICAgICAgIGtpbmQ6IGltcG9ydF9zdGF0ZW1lbnRcbiAgICAgICAgc3RvcEJ5OiBlbmRcbiAgICAgICAgYW55OlxuICAgICAgICAgIC0gaGFzOlxuICAgICAgICAgICAgICBraW5kOiBzdHJpbmdcbiAgICAgICAgICAgICAgZmllbGQ6IHNvdXJjZVxuICAgICAgICAgICAgICBudGhDaGlsZDogMVxuICAgICAgICAgIC0gaGFzOlxuICAgICAgICAgICAgICBraW5kOiBpbXBvcnRfY2xhdXNlXG4gICAgICAgICAgICAgIG1hdGNoZXM6IGlzLW5vdC1mb2xsb3dzLXR5cGVcbiAgICAgICAgICAgICAgYW55OlxuICAgICAgICAgICAgICAgIC0gaGFzOlxuICAgICAgICAgICAgICAgICAgICBzdG9wQnk6IG5laWdoYm9yXG4gICAgICAgICAgICAgICAgICAgIGFueTpcbiAgICAgICAgICAgICAgICAgICAgICAtIGtpbmQ6IGlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAtIGtpbmQ6IG5hbWVzcGFjZV9pbXBvcnRcbiAgICAgICAgICAgICAgICAtIGhhczpcbiAgICAgICAgICAgICAgICAgICAgc3RvcEJ5OiBlbmRcbiAgICAgICAgICAgICAgICAgICAga2luZDogaW1wb3J0X3NwZWNpZmllclxuICAgICAgICAgICAgICAgICAgICBub3Q6XG4gICAgICAgICAgICAgICAgICAgICAgcmVnZXg6IFwiXnR5cGVcXFxcc1wiIiwic291cmNlIjoiLy8gZHluYW1pYyBpbXBvcnRcbnJlcXVpcmUoJy4vcmVxdWlyZScpO1xuaW1wb3J0KCcuL2R5bmFtaWMtaW1wb3J0Jyk7XG5cbi8vIGltcG9ydCBzdGF0ZW1lbnRcbmltcG9ydCAnLi9wdXJlLWltcG9ydCc7IC8vIOKchVxuaW1wb3J0ICogYXMgYSBmcm9tICcuL2ltcG9ydCAqIGFzIGEnOyAvLyDinIVcbmltcG9ydCphcyBhIGZyb20gJy4vaW1wb3J0KmFzIGEnOyAvLyDinIVcbmltcG9ydCB0eXBlICogYXMgYSBmcm9tICcuL2ltcG9ydCB0eXBlICogYXMgYSc7XG5pbXBvcnQgdHlwZSphcyBhIGZyb20gJy4vaW1wb3J0IHR5cGUqYXMgYSc7XG5cbmltcG9ydCBhIGZyb20gJy4vaW1wb3J0IGEnOyAvLyDinIVcbmltcG9ydCB0eXBlIGEgZnJvbSAnLi9pbXBvcnQgdHlwZSBhJztcbmltcG9ydCB0eXBlIHsgYSB9IGZyb20gJy4vaW1wb3J0IHR5cGUgeyBhIH0nO1xuaW1wb3J0IHsgdHlwZSBhIH0gZnJvbSAnLi9pbXBvcnQgeyB0eXBlIGEgfSc7XG5pbXBvcnQgeyBhIH0gZnJvbSAnLi9pbXBvcnQgeyBhIH0nOyAvLyDinIVcbmltcG9ydCB7IGEgYXMgYiB9IGZyb20gJy4vaW1wb3J0IHsgYSBhcyBiIH0nOyAvLyDinIVcbmltcG9ydCB7IHR5cGUgYSBhcyBiIH0gZnJvbSAnLi9pbXBvcnQgeyB0eXBlIGEgYXMgYiB9JztcbmltcG9ydCB0eXBlIHsgYSBhcyBiIH0gZnJvbSAnLi9pbXBvcnQgdHlwZSB7IGEgYXMgYiB9JztcblxuaW1wb3J0IHR5cGUgZnJvbSAnLi9pbXBvcnQgdHlwZSc7IC8vIOKchVxuaW1wb3J0IHR5cGUgdHlwZSBmcm9tICcuL2ltcG9ydCB0eXBlIHR5cGUnO1xuaW1wb3J0IHR5cGUgeyB0eXBlIH0gZnJvbSAnLi9pbXBvcnQgdHlwZSB7IHR5cGUgfSc7XG5pbXBvcnQgeyB0eXBlIHR5cGUgfSBmcm9tICcuL2ltcG9ydCB7IHR5cGUgdHlwZSB9JztcblxuaW1wb3J0IHsgdHlwZSBhLCBiIH0gZnJvbSAnLi9pbXBvcnQgeyB0eXBlIGEsIGIgfSc7IC8vIOKchVxuaW1wb3J0IHsgdHlwZSBhLCB0eXBlIH0gZnJvbSAnLi9pbXBvcnQgeyB0eXBlIGEsIHR5cGUgfSc7IC8vIOKchVxuXG4vLyBleHBvcnQgc3RhdGVtZW50XG5leHBvcnQgKiBmcm9tICcuL2V4cG9ydCAqJzsgLy8g4pyFXG5leHBvcnQqZnJvbSAnLi9leHBvcnQqJzsgLy8g4pyFXG5leHBvcnQgKiBhcyBhIGZyb20gJy4vZXhwb3J0ICogYXMgYSc7IC8vIOKchVxuZXhwb3J0KmFzIGEgZnJvbSAnLi9leHBvcnQqYXMgYSc7IC8vIOKchVxuZXhwb3J0IHsgYSB9IGZyb20gJy4vZXhwb3J0IHsgYSB9JzsgLy8g4pyFXG5leHBvcnQgeyB0eXBlIGEgfSBmcm9tICcuL2V4cG9ydCB7IHR5cGUgYSB9JztcbmV4cG9ydCB0eXBlIHsgYSB9IGZyb20gJy4vZXhwb3J0IHR5cGUgeyBhIH0nO1xuZXhwb3J0IHsgdHlwZSBhLCBiIH0gZnJvbSAnLi9leHBvcnQgeyB0eXBlIGEsIGIgfSc7IC8vIOKchVxuXG5leHBvcnQgdHlwZSAqIGZyb20gJy4vZXhwb3J0IHR5cGUgKic7XG5leHBvcnQgdHlwZSpmcm9tICcuL2V4cG9ydCB0eXBlKic7XG5leHBvcnQgdHlwZSAqIGFzIGEgZnJvbSAnLi9leHBvcnQgdHlwZSAqIGFzIGEnO1xuZXhwb3J0IHR5cGUqYXMgYSBmcm9tICcuL2V4cG9ydCB0eXBlKmFzIGEnO1xuZXhwb3J0IHsgdHlwZSB9IGZyb20gJy4vZXhwb3J0IHsgdHlwZSB9JztcbmV4cG9ydCB7IHR5cGUgdHlwZSB9IGZyb20gJy4vZXhwb3J0IHsgdHlwZSB0eXBlIH0nO1xuZXhwb3J0IHR5cGUgeyB0eXBlIH0gZnJvbSAnLi9leHBvcnQgdHlwZSB7IHR5cGUgfSc7XG5cbi8vIOKaoO+4jyBhc3QtZ3JlcCdzIGJ1Z1xuLy8gZXhwb3J0IHsgdHlwZSB9IGZyb20gJy4vZXhwb3J0IHsgdHlwZSB9JzsgLy8g4pyFXG4vLyBleHBvcnQgeyB0eXBlIGEsIHR5cGUgfSBmcm9tICcuL2V4cG9ydCB7IHR5cGUgYSwgdHlwZSB9JzsgLy8g4pyFXG4ifQ==
 */
function getTypeExcludedImportNodes(content: string) {
  return tsx
    .parse(content)
    .root()
    .findAll({
      utils: {
        'is-not-follows-type': {
          follows: {
            pattern: '$$UNNAMED',
            not: {
              regex: 'type',
            },
          },
        },
      },
      rule: {
        kind: 'string_fragment',
        any: [
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
          {
            inside: {
              stopBy: 'end',
              kind: 'export_statement',
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
                    matches: 'is-not-follows-type',
                    any: [
                      { kind: 'namespace_export' },
                      {
                        kind: 'export_clause',
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
              ],
            },
          },
          {
            inside: {
              kind: 'import_statement',
              stopBy: 'end',
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
                    kind: 'import_clause',
                    matches: 'is-not-follows-type',
                    any: [
                      {
                        has: {
                          stopBy: 'neighbor',
                          any: [
                            { kind: 'identifier' },
                            { kind: 'namespace_import' },
                          ],
                        },
                      },
                      {
                        has: {
                          stopBy: 'end',
                          kind: 'import_specifier',
                          not: {
                            regex: '^type\\s',
                          },
                        },
                      },
                    ],
                  },
                },
              ],
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
