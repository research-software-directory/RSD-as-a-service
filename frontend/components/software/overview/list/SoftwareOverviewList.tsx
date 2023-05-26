// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {SoftwareListItem} from '~/types/SoftwareTypes'
import SoftwareOverviewListItem from './SoftwareOverviewListItem'

export default function SoftwareOverviewList({software = []}: { software: SoftwareListItem[] }) {

  return (
    <section
      data-testid="software-overview-list"
      className="flex-1 mt-2"
    >
      {software.map(item => <SoftwareOverviewListItem key={item.id} item={item}/>)}
    </section>
  )
}
