// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {EditProject} from '~/types/Project'
import mockData from './useProjectToEditData.json'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useProjectToEdit({slug, token}:
  { slug: string, token: string, reload?: boolean }) {

  const [project, setProject] = useState<EditProject>()
  const [loading, setLoading] = useState(true)

  // console.group('useProjectToEdit...MOCK')
  // console.log('loading...', loading)
  // console.log('project...', project)
  // console.group()

  useEffect(() => {
    setTimeout(() => {
      mockData.slug = slug
      setProject(mockData as any)
      setLoading(false)
    },100)
  },[slug])

  return {
    loading,
    project
  }
}
