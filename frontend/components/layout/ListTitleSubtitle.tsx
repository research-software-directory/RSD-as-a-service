// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type ListTitleSubtitleProps=Readonly<{
  title: string | null
  subtitle: string | null
}>

/**
 * Title and subtitle area of the list item.
 * It has fixed title and subtitle area for at least one line.
 * Title and subtitle are clamped on 1 line on lg screen.
 * On md screen
 * @returns
 */
export default function ListTitleSubtitle({title,subtitle}:ListTitleSubtitleProps) {
  return (
    <>
      <div className='flex-1 line-clamp-2 md:line-clamp-1 break-words font-medium'>
        {title}
      </div>
      <div className='flex-1 line-clamp-3 md:line-clamp-2 lg:line-clamp-1 break-words text-sm text-base-content-secondary min-h-[1.5rem]'>
        {subtitle}
      </div>
    </>
  )
}
