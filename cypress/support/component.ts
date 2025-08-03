import { css, Global } from "@emotion/react"
import "cypress-cdp"
import compareSnapshotCommand from "cypress-image-diff-js"
import { mount } from "cypress/react"
import { createElement, Fragment } from "react"

Cypress.Commands.add("mount", (component, options) => {
  cy.CDP("Emulation.setDeviceMetricsOverride", {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2,
    mobile: false,
  })

  return mount(
    createElement(Fragment, {
      children: [
        createElement(Global, {
          key: "global-styles",
          styles: css`
            body {
              font-family:
                "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode",
                Geneva, Verdana, sans-serif;
              font-size: 16px;
            }
            * {
              box-sizing: border-box;
            }
          `,
        }),
        createElement("div", { key: "component", children: component }),
      ],
    }),
    options,
  )
})

compareSnapshotCommand()
