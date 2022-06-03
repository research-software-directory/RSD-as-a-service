// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Session} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import MentionEditSection from '~/components/mention/MentionEditSection'
import useProjectContext from '../useProjectContext'
import {cfgOutput as config} from './config'
import useOutputForProject from './useOutputForProject'

export default function OutputByType({session}: { session: Session }) {
  const {project} = useProjectContext()
  const {loading,outputCnt} = useOutputForProject({
    project: project.id,
    token: session.token
  })

  // console.group('OutputByType')
  // console.log('outputCnt...', outputCnt)
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
        <h2>{outputCnt ?? 0}</h2>
      </EditSectionTitle>
      <div className="py-4"></div>
      <MentionEditSection />
    </>
  )
}
