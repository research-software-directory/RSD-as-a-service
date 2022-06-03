// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Session} from '~/auth'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import MentionEditSection from '~/components/mention/MentionEditSection'
import ContentLoader from '~/components/layout/ContentLoader'
import {cfgImpact as config} from './config'
import useMentionForSoftware from './useMentionForSoftware'

export default function MentionByType({software,token}: {software:string,token:string}) {
  const {loading,mentionCnt} = useMentionForSoftware({
    software,
    token
  })

  // console.group('ImpactByType')
  // console.log('impactCnt...', impactCnt)
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
        <h2>{mentionCnt ?? 0}</h2>
      </EditSectionTitle>
      <div className="py-4"></div>
      <MentionEditSection />
    </>
  )
}
