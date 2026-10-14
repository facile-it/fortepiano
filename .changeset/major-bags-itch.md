---
'fortepiano': patch
---

Upgrade the development toolchain.

- typescript 4.7.4 → 6.0.3
- eslint 8.18.0 → 9.39.5
- eslint-config-facile 0.5.0 → 1.2.0
- jest 26.6.3 → 30.5.2
- ts-jest 26.5.6 → 29.4.14
- @types/jest 26.0.24 → 30.0.0
- prettier 2.7.1 → 3.9.10
- @types/node 22.8.7 → 26.6.5
- fp-ts 2.12.1 → 2.16.11 (devDependency; peer stays ^2.5.0)
- io-ts 2.2.16 → 2.2.22 (devDependency; peer stays ^2.2.0)

Remove @rushstack/eslint-patch and move ESLint to the flat config.
