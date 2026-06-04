// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type SearchOverviewMsg={
  name: string
  count: number
  page: number
  rows: number
  filterCnt: number
  search?: string | null
}
export function searchOverviewMsg({name,count,page,rows,search,filterCnt}:SearchOverviewMsg){

  let announcement = `${count} ${name}. Page ${page} of ${Math.ceil(count / rows)}. ${rows} items per page.`
  let placeholder = `Find ${name.split(' ')[0]}`

  if (search) {
    announcement += ` Filtered by search term ${search}.`
  }

  if (filterCnt > 0) {
    announcement += ` ${filterCnt} filters active.`
    placeholder = 'Find within selection'
  }

  return {
    placeholder,
    announcement
  }
}
