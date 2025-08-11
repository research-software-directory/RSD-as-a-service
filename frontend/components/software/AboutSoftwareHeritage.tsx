// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import LogoSoftwareHeritage from '~/assets/logos/LogoSWH.svg'
import {SoftwareHeritageItem} from './edit/software-heritage/apiSoftwareHeritage'
import SoftwareHeritageBadge from './edit/software-heritage/SoftwareHeritageBadge'

export default function AboutSoftwareHeritage({swhids}:{swhids:SoftwareHeritageItem[]}) {

  if (swhids?.length > 0){
    return (
      <div>
        <div className="pb-2 flex">
          <LogoSoftwareHeritage className={'h-6 w-6'} />
          <span className="text-primary pl-2">Software Heritage</span>
        </div>
        <div className="flex gap-2 flex-wrap py-2">
          {swhids.map(item=><SoftwareHeritageBadge key={item.swhid} swhid={item.swhid} />)}
        </div>
      </div>
    )
  }
  return null
}
