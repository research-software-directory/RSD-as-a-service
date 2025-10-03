// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useSession} from '~/auth/AuthProvider'
import ContentLoader from '~/components/layout/ContentLoader'
import useProjectContext from '../context/useProjectContext'
import useProjectToEdit from './useProjectToEdit'
import ProjectInformationForm from './ProjectInformationForm'

export default function EditProjectInformation() {
  const {token} = useSession()
  const {project:{slug}} = useProjectContext()
  const {project} = useProjectToEdit({slug,token})

  // console.group('EditProjectInformation')
  // console.log('token...', token)
  // console.log('slug...', slug)
  // console.log('loading...', loading)
  // console.log('project...', project)
  // console.groupEnd()

  if (project) {
    return (
      <ProjectInformationForm editProject={project} />
    )
  }

  return (
    <ContentLoader />
  )
}
