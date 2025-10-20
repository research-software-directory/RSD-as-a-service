// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import CommunityListItem from './CommunityListItem'

export default function CommunitiesList({items}:{items:CommunityListProps[]}) {
  if (typeof items == 'undefined' || items.length===0){
    return <NoContent />
  }
  return (
    <ListOverviewSection className="py-12">
      {items.map((item) => (
        <CommunityListItem key={item.slug} community={item} />
      ))}
    </ListOverviewSection>
  )
}
