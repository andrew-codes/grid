# Use Cypress for Component and End-to-End Tests

- Status: accepted
- Deciders: Andrew Smith
- Tags: dev-tools, tests

## Context and Problem Statement

The assessment calls for creating a specific UX. In order to verify (test) this UX, there is a need to for component level testing. There is not an application in which this UX exists, only a set of components with demo data. Additionally, there is a desire to be able to verify the UI "looks right," which calls for integrated visual regression testing.

## Decision Drivers

1. Maintain confidence that components delivered are not functionally broken
2. Maintain confidence that components are not visual broken
3. Increase throughput on feature development of components
4. Provide a harness in order to demo components and their user interactions
5. Be capable of testing React and web component based components
6. Be capable of inspecting, mocking, and waiting on browser events and network requests
7. Be capable of interacting with development protocol

## Considered Options

1. [Cypress](https://www.cypress.io/)
2. [Playwright](https://playwright.dev/)

## Decision Outcome

Chosen option: "Cypress" because it is capable of providing a test harness without the need of an application to host components. This allows the setup and all test related information to be owned by the tests themselves. Additionally, it supports both React and web components, and meets all other drivers for the decision.
