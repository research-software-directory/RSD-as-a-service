// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type KeywordListProps = {
  keywords?: string[]
  visibleNumberOfKeywords?: number
}

export default function KeywordList({keywords=[], visibleNumberOfKeywords = 3}: KeywordListProps) {

  if (!keywords || keywords.length===0) return null

  return (
    <ul className="flex flex-wrap items-start gap-2 text-gray-600 text-sm mt-4">
      {// limits the keywords to 'visibleNumberOfKeywords' per software.
        keywords?.slice(0, visibleNumberOfKeywords)
          .map((keyword:string, index: number) => (
            <li
              key={index}
              className="bg-base-200 p-1 m-0 rounded"
            >{keyword}</li>
          ))}

      { //  Show the number of keywords that are not visible.
        (keywords?.length > 0)
        && (keywords?.length > visibleNumberOfKeywords)
        && (keywords?.length - visibleNumberOfKeywords > 0)
        && `+ ${keywords?.length - visibleNumberOfKeywords}`
      }
    </ul>
  )
}
