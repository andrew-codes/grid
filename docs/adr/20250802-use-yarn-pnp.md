# Use Yarn PnP

- Status: rejected
- Tags: dev-tools

## Context and Problem Statement

Yarn PnP enables zero-installs. Zero-installs completely eliminates a class of errors that occur in CI runs; specifically network time outs upon installing dependencies. This can drastically cut down CI times; both by eliminating the fetching of packages and also reducing the number of times a pipeline is re-run due to transient network failures.

## Decision Drivers <!-- optional -->

1. Reduce CI run times

## Considered Options

1. Yarn PnP
2. Yarn node-modules

## Decision Outcome

Chosen option: "Yarn node-modules", because `Cypress@^14` does not support Yarn PnP. However, the. upcoming `Cypress@15` release does support Yarn PnP. This decision should be re-evaluated once Cypress is upgraded to `^15.0.0`.

### Positive Consequences

- Improve developer productivity by removing the need to install prior to running during certain activities, e.g. changing branches

### Negative Consequences <!-- optional -->

- Modules are stored in git

## Links <!-- optional -->

- [Cypress issue](https://github.com/cypress-io/cypress/issues/22747#issuecomment-2815910310)
- [Yarn PnP](https://yarnpkg.com/features/pnp#what-are-the-advantages)
