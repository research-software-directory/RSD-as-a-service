// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import MentionEditSection from '~/components/mention/MentionEditSection'
import ContentLoader from '~/components/layout/ContentLoader'
import useProjectContext from '~/components/projects/edit/useProjectContext'
import {cfgImpact as config} from './config'
import useImpactForProject from './useImpactForProject'
import Alert from '@mui/material/Alert'

export default function ImpactByType() {
  const {project} = useProjectContext()
  const {token} = useSession()
  const {loading,impactCnt} = useImpactForProject({
    project: project.id,
    token
  })

  // console.group('ImpactByType')
  // console.log('impactCnt...', impactCnt)
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
        Here you can add mentions of your output that cannot be found automatically by the RSD.
        These can be papers by others re-using your software, articles or videos in the press
        describing the results, policy documents based on your results, etc.
      </Alert>
      <div className="py-2" />
      <MentionEditSection />
    </>
  )
}
