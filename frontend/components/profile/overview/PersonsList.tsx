// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import {PersonsOverview} from './apiPersonsOverview'
import PersonListItem from './PersonListItem'


export default function PersonsList({items}:{items:PersonsOverview[]}) {
  if (typeof items == 'undefined' || items.length===0){
    return <NoContent />
  }
  return (
    <section
      data-testid="persons-list"
      className="flex-1 my-12 flex flex-col gap-2">
      {items.map((item) => (
        <PersonListItem key={item.account} person={item} />
      ))}
    </section>
  )
}
