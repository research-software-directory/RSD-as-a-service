// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Person} from '../../types/Contributor'
import ContributorAvatar from './ContributorAvatar'
import {getDisplayName, getDisplayInitials} from '../../utils/getDisplayName'
import PersonalInfo from './PersonalInfo'
import {getImageUrl} from '~/utils/editImage'

export default function ContributorsList({contributors}: { contributors: Person[] }) {
  // do not render component if no data
  if (contributors?.length === 0) return null


  return (
    <div className="gap-4 mt-12 md:grid md:grid-cols-2 hd:grid-cols-3 2xl:mt-0">
      {contributors.map(item => {
        const displayName = getDisplayName(item)
        const avatarUrl = getImageUrl(item.avatar_id) ?? ''
        if (displayName) {
          return (
            <div key={displayName} className="flex py-4 pr-4 md:pr-8 2xl:pr-12 2xl:pb-8">
              <ContributorAvatar
                avatarUrl={avatarUrl}
                displayName={displayName}
                displayInitials={getDisplayInitials(item)}
              />
              <div className='flex-1'>
                <div className="text-xl font-medium ">
                  {displayName}
                </div>
                <PersonalInfo {...item} />
              </div>
            </div>
          )
        }
        return null
      })
      }
    </div>
  )
}
