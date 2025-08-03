import compareSnapshotCommand from "cypress-image-diff-js"
import { mount } from "cypress/react"

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      compareSnapshot: typeof compareSnapshotCommand
    }
  }
}
