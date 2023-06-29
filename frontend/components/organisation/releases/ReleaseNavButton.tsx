// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type ReleaseNavProps = {
  year: number,
  selected: boolean
  release_cnt: number
  onSelectYear: (year:number)=>void
}

export default function ReleaseNavButton({year,selected,release_cnt,onSelectYear}: ReleaseNavProps) {
  // const router = useRouter()
  // const release_year = router.query['release_year']
  let styles = {
    opacity: 0.6
  }
  if (selected) {
    styles = {
      opacity: 1
    }
  }

  function navigateToYear() {
    onSelectYear(year)
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
