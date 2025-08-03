import { defineConfig } from "cypress"
import getCompareSnapshotsPlugin from "cypress-image-diff-js/plugin"

const config = defineConfig({
  component: {
    specPattern: "src/**/__component_tests__/*.test.tsx",
    video: true,
    viewportWidth: 1920,
    viewportHeight: 1080,
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "edge" && browser.isHeadless) {
          launchOptions.args.push("--window-size=1400,1200")
          launchOptions.args.push("--force-device-scale-factor=1")
        }
      })

      return getCompareSnapshotsPlugin(on, config)
    },
  },
})

export default config
