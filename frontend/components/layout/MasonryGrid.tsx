// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type MasonryGridProps={
  children: JSX.Element | JSX.Element[]
  className?:string
}

export default function MasonryGrid({children,className}: MasonryGridProps) {
  return (
    <section
      data-testid="masonry-grid"
      className={`w-full lg:columns-2 xl:columns-3 gap-8 ${className ?? ''}`}>
      {children}
    </section>
  )
}
