// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ProjectStatusLabels} from '~/components/projects/overview/filters/ProjectStatusFilter'
import {ProjectStatusKey} from '~/types/Project'

type ProjectStatusProps = Readonly<{
  status: ProjectStatusKey
}>

export default function RelatedProjectStatus({status}: ProjectStatusProps) {

  if (status && status !== 'unknown') {
    return (
      <div className="flex items-start justify-center">
        {ProjectStatusLabels[status] ?? ''}
      </div>
    )
  }

  return null
}
