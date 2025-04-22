// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

type ReleaseNavProps = {
  year: number,
  selected: boolean
  release_cnt: number,
  link: string
}

export default function ReleaseNavButton({year, selected, release_cnt, link}: Readonly<ReleaseNavProps>) {
  // const release_year = router.query['release_year']
  let styles = {
    opacity: 0.6
  }
  if (selected) {
    styles = {
      opacity: 1
    }
  }

  return (
    <Link role="release-year-button" scroll={false} href={link} style={styles}>
      <div className="border rounded-md">
        <div className="bg-primary py-1 px-2 text-primary-content">{year}</div>
        <div className="text-center p-2 font-medium text-primary">{release_cnt}</div>
      </div>
    </Link>
  )
}
