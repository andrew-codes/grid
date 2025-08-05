import ReactDOM from "react-dom/client"
import { App } from "./App"
import { componentMatchPropertyName, matchPropertyName } from "./Grid/CellValues"
import { Status } from "./Status"

const componentColumnRefs = [
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

const rows = [
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App columnDefs={componentColumnRefs} rows={rows} />,
)
