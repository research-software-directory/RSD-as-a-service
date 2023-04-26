// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {SoftwareListItem} from '~/types/SoftwareTypes'
import SoftwareGridCard from './SoftwareGridCard'
import FlexibleGridSection from '~/components/layout/FlexibleGridSection'

export default function SoftwareOverviewGrid({software = []}: { software: SoftwareListItem[] }) {
  const grid={
    height: '28rem',
    minWidth: '19rem',
    maxWidth: '1fr'
  }

  return (
    <FlexibleGridSection
      className="mt-4 gap-8"
      {...grid}
    >
      {software.map((item) => (
        <SoftwareGridCard key={item.id} item={item}/>
      ))}
    </FlexibleGridSection>
  )
}
