// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function FilterTitle({title,count}:{title:string,count:number}) {
  return (
    // min-w-0 on the parent is required so flexbox allows the title to shrink and truncate
    <div className="flex justify-between items-center gap-4 min-w-0 w-full">
      {/* truncate adds the 3 dots; title attribute provides native HTML mouseover tooltip */}
      <div
        title={title}
        className="font-semibold truncate">
        {title}
      </div>
      {/* shrink-0 ensures the counter never squishes or breaks into two lines */}
      <div
        className="text-sm opacity-70 shrink-0">
        ({count})
      </div>
    </div>
  )
}
