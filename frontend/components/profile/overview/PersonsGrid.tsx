// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'

import {PersonsOverview} from './apiPersonsOverview'
import PersonCard from './PersonCard'


export default function PersonsGrid({items}:{items:PersonsOverview[]}) {

  if (typeof items == 'undefined' || items.length===0){
    return <NoContent />
  }

  return (
    <section
      data-testid="persons-grid"
      className="my-12 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-[27rem]">
      {items.map((item) => (
        <PersonCard key={item.account} person={item} />
      ))}
    </section>
  )
}
