import {useContext} from 'react'
import snackbarContext, {snackbarDefaults,SnackbarOptions} from './PageSnackbarContext'

export default function useSnackbar() {
  const {setSnackbar} = useContext(snackbarContext)

  function showMessage(message: string, severity: SnackbarOptions['severity'],duration?:number) {
    // show notification
    setSnackbar({
      ...snackbarDefaults,
      open: true,
      severity,
      duration,
      message
    })
  }

  function showSuccessMessage(message: string) {
    showMessage(message,'success',5000)
  }

  function showInfoMessage(message: string) {
    showMessage(message,'info',5000)
  }

  function showWarningMessage(message: string) {
    showMessage(message,'warning',10000)
  }

  function showErrorMessage(message: string) {
    showMessage(message,'error')
  }

  return {
    showSuccessMessage,
    showInfoMessage,
    showWarningMessage,
    showErrorMessage
  }
}
