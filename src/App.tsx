import { useState } from "react"
import { ColumnDefinition, Grid } from "./Grid/Grid"
type DataRow = {
  name: string
  device: string
  path: string
  status: string
}

function App({ columnDefs, rows }: { columnDefs: Array<ColumnDefinition>; rows: Array<DataRow> }) {
  const [state, setItems] = useState([] as Array<number>)
  const [showFilesToDownload, setShowFilesToDownload] = useState(false)

  return (
    <>
      <Grid<DataRow>
        columnDefs={columnDefs}
        disableRowSelection={(row) => row.status !== "available"}
        rows={rows}
        onSelect={(e, selected) => {
          setItems(selected)
        }}
        toolbarItems={[
          <button
            onClick={() => {
              setShowFilesToDownload(true)
              alert(`Downloading files: ${state.map((item) => `${rows[item].name},${rows[item].path}`)}
`)
            }}
          >
            Download Files
          </button>,
        ]}
      />
      {showFilesToDownload && (
        <>
          <hr />
          File downloaded:
          <br />
          {state.map((item) => (
            <p key={item}>
              {rows[item].name}, {rows[item].path}
            </p>
          ))}
        </>
      )}
    </>
  )
}

export { App }
