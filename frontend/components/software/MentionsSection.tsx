import {createTheme, ThemeProvider} from '@mui/material/styles'

import PageContainer from '../layout/PageContainer'
import MentionIsFeatured from './MentionIsFeatured'
import MentionsByType, {MentionByType} from './MentionsByType'
import {sortOnDateProp} from '../../utils/sortFn'
import {MentionForSoftware} from '../../types/Mention'
import {clasifyMentionsByType} from '../../utils/editMentions'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function SoftwareMentionsSection({mentions}: { mentions: MentionForSoftware[] }) {
  // do not render section if no data
  if (!mentions || mentions.length === 0) return null
  // split to featured and (not featured) mentions by type (different presentation)
  const {mentionByType, featuredMentions} = clasifyMentionsByType(mentions)

  return (
    <ThemeProvider theme={darkTheme}>
      <section
        className="bg-secondary"
      >
        <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
          <h2
            data-testid="software-mentions-section-title"
            className="pb-8 text-[2rem] text-white">
            Mentions
          </h2>
          <section>
            {featuredMentions
              .sort((a,b)=>sortOnDateProp(a,b,'date','desc'))
              .map(item => {
              return (
                <MentionIsFeatured key={item.url} mention={item} />
              )
            })}
            <MentionsByType mentionByType={mentionByType} />
          </section>
        </PageContainer>
      </section>
    </ThemeProvider>
  )
}
