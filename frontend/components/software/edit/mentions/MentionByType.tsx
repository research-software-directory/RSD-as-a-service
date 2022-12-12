// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import EditSectionTitle from '~/components/layout/EditSectionTitle'
import MentionEditSection from '~/components/mention/MentionEditSection'
import ContentLoader from '~/components/layout/ContentLoader'
import {cfgMention as config} from './config'
import useMentionForSoftware from './useMentionForSoftware'

export default function MentionByType({software,token}: {software:string,token:string}) {
  const {loading,mentionCnt} = useMentionForSoftware({
    software,
    token
  })

  // console.group('MentionByType')
  // console.log('mentionCnt...', mentionCnt)
  // console.log('loading...', loading)
  // console.groupEnd()

  if (loading) {
    return (
      <div className="h-full flex items-center">
        <ContentLoader />
      </div>
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
