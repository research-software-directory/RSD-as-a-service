// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type CardTitleSubtitleProps = {
  title: string
  subtitle:string
}

export default function CardTitleSubtitle({title,subtitle}:CardTitleSubtitleProps) {
  return (
    <>
    <h2 className="text-xl font-medium line-clamp-1">
      {title}
    </h2>
    <div className="py-2">
      <p className="text-base-700 line-clamp-3 break-words">
        {subtitle}
      </p>
    </div>
    </>
  )
}
