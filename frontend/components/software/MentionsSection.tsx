import {createTheme, ThemeProvider} from '@mui/material/styles'

import PageContainer from '../layout/PageContainer'
import MentionsByType from './MentionsByType'
import {Mention} from '../../utils/getSoftware'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function MentionsSection({mentions}: { mentions: Mention[] }) {

  // render nothing if no data
  if (mentions.length === 0) return null

  return (
    <ThemeProvider theme={darkTheme}>
      <section className="bg-secondary">
        <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
          <h2 className="pb-8 text-[2rem] text-white">Mentions</h2>

          <MentionsByType mentions={mentions} />
        </PageContainer>
      </section>
    </ThemeProvider>
  )
}
