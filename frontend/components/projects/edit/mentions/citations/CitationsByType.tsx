// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import useProjectContext from '~/components/projects/edit/useProjectContext'
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
      <Alert severity="info">
        Here we list all the citations of your output that the RSD was able to find
        automatically by using the DOIs of your output and OpenAlex. On the project
        page these citations are showed in the impact section together with the items
        you added manually.
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
