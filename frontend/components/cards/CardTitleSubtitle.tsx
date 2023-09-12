// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type CardTitleSubtitleProps = {
  title: string
  subtitle: string
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
      <p className="text-base-700 line-clamp-3 break-words my-2">
        {subtitle}
      </p>
    </>
  )
}
