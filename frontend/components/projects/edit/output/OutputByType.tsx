// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import MentionEditSection from '~/components/mention/MentionEditSection'
import useProjectContext from '../useProjectContext'
import {cfgOutput as config} from './config'
import useOutputForProject from './useOutputForProject'
import Alert from '@mui/material/Alert'

export default function OutputByType() {
  const {project} = useProjectContext()
  const {token} = useSession()
  const {loading,outputCnt} = useOutputForProject({
    project: project.id,
    token
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
      <div className="py-2" />
      <Alert severity="info">
        Here you can add things which were produced by the project itself.
        These can be papers, books, articles, software, datasets, blogs, etc.
      </Alert>
      <div className="py-2" />
      <MentionEditSection />
    </>
  )
}
