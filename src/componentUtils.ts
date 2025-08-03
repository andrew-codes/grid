import React from "react"

const isComponentType = (value: unknown): value is React.ComponentType => {
  return (
    typeof value === "function" ||
    (typeof value === "object" &&
      value !== null &&
      "render" in value &&
      typeof (value as any).render === "function")
  )
}

export { isComponentType }
