// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type CardTitleSubtitleProps = {
  title: string
  subtitle: string | null
}

export default function CardTitleSubtitle({title,subtitle}:CardTitleSubtitleProps) {
  return (
    <>
      <h2
        title={title}
        className="text-xl font-medium line-clamp-1 my-1"
      >
        {title}
      </h2>
      {subtitle ?
        <p className="text-base-700 line-clamp-3 break-words my-2">
          {subtitle}
        </p>
        : null
      }
    </>
  )
}
