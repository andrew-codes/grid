# Use Log4brains to manage the ADRs

- Status: accepted
- Tags: dev-tools, doc

## Context and Problem Statement

We want to record architectural decisions made in this project.
Which tool(s) should we use to manage these records?

## Considered Options

1. [Log4brains](https://github.com/thomvaill/log4brains): architecture knowledge base (command-line + static site generator)
2. [ADR Tools](https://github.com/npryce/adr-tools): command-line to create ADRs
3. [ADR Tools Python](https://bitbucket.org/tinkerer_/adr-tools-python/src/master/): command-line to create ADRs
4. [adr-viewer](https://github.com/mrwilson/adr-viewer): static site generator
5. [adr-log](https://adr.github.io/adr-log/): command-line to create a TOC of ADRs

## Decision Outcome

Chosen option: "Log4brains", because it includes the features of all the other tools, and even more.
