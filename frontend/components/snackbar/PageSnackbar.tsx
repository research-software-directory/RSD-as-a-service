import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Slide from '@mui/material/Slide'

import {SnackbarOptions} from './PageSnackbarContext'

export default function PageSnackbar({options, setOptions}:{options:SnackbarOptions, setOptions:Function}){

  const {open, severity, message, duration, anchor} = options

  function slideTransition (props:any){
    // console.log("slideTransition.props: ", props)
    return <Slide {...props} direction="up" />
  };

  // console.log('PageSnackbar.options: ', options)
  function handleClose(event: React.SyntheticEvent | Event, reason?: string){
    if (reason!=='clickaway'){
      setOptions({
        ...options,
        open: false,
        message: undefined
      })
    }
  }

  return (
    <Snackbar
      open={open}
      anchorOrigin={anchor}
      autoHideDuration={duration}
      onClose={handleClose}
      TransitionComponent={slideTransition}>
      <Alert severity={severity}
        elevation={6}
        variant="filled"
        onClose={handleClose}
        style={{'alignItems':'center'}}>
        {message}
      </Alert>
    </Snackbar>
  )
}
