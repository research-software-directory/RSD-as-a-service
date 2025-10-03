// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {sortOnNumProp} from '~/utils/sortFn'
import {MentionItemProps} from '~/types/Mention'
import {classifyMentionsByType} from '~/components/mention/apiEditMentions'
import {getMentionType, getMentionTypeOrder} from '~/components/mention/config'
import NoCitationItems from './NoCitationItems'
import ViewCitationsList from './CitationsListView'

export default function CitationsByType({mentions}:{mentions:MentionItemProps[]}) {
  // return no citations
  if (mentions?.length === 0) return <NoCitationItems />

  // we do not have featured mentions for citations (scraped mentions)
  const {mentionByType} = classifyMentionsByType(mentions)
  const mentionTypes = getMentionTypeOrder(mentionByType)

  // render
  return mentionTypes.map((key) => {
    const items = mentionByType[key]?.sort((a, b) => {
      // sort mentions on date, newest at the top
      return sortOnNumProp(a,b,'publication_year','desc')
    })
    if (items){
      const title = getMentionType(key,'plural')
      return <ViewCitationsList key={key} title={title} items={items} />
    }
  })
}
