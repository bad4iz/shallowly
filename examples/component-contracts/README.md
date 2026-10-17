# Component contract tests

This standalone example uses React 19, Shallowly, Vitest, and strict TypeScript to
test a component's output, child props, and callbacks. Its custom hook is mocked;
the real child component and its hooks are never executed.

Use Node.js 20.19+ on the 20.x line, or Node.js 22.12+ and npm. From this directory:

```bash
npm install
npm test
npm run typecheck
```

The example imports `shallowly` from npm and does not require building the library
repository. Vitest runs in the Node environment; no browser, DOM shim, or React
adapter is needed.

Read the [step-by-step guide](../../docs/testing-component-contracts.md), then
inspect [ProfilePanel.test.tsx](src/ProfilePanel.test.tsx) and its adjacent source
files. The hook uses local demo data so no server or network request is needed.
