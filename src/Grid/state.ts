type State = {
  selectedRowIndices: Set<number>
  allSelected: boolean
  activeRowIndex?: number
  totalRows: number
}

const initialState = {
  selectedRowIndices: new Set<number>(),
  allSelected: false,
  activeRowIndex: undefined,
  totalRows: 0,
}

type ToggleRowSelectionAction = {
  type: "TOGGLE_ROW_SELECTION"
  rowIndex: number
}
type SelectAllRowsAction = {
  type: "SELECT_ALL_ROWS"
}
type DeselectAllRowsAction = {
  type: "DESELECT_ALL_ROWS"
}
type NavigateAction = {
  type: "NAVIGATE"
  direction: "next" | "previous"
  rowIndex: number
}
type Action =
  | ToggleRowSelectionAction
  | SelectAllRowsAction
  | DeselectAllRowsAction
  | NavigateAction

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "TOGGLE_ROW_SELECTION":
      const newSelectedRowIndices = new Set(state.selectedRowIndices)
      if (newSelectedRowIndices.has(action.rowIndex)) {
        newSelectedRowIndices.delete(action.rowIndex)
      } else {
        newSelectedRowIndices.add(action.rowIndex)
      }
      return {
        ...state,
        selectedRowIndices: newSelectedRowIndices,
        allSelected: newSelectedRowIndices.size === state.totalRows,
      }
    case "SELECT_ALL_ROWS":
      return {
        ...state,
        allSelected: true,
      }
    case "DESELECT_ALL_ROWS":
      return { ...state, selectedRowIndices: new Set<number>(), allSelected: false }

    case "NAVIGATE":
      const newActiveRowIndex =
        action.direction === "next"
          ? Math.min(state.selectedRowIndices.size - 1, action.rowIndex + 1)
          : Math.max(0, action.rowIndex - 1)
      return {
        ...state,
        activeRowIndex: newActiveRowIndex,
      }
    default:
      return state
  }
}

export {
  Action,
  DeselectAllRowsAction,
  initialState,
  reducer,
  SelectAllRowsAction,
  State,
  ToggleRowSelectionAction,
}
