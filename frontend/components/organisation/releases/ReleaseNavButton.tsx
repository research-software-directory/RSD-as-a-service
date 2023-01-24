// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type ReleaseNavProps = {
  year: string,
  release_cnt: number
}

export default function ReleaseNavButton({year,release_cnt}:ReleaseNavProps) {
  return (
    <a key={year} href={`#id_${year}`}>
      <div className="border rounded-md">
        <div className="bg-primary py-1 px-2 text-primary-content">{year}</div>
        <div className="text-center p-2 font-medium text-primary">{release_cnt}</div>
      </div>
    </a>
  )
}
