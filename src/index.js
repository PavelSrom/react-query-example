import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { SnackbarsProvider } from "./contexts/snackbars"
import AlertBox from "./AlertBox"

ReactDOM.render(
  <React.StrictMode>
    <SnackbarsProvider>
      <AlertBox />
      <App />
    </SnackbarsProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
