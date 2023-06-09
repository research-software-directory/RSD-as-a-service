// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function FilterTitle({title,count}:{title:string,count:number}) {
  return (
    <div className="flex justify-between items-center">
      <div className="font-semibold">{title}</div>
      <div className="text-sm opacity-70">{count}</div>
    </div>
  )
}
