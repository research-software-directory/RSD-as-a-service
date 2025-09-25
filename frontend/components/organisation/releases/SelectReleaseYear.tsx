// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {usePathname,useSearchParams} from 'next/navigation'
import {ReleaseCountByYear} from './apiOrganisationReleases'
import ReleaseNavButton from './ReleaseNavButton'

type SelectReleaseYearProps=Readonly<{
  releaseCountsByYear: ReleaseCountByYear[]
  queryYear?: string
}>

export default function SelectReleaseYear({releaseCountsByYear,queryYear}:SelectReleaseYearProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlParams = new URLSearchParams(searchParams ?? '')

  // do not show if no selected year
  if (!queryYear) return null

  return (
    <nav id="period_nav"
      className="flex flex-wrap justify-start items-center my-4"
      style={{gap: '0.5rem 0.25rem'}}>
      {releaseCountsByYear
        .map(count => {
          // update url query params
          urlParams.set('year',count.release_year.toString())
          // construct new url
          const url = `${pathname}?${urlParams.toString()}`

          return <ReleaseNavButton
            key={count.release_year}
            year={count.release_year}
            release_cnt={count.release_cnt}
            selected = {Number.parseInt(queryYear)==count.release_year}
            link={url}
          />
        })
      }
    </nav>
  )
}
