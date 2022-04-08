import {createTheme, ThemeProvider} from '@mui/material/styles'

import PageContainer from './PageContainer'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

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
