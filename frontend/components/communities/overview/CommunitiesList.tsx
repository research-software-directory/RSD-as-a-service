// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import {CommunityListProps} from '../apiCommunities'
import CommunityListItem from './CommunityListItem'


export default function CommunitiesList({items}:{items:CommunityListProps[]}) {
  if (typeof items == 'undefined' || items.length===0){
    return <NoContent />
  }
  return (
    <section
      data-testid="communities-overview-list"
      className="flex-1 my-12 flex flex-col gap-2">
      {items.map((item) => (
        <CommunityListItem key={item.slug} community={item} />
      ))}
    </section>
  )
}
