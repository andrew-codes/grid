# Get Started

## Required Software

1. git
2. bash shell
3. Node@>=22.14.0

## Install Dependencies

```bash
npm install
```

## Running

```bash
# Start local dev server. http://localhost:3000
npm start

# Run component tests for development or to see interactions with components.
# > Note, there is mock e2e test that has no assertions (paused), so that you may freely interact with the end result. It is skipped by default so tests may be run to completion via CLI.
npm run test/component

# Run all component tests (sans mock e2e) and view results
npm run run test/component/ci

# Tooling to update baseline images for visual regressions or to see all baseline images in a friendly UX
npm run run test/component/update
```

## Conclusion

You are now able to run the project and [view ADRs](./adr/README.md).
