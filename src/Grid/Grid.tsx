import styled from "@emotion/styled"
import {
  ComponentType,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react"
import { Checkbox, IndeterminateCheckbox } from "..//Checkbox/Checkbox"
import { isComponentType } from "../componentUtils"
import { initialState, reducer } from "./state"

const GridHeading = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 400;
`

const SelectionCell = styled.td`
  width: 3rem;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHead = styled.thead`
  border: 1px solid lightgray;
  border-left: none;
  border-right: none;
`

const TableHeadingCell = styled.th`
  font-size: 1.15rem;
  text-align: left;
  font-weight: 400;
  padding: 1rem;
`

const TableBody = styled.tbody`
  margin: 0.5rem 0;
`

const TableRow = styled.tr<{ selected: boolean; active?: boolean }>`
  background-color: ${(props) =>
    props.active ? "#f0f0f0" : props.selected ? "#d0e0ff" : "transparent"};
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }

  td {
    background-color: ${(props) => (props.selected ? "#d0e0ff" : "transparent")};
  }
`

const TableCell = styled.td`
  padding: 1rem;
  border-collapse: collapse;
`

const NoDataCell = styled(TableCell)`
  text-align: center;
  padding: 5rem;
  font-size: 2rem;
  color: gray;
`

const GridToolbarItem = styled.div`
  margin: 0 0.25rem;
  height: 100%;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0;

  > * {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin: 0.25rem;
  }
`

const GridToolbar = styled.div`
  height: 3.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;

  > div:first-of-type {
    margin-left: 0;
    margin-right: 4rem;
  }
`

interface CellValue {
  (row: object): string | ReactNode
}

type ColumnDefinition = {
  display: string | ReactNode | ComponentType
  cellValue: CellValue
}

type GridProps<TRow extends object> = {
  columnDefs: Array<ColumnDefinition>
  rows: Array<TRow>
  disableRowSelection?: (row: TRow) => boolean
  onSelect?: (e: SyntheticEvent | null, selectedRows: Array<number>) => void
  toolbarItems?: Array<ReactNode>
}

function Grid<TRow extends object>({
  columnDefs,
  disableRowSelection = () => false,
  onSelect,
  rows,
  toolbarItems = [],
}: GridProps<TRow>): ReactNode {
  const [state, dispatch] = useReducer(reducer, { ...initialState, totalRows: rows.length })

  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }

    onSelect?.(
      null,
      state.allSelected ? rows.map((_, index) => index) : Array.from(state.selectedRowIndices),
    )
  }, [state.selectedRowIndices, state.allSelected, rows, onSelect])

  const handleCheckboxChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.MouseEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLInputElement>,
      value: any,
    ) => {
      dispatch({ type: "TOGGLE_ROW_SELECTION", rowIndex: value })
    },
    [],
  )
  const handleCheckboxClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }, [])

  const handleRowClick = (rowIndex: number) => (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (disableRowSelection(rows[rowIndex])) {
      return
    }
    dispatch({ type: "TOGGLE_ROW_SELECTION", rowIndex })
  }
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTableElement>) => {
    e.preventDefault()
    if (e.key === "Enter" || e.key === " ") {
      dispatch({ type: "TOGGLE_ROW_SELECTION", rowIndex: -1 })
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const direction = e.key === "ArrowDown" ? "next" : "previous"
      const currentIndex = state.activeRowIndex ?? 0
      dispatch({ type: "NAVIGATE", direction, rowIndex: currentIndex })
    }
  }, [])

  const handleSelectAll = useCallback(() => {
    if (state.allSelected) {
      dispatch({ type: "DESELECT_ALL_ROWS" })
    } else {
      dispatch({ type: "SELECT_ALL_ROWS" })
    }
  }, [state.allSelected])

  return (
    <div data-test-id="Grid">
      <GridToolbar data-test-id="GridToolbar">
        {columnDefs.length > 0 && rows.length > 0 && (
          <GridToolbarItem>
            <SelectionCell as="div">
              {!state.allSelected && state.selectedRowIndices.size > 0 ? (
                <IndeterminateCheckbox
                  checked={state.selectedRowIndices.size > 0}
                  onChange={handleSelectAll}
                />
              ) : (
                <Checkbox
                  checked={state.allSelected}
                  onChange={handleSelectAll}
                  onClick={handleSelectAll}
                />
              )}
            </SelectionCell>
            <GridHeading>
              {!state.allSelected && state.selectedRowIndices.size === 0 ? (
                <>None Selected</>
              ) : (
                <>Selected {state.allSelected ? rows.length : state.selectedRowIndices.size}</>
              )}
            </GridHeading>
          </GridToolbarItem>
        )}
        {toolbarItems.map((item, index) => (
          <GridToolbarItem key={index}>{item}</GridToolbarItem>
        ))}
      </GridToolbar>
      <Table onKeyDown={handleKeyDown} tabIndex={0}>
        <TableHead>
          {columnDefs.length > 0 && (
            <tr>
              <td></td>
              {columnDefs.map((def, i) => {
                const Display = def.display
                return (
                  <TableHeadingCell key={i}>
                    {isComponentType(Display) ? <Display /> : Display}
                  </TableHeadingCell>
                )
              })}
            </tr>
          )}
        </TableHead>
        {columnDefs.length === 0 || rows.length === 0 ? (
          <TableBody>
            <tr>
              <NoDataCell colSpan={columnDefs.length + 1}>No Data to Display</NoDataCell>
            </tr>
          </TableBody>
        ) : (
          <TableBody>
            {rows.map((row, i) => {
              const isSelected =
                !disableRowSelection(row) && (state.allSelected || state.selectedRowIndices.has(i))

              return (
                <TableRow
                  key={i}
                  onClick={handleRowClick(i)}
                  selected={isSelected}
                  active={state.activeRowIndex === i}
                >
                  <SelectionCell>
                    <Checkbox
                      disabled={disableRowSelection(row)}
                      defaultChecked={isSelected}
                      onChange={handleCheckboxChange}
                      onClick={handleCheckboxClick}
                      value={i}
                    />
                  </SelectionCell>
                  {columnDefs.map(({ cellValue }, colIndex) => (
                    <TableCell key={colIndex}>{cellValue(row)}</TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        )}
      </Table>
    </div>
  )
}

export { Grid }
export type { CellValue, ColumnDefinition }
