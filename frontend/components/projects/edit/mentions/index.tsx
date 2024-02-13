// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ContentLoader from '~/components/layout/ContentLoader'
import useProjectMentionCounts from './useProjectMentionCounts'
import {MentionCountsProvider} from './MentionCountsContext'
import MentionTabs from './MentionTabs'

export default function MentionsPage() {
  const {counts,loading} = useProjectMentionCounts()

  // console.group('MentionsPage')
  // console.log('loading...', loading)
  // console.log('counts...', counts)
  // console.groupEnd()

  if (loading) return <ContentLoader />

  return (
    <article>
      <MentionCountsProvider
        counts={counts}
      >
        <MentionTabs />
      </MentionCountsProvider>
    </article>
  )
}
