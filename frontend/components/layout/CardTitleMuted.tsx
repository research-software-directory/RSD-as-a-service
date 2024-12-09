// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type CardTitleMutedProps=Readonly<{
  title: string
  label: string
}>

export default function CardTitleMuted({title,label}:CardTitleMutedProps) {
  return (
    <div
      title={title}
      className="line-clamp-1 text-sm text-base-content-disabled font-medium tracking-widest uppercase mb-2"
    >
      {label}
    </div>
  )
}
