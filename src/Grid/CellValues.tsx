import { ComponentType, PropsWithChildren } from "react"
import { CellValue } from "./Grid"

const matchPropertyName =
  (propertyName: string): CellValue =>
  (row: object) => {
    const found = Object.entries(row).find(
      ([key]) => key.toLowerCase() === propertyName.toLowerCase(),
    )

    if (!found) {
      return ""
    }

    return found[1]
  }

const componentMatchPropertyName = (
  propertyName: string,
  C: ComponentType<PropsWithChildren<{}>>,
): CellValue => {
  const getValue = matchPropertyName(propertyName)

  return (row: object) => {
    return <C>{getValue(row)}</C>
  }
}
export { componentMatchPropertyName, matchPropertyName }
