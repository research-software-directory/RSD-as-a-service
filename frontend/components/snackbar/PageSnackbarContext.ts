import {createContext} from 'react'

export type SnackbarOptions={
  severity:'error'|'info'|'warning'|'success',
  message:string,
  open?:boolean,
  duration?: number,
  anchor?: {
    vertical:'top' | 'bottom',
    horizontal:'left' | 'center' | 'right'
  }
}

export const snackbarDefaults:SnackbarOptions={
  open: false,
  severity: 'info',
  message: '',
  duration: 5000,
  anchor: {
    vertical: 'bottom',
    horizontal: 'center'
  }
}

export type PageSnackbarType={
  options: SnackbarOptions,
  setSnackbar: (options:SnackbarOptions)=>void
}

const PageSnackbarContext = createContext<PageSnackbarType>({
  options:snackbarDefaults,
  setSnackbar:()=>{}
})

export default PageSnackbarContext
