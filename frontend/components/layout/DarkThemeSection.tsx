import {ThemeProvider} from '@mui/material/styles'
import {loadMuiTheme} from '../../styles/rsdMuiTheme'

const darkTheme = loadMuiTheme('dark')

export default function DarkThemeSection(props:any) {

  return (
    <ThemeProvider theme={darkTheme}>
      <section
        className="bg-secondary"
      >
        {props?.children}
      </section>
    </ThemeProvider>
  )
}
