// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type KeywordListProps = {
  keywords?: string[] | null
  visibleNumberOfKeywords?: number
}

export default function KeywordList({keywords=[], visibleNumberOfKeywords = 3}: KeywordListProps) {

  if (!keywords || keywords.length===0) return null

  return (
    <ul className="flex flex-wrap items-start gap-1 text-base-content text-xs">
      {// limits the keywords to 'visibleNumberOfKeywords' per software.
        keywords?.slice(0, visibleNumberOfKeywords)
          .map((keyword:string) => (
            <li
              title={keyword}
              key={keyword}
              className="bg-base-200 px-2 rounded-sm capitalize line-clamp-1 leading-[1.5rem]"
            >{keyword}</li>
          ))}

      { //  Show the number of keywords that are not visible.
        (keywords?.length > 0)
        && (keywords?.length > visibleNumberOfKeywords)
        && (keywords?.length - visibleNumberOfKeywords > 0)
        && <li>{`+ ${keywords?.length - visibleNumberOfKeywords}`}</li>
      }
    </ul>
  )
}
