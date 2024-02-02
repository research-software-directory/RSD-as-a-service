// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

import {useSession} from '~/auth'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import ContentLoader from '~/components/layout/ContentLoader'
import useProjectContext from '../useProjectContext'
import {cfgCitations as config} from './config'
import useCitationsForProject from './useCitationsForProject'
import {clasifyMentionsByType} from '~/utils/editMentions'
import {getMentionType, getMentionTypeOrder} from '~/components/mention/config'
import {sortOnNumProp} from '~/utils/sortFn'
import CitationsList from './CitationsList'
import NoCitationItems from './NoCitationItems'
import {MentionItemProps} from '~/types/Mention'


function CitationListByType({mentions}:{mentions:MentionItemProps[]}){
  // we do not have feature mentions for citations (scraped mentions)
  const {mentionByType} = clasifyMentionsByType(mentions)
  const mentionTypes = getMentionTypeOrder(mentionByType)

  // render
  return mentionTypes.map((key) => {
    const items = mentionByType[key]?.sort((a, b) => {
      // sort mentions on date, newest at the top
      return sortOnNumProp(a,b,'publication_year','desc')
    })
    if (items){
      const title = getMentionType(key,'plural')
      return (
        <CitationsList
          key={key}
          title={title}
          items={items}
        />
      )
    }
  })
}

export default function CitationsByType() {
  const {project} = useProjectContext()
  const {token} = useSession()
  const {loading, mentions} = useCitationsForProject({
    project: project.id,
    token
  })

  // console.group('CitationsByType')
  // console.log('citationCnt...', citationCnt)
  // console.log('loading...', loading)
  // console.log('project...', project)
  // console.log('token...', token)
  // console.groupEnd()

  if (loading) {
    return (
      <ContentLoader />
    )
  }

  return (
    <>
      <EditSectionTitle
        title={config.title}
      >
        <h2>{mentions?.length ?? 0}</h2>
      </EditSectionTitle>
      <div className="py-2" />
      <Alert severity="info">
        Here you see all citations RSD is able to scrape from OpenAlex.
        We use publication DOI you provided in the output section to look for citations of the project output.
        RSD scraper will periodically search for citation of your publications using the DOI.
        On the project page these citations are showed in the impact section together with the items you added manually.
      </Alert>
      <div className="py-2" />
      {/* render citations by type */}
      { mentions?.length===0 ?
        <NoCitationItems />
        :
        <CitationListByType
          mentions={mentions}
        />
      }
    </>
  )
}
