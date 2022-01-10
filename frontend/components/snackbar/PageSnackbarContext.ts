import {createContext} from 'react'

export type SnackbarOptions={
  severity:'error'|'info'|'warning'|'success',
  message:string,
  open?:boolean,
  duration?:number
}

export const snackbarDefaults:SnackbarOptions={
  open: false,
  severity: 'info',
  message: '',
  duration: 5000
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
