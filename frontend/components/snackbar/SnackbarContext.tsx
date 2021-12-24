import {createContext} from 'react'

type SnackbarContext={
  open:boolean,
  message:string,
  onClose?:(event: React.SyntheticEvent | Event, reason?: string)=>void,
  duration?:number,
  action?: any
}

export const snackbarDefaults={
  open:false,
  message:'',
  duration:4000
}

const snackbarContext = createContext<SnackbarContext>(snackbarDefaults)

export default snackbarContext
