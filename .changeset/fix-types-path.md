---
'circular-dependency-scanner': patch
---

Point the `types` field at `dist/types/index.d.ts`, where `rslib` actually emits the
declarations. Consumers were getting `TS7016` and an implicit `any` for the whole module.
