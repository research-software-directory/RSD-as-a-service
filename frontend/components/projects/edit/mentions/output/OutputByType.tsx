// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import MentionEditSection from '~/components/mention/MentionEditSection'
import useProjectContext from '~/components/projects/edit/useProjectContext'
import useOutputForProject from './useOutputForProject'
import Alert from '@mui/material/Alert'

export default function OutputByType() {
  const {project} = useProjectContext()
  const {token} = useSession()
  const {loading} = useOutputForProject({
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
      <Alert severity="info">
        Here you can add output that was produced by the project itself, such as papers,
        books, articles, software, datasets, videos, blogs, etc. The RSD will periodically
        look for citations of this output using OpenAlex and add them to the citations list on this page.
      </Alert>
      <div className="py-2" />
      <MentionEditSection />
    </>
  )
}
