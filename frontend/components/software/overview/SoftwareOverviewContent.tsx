// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {SoftwareListItem} from '~/types/SoftwareTypes'
import NoContent from '~/components/layout/NoContent'
import {LayoutType} from './search/ViewToggleGroup'
import SoftwareOverviewList from './list/SoftwareOverviewList'
import SoftwareOverviewMasonry from './SoftwareOverviewMasonry'
import SoftwareOverviewGrid from './SoftwareOverviewGrid'

type SoftwareOverviewContentProps = {
  layout: LayoutType
  software:SoftwareListItem[]
}

export default function SoftwareOverviewContent({layout, software}: SoftwareOverviewContentProps) {

  if (!software || software.length === 0) {
    return <NoContent />
  }

  if (layout === 'masonry') {
    // Masenory grid layout
    return (
      <SoftwareOverviewMasonry
        software={software}
      />
    )
  }

  if (layout === 'grid') {
    return (
      <SoftwareOverviewGrid
        software={software}
      />
    )
  }

  // LIST overview as default
  return (
    <SoftwareOverviewList
      software={software}
    />
  )
}
