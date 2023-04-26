// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {SoftwareListItem} from '~/types/SoftwareTypes'
import {SoftwareCard} from './SoftwareCard'

export default function SoftwareOverviewMasonry({software=[]}: { software:SoftwareListItem[]}) {
  return (
    <section className="w-full lg:columns-2 xl:columns-3 gap-8 mt-4">
      {software.map((item, index) => (
        <div key={index} className="mb-8 break-inside-avoid">
          <SoftwareCard item={item}/>
        </div>
      ))}
    </section>
  )
}
