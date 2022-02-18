import Alert from '@mui/material/Alert'

export default function JavascriptSupportWarning() {
  return (
    <noscript>
      <Alert severity="warning" sx={{margin:'0rem 2rem'}}>
        Limited functionality: Your browser does not support JavaScript.
      </Alert>
    </noscript>
  )
}
