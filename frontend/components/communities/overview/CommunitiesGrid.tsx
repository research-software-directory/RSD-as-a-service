// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import CommunityCard from './CommunityCard'
import {CommunityListProps} from '../apiCommunities'


export default function CommunitiesGrid({items}:{items:CommunityListProps[]}) {

  if (typeof items == 'undefined' || items.length===0){
    return <NoContent />
  }

  return (
    <section
      data-testid="communities-overview-list"
      className="my-12 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-[27rem]">
      {items.map((item) => (
        <CommunityCard key={item.slug} community={item} />
      ))}
    </section>
  )
}
