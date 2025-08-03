import { useState } from "react"
import { Status } from "../../Status"
import { componentMatchPropertyName, matchPropertyName } from "../CellValues"
import { ColumnDefinition, Grid } from "../Grid"

type DataRow = {
  name: string
  device: string
  path: string
  status: string
}

describe("Grid", () => {
  let rows: Array<DataRow> = []
  let basicColumnDefs: Array<ColumnDefinition> = []
  let componentColumnRefs: Array<ColumnDefinition> = []

  beforeEach(() => {
    basicColumnDefs = [
      {
        display: "Name",
        cellValue: matchPropertyName("name"),
      },
      {
        display: "Device",
        cellValue: matchPropertyName("device"),
      },
      { display: "Path", cellValue: matchPropertyName("path") },
      { display: "Status", cellValue: matchPropertyName("status") },
    ]

    componentColumnRefs = [
      {
        display: "Name",
        cellValue: matchPropertyName("name"),
      },
      {
        display: "Device",
        cellValue: matchPropertyName("device"),
      },
      { display: "Path", cellValue: matchPropertyName("path") },
      {
        display: () => {
          return <Status status="Status" />
        },
        cellValue: componentMatchPropertyName("status", ({ children }) => (
          <Status status={children as string} />
        )),
      },
    ]

    rows = [
      {
        name: "smss.exe",
        device: "Mario",
        path: "\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe",
        status: "scheduled",
      },
      {
        name: "netsh.exe",
        device: "Luigi",
        path: "\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe",
        status: "available",
      },
      {
        name: "uxtheme.dll",
        device: "Peach",
        path: "\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll",
        status: "available",
      },
      {
        name: "aries.sys",
        device: "Daisy",
        path: "\\Device\\HarddiskVolume1\\Windows\\System32\\aries.sys",
        status: "scheduled",
      },
      {
        name: "cryptbase.dll",
        device: "Yoshi",
        path: "\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll",
        status: "scheduled",
      },
      {
        name: "7za.exe",
        device: "Toad",
        path: "\\Device\\HarddiskVolume1\\temp\\7za.exe",
        status: "scheduled",
      },
    ]
  })

  it(`With no column definitions.
- No columns visible.
- No rows visible.
- Visual indication of no data.`, () => {
    cy.mount(<Grid columnDefs={[]} rows={rows} />)

    cy.get("[data-test-id=Grid]").as("grid").find("thead tr").should("have.length", 0)
    cy.get("[data-test-id=Grid]").as("grid").find("tbody tr").should("have.length", 1)
    cy.get("@grid").compareSnapshot("no-column-defs")
  })

  it(`With row data.
- Table and columns exist, no rows visual indication.
- There is no Select All.`, () => {
    cy.mount(<Grid columnDefs={basicColumnDefs} rows={[]} />)

    cy.get("[data-test-id=Grid]").as("grid").contains("h2", "Selected").should("not.exist")
    cy.get("@grid").find("table th").should("have.length", basicColumnDefs.length)
    cy.get("@grid").contains("No Data to Display").should("be.visible")
    cy.get("@grid").compareSnapshot("without-row-data")
  })

  it(`With row data.
- Selected headline is visible, including a checkbox.
- A row is shown for each row item.
- Each row cell is computed according to its column definition.
- First column contains a way to select the row.`, () => {
    cy.mount(<Grid columnDefs={basicColumnDefs} rows={rows} />)

    cy.get("[data-test-id=Grid]").as("grid").contains("h2", "Selected").should("be.visible")
    cy.get("@grid").contains("h2", "Selected").parent().find("input[type=checkbox]")

    cy.get("@grid").find("tbody tr").should("have.length", rows.length)

    cy.get("@grid")
      .find("tbody tr")
      .then((rowEls) => {
        rowEls.each((rowIndex, rowEl) => {
          const $cells = Cypress.$(rowEl).find("td")
          expect($cells.length).to.equal(basicColumnDefs.length + 1)
          expect($cells.eq(0).find("input[type=checkbox").length).to.equal(1)
          expect($cells.eq(1).text()).to.contain(rows[rowIndex].name)
          expect($cells.eq(2).text()).to.contain(rows[rowIndex].device)
          expect($cells.eq(3).text()).to.contain(rows[rowIndex].path)
          expect($cells.eq(4).text()).to.contain(rows[rowIndex].status)
        })
      })

    cy.get("@grid").compareSnapshot("with-row-data")
  })

  it(`Custom cell values.
- Renders cells using the cellValue provided from the column definitions.`, () => {
    cy.mount(<Grid columnDefs={componentColumnRefs} rows={rows} />)

    cy.get("[data-test-id=Grid]").as("grid").contains("h2", "Selected").should("be.visible")
    cy.get("@grid").contains("h2", "Selected").parent().find("input[type=checkbox]")

    cy.get("@grid").find("tbody tr").should("have.length", rows.length)
    cy.get("@grid").compareSnapshot("custom-cell-renderers")
  })

  it(`Item selection.
- All items are selectable.
- Selecting an item provides a visual indication it is selected.
- Multiple items can be selected.
- Items can be selected via checkbox or via clicking row.`, () => {
    const handleSelect = cy.stub().as("handleSelect")
    cy.mount(<Grid columnDefs={componentColumnRefs} rows={rows} onSelect={handleSelect} />)

    cy.get("[data-test-id=Grid]").as("grid")
    cy.get("[data-test-id=Grid]").as("grid")
    cy.get("@grid")
      .find("tbody td")
      .parents("tr")
      .find("td")
      .eq(0)
      .find("input[type=checkbox]")
      .then(($els) => {
        $els.each((i, el) => {
          expect((el as HTMLInputElement).disabled).to.equal(false)
        })
      })

    cy.get("@grid").find("tbody tr").eq(0).find('input[type="checkbox"]').click()
    cy.get("@handleSelect").should(
      "have.been.calledWithMatch",
      null,
      Cypress.sinon.match.array.deepEquals([0]),
    )
    cy.get("@grid").compareSnapshot("item-selection-single")
    cy.get("@grid").find("tbody tr").eq(1).find('input[type="checkbox"]').click()
    cy.get("@handleSelect").should(
      "have.been.calledWithMatch",
      null,
      Cypress.sinon.match.array.deepEquals([0, 1]),
    )
    cy.get("@grid").find("tbody tr").eq(3).find('input[type="checkbox"]').click()
    cy.get("@handleSelect").should(
      "have.been.calledWithMatch",
      null,
      Cypress.sinon.match.array.deepEquals([0, 1, 3]),
    )

    cy.get("@grid").contains("h2", "Selected").contains("3")
    cy.get("@grid").compareSnapshot("item-selection-multiple")
  })

  it(`Disabling item selection.
- Item selection can be disabled.`, () => {
    const handleSelect = cy.stub().as("handleSelect")
    cy.mount(
      <Grid<DataRow>
        columnDefs={componentColumnRefs}
        disableRowSelection={(row) => row.status !== "available"}
        onSelect={handleSelect}
        rows={rows}
      />,
    )

    cy.get("[data-test-id=Grid]").as("grid")
    cy.get("@grid")
      .find("tbody td")
      .parents("tr")
      .find("td")
      .eq(0)
      .find("input[type=checkbox]")
      .then(($els) => {
        $els.each((i, el) => {
          expect((el as HTMLInputElement).disabled).to.equal(rows[i].status !== "available")
        })
      })

    cy.get("@grid").find("tbody tr").eq(3).click()
    cy.get("@handleSelect").should("not.have.been.called")
    cy.get("@grid").compareSnapshot("disabled-item-selection")
  })

  it(`Selecting Select All.
- Select All checkbox is visible.
- Selecting Select All selects all items.
- Selecting Select All provides a visual indication all items are selected.
- Selecting Select All calls onSelect with all items selected.`, () => {
    const handleSelect = cy.stub().as("handleSelect")
    cy.mount(<Grid<DataRow> columnDefs={componentColumnRefs} rows={rows} onSelect={handleSelect} />)

    cy.get("[data-test-id=Grid]").as("grid")
    cy.get("@grid").find("h2").contains("h2", "Selected").should("be.visible")
    cy.get("@grid")
      .contains("h2", "Selected")
      .parent()
      .find("div input[type=checkbox]")
      .as("selectAll")

    cy.get("@selectAll").click()
    cy.get("@handleSelect").should(
      "have.been.calledWithMatch",
      null,
      Cypress.sinon.match.array.deepEquals([0, 1, 2, 3, 4, 5]),
    )
    cy.get("@grid").contains("h2", "Selected").contains(rows.length)
    cy.get("@grid").compareSnapshot("select-all-selection")
  })

  it(`Selecting all items.
- Select All is checked when all items are selected.
- Select All is unchecked when not all items are selected.`, () => {
    const handleSelect = cy.stub().as("handleSelect")
    cy.mount(<Grid<DataRow> columnDefs={componentColumnRefs} rows={rows} onSelect={handleSelect} />)

    cy.get("[data-test-id=Grid]").as("grid")
    cy.get("@grid")
      .contains("h2", "Selected")
      .parent()
      .find("div input[type=checkbox]")
      .as("selectAll")

    cy.get("@grid").find("tbody tr").eq(0).find('input[type="checkbox"]').click()
    cy.get("@grid").find("tbody tr").eq(1).find('input[type="checkbox"]').click()
    cy.get("@grid").find("tbody tr").eq(3).find('input[type="checkbox"]').click()
    cy.get("@grid").find("tbody tr").eq(4).find('input[type="checkbox"]').click()
    cy.get("@grid").find("tbody tr").eq(5).find('input[type="checkbox"]').click()

    cy.get("@selectAll").should("be.checked")
  })

  it(`Select All partial selection.
- Select All is indeterminate when some items are selected, but not all.
- Indeterminate state is visually indicated.
- Select All selection in an indeterminate state will select all.`, () => {
    const handleSelect = cy.stub().as("handleSelect")
    cy.mount(<Grid<DataRow> columnDefs={componentColumnRefs} rows={rows} onSelect={handleSelect} />)

    cy.get("[data-test-id=Grid]").as("grid")
    cy.get("@grid")
      .contains("h2", "Selected")
      .parent()
      .find("div input[type=checkbox]")
      .as("selectAll")

    cy.get("@grid").find("tbody tr").eq(0).find('input[type="checkbox"]').click()
    cy.get("@grid").compareSnapshot("select-all-indeterminate")

    cy.get("@selectAll").click()
    cy.get("@handleSelect").should(
      "have.been.calledWithMatch",
      null,
      Cypress.sinon.match.array.deepEquals([0, 1, 2, 3, 4, 5]),
    )
    cy.get("@grid").compareSnapshot("select-all-selection-from-indeterminate")
  })

  it(`Select All deselection.
- Select All deselection unchecks all items.
- Selecting Select All calls onSelect with no items (empty array).`, () => {
    const handleSelect = cy.stub().as("handleSelect")
    cy.mount(<Grid<DataRow> columnDefs={componentColumnRefs} rows={rows} onSelect={handleSelect} />)

    cy.get("[data-test-id=Grid]").as("grid")
    cy.get("@grid")
      .contains("h2", "Selected")
      .parent()
      .find("div input[type=checkbox]")
      .as("selectAll")

    cy.get("@grid").find("tbody tr").eq(0).find('input[type="checkbox"]').click()
    cy.get("@grid").find("tbody tr").eq(1).find('input[type="checkbox"]').click()
    cy.get("@grid").find("tbody tr").eq(3).find('input[type="checkbox"]').click()
    cy.get("@selectAll").click()
    cy.get("@selectAll").click()
    cy.get("@selectAll").should("not.be.checked")
    cy.get("@handleSelect").should(
      "have.been.calledWithMatch",
      null,
      Cypress.sinon.match.array.deepEquals([]),
    )
    cy.get("@grid").contains("h2", "None Selected")
    cy.get("@grid").compareSnapshot("select-all-deselection")
  })

  it(`Toolbar Items.
- Toolbar items are rendered in the toolbar.
- Toolbar items are rendered in the order they are provided.
- Toolbar items are styled to fit within constraints of toolbar.`, () => {
    const handleSelect = cy.stub().as("handleSelect")
    cy.mount(
      <Grid<DataRow>
        columnDefs={componentColumnRefs}
        rows={rows}
        onSelect={handleSelect}
        toolbarItems={[<button>Download Files</button>, <button>Upload Files</button>]}
      />,
    )

    cy.get("[data-test-id=Grid]").as("grid")
    cy.get("@grid").find("[data-test-id=GridToolbar]").contains("button", "Download Files")
    cy.get("@grid").find("[data-test-id=GridToolbar]").contains("button", "Upload Files")
    cy.get("@grid").compareSnapshot("toolbar-items")
  })

  it(`Demo toolbar items with selected items.`, () => {
    cy.mount(<TestAppState columnDefs={componentColumnRefs} rows={rows} />)

    cy.get("[data-test-id=Grid]").as("grid")
    cy.get("@grid").find("tbody tr").eq(0).find('input[type="checkbox"]').click()
    cy.get("@grid").find("tbody tr").eq(1).find('input[type="checkbox"]').click()
    cy.get("@grid").find("tbody tr").eq(3).find('input[type="checkbox"]').click()
    cy.get("@grid").contains("button", "Download Files").click()
  })
})

function TestAppState({
  columnDefs,
  rows,
}: {
  columnDefs: Array<ColumnDefinition>
  rows: Array<DataRow>
}) {
  const [state, setItems] = useState([] as Array<number>)
  const [showFilesToDownload, setShowFilesToDownload] = useState(false)

  return (
    <>
      <Grid<DataRow>
        columnDefs={columnDefs}
        rows={rows}
        onSelect={(e, selected) => {
          setItems(selected)
        }}
        toolbarItems={[
          <button onClick={() => setShowFilesToDownload(true)}>Download Files</button>,
          <button>Upload Files</button>,
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
