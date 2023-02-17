// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'

type ReleaseNavProps = {
  year: string,
  release_cnt: number
}

export default function ReleaseNavButton({year, release_cnt}: ReleaseNavProps) {
  const router = useRouter()
  const release_year = router.query['release_year']
  let styles = {
    opacity: 0.6
  }
  if (release_year && release_year === year) {
    styles = {
      opacity: 1
    }
  }

  function navigateToYear() {
    // do nothing if release_year already set
    if (release_year && release_year === year) return
    // change query
    router.push({
      query: {
        ...router.query,
        release_year: year
      }
    })
  }

  return (
    <div role="button" onClick={navigateToYear} style={styles}>
      <div className="border rounded-md">
        <div className="bg-primary py-1 px-2 text-primary-content">{year}</div>
        <div className="text-center p-2 font-medium text-primary">{release_cnt}</div>
      </div>
    </div>
  )
}
