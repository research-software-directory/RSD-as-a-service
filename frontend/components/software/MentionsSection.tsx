import {createTheme, ThemeProvider} from '@mui/material/styles'

import PageContainer from '../layout/PageContainer'
import MentionIsFeatured from './MentionIsFeatured'
import MentionsByType, {MentionByType} from './MentionsByType'
import {sortOnDateProp} from '../../utils/sortFn'
import {MentionForSoftware} from '../../types/MentionType'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function MentionsSection({mentions}: { mentions: MentionForSoftware[] }) {
  // do not render section if no data
  if (!mentions || mentions.length === 0) return null
  // split to featured and (not featured) mentions by type (different presentation)
  const {mentionByType, featuredMentions} = clasifyMentions(mentions)

  function clasifyMentions(mentions: MentionForSoftware[]) {
    let mentionByType: MentionByType = {}
    let featuredMentions:MentionForSoftware[]=[]

    mentions.forEach(item => {
      // remove array with software uuid
      delete item.mention_for_software
      // check if type prop exists
      let mType = item?.type as string ?? 'default'
      // extract featured mentions
      if (item.is_featured === true) {
        mType = 'featured'
        featuredMentions.push(item)
      } else if (mentionByType?.hasOwnProperty(item.type)) {
        mentionByType[mType].push(item)
      } else {
        // create array for new type
        mentionByType[mType] = []
        // and add this item
        mentionByType[mType].push(item)
      }
    })

    return {
      mentionByType,
      featuredMentions
    }
  }

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
