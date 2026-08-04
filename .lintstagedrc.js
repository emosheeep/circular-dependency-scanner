export default {
  '*.{js,cjs,mjs,ts}': ['oxlint --fix --deny-warnings', 'oxfmt --write'],
  '*.{json,jsonc}': 'oxfmt --write',
};
