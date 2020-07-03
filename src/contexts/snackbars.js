import React, { useState } from "react"
import { v4 } from "uuid"

const SnackbarsContext = React.createContext()

export const SnackbarsProvider = ({ children }) => {
  const [state, setState] = useState([])

  /**
   * Show new snackbar on the screen (replaces the old one)
   * @param {boolean} isSnackbar
   * @param {string} message
   * @param {string} type
   */
  const showSnackbar = (message, type, isSnackbar = false) => {
    const newSnackbar = {
      id: v4(),
      message,
      isSnackbar,
      type,
    }

    setState([newSnackbar])
    setTimeout(() => {
      setState([])
    }, 5000)
  }

  return (
    <SnackbarsContext.Provider value={{ snackbars: state, showSnackbar }}>
      {children}
    </SnackbarsContext.Provider>
  )
}

export const useSnackbars = () => React.useContext(SnackbarsContext)
