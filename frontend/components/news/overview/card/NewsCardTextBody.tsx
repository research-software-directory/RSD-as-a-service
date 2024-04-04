// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type CardTitleSubtitleProps = {
  title: string
  summary: string | null
}

export default function NewsCardTextBody({title,summary}:CardTitleSubtitleProps) {
  return (
    <>
      <h2
        title={title}
        className="text-xl font-medium line-clamp-1 my-1"
      >
        {title}
      </h2>
      {summary ?
        <p className="text-base-700 line-clamp-4 break-words my-2">
          {summary}
        </p>
        : null
      }
    </>
  )

}
