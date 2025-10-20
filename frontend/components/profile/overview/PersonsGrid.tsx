// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'

import {PersonsOverview} from './apiPersonsOverview'
import PersonCard from './PersonCard'
import GridOverview from '~/components/layout/GridOverview'


export default function PersonsGrid({items}:{items:PersonsOverview[]}) {

  if (typeof items == 'undefined' || items.length===0){
    return <NoContent />
  }

  return (
    <GridOverview fullWidth={true} className="pt-12 pb-6 auto-rows-[28rem]">
      {items.map((item) => (
        <PersonCard key={item.account} person={item} />
      ))}
    </GridOverview>
  )
}
