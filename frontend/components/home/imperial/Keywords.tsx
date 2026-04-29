// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2026 Diego Alonso Alvarez (ICL) <d.alonso-alvarez@imperial.ac.uk>
// SPDX-FileCopyrightText: 2026 Imperial College London
//
// SPDX-License-Identifier: Apache-2.0

import KeywordBox from './KeywordBox'

type KeywordsProps = {
  keywords: Array<KeywordsObject>
}

type KeywordsObject = {
  keyword: string
}

export default function Keywords({keywords}: KeywordsProps) {
  const keywordButtons = keywords.map((keyword: KeywordsObject, index: number) => {
    return <KeywordBox key={index} label={keyword.keyword} />
  })
  return (
    <div className="max-w-(--breakpoint-xl) mx-auto">
      <div className="text-2xl ml-10 mt-14">
        <h2 className="flex justify-start text-3xl lg:text-4xl font-rsd-titles font-bold mt-6">Popular Keywords</h2>
      </div>
      <div className="flex flex-wrap gap-10 md:gap-3 p-5 md:p-10 ">
        {keywordButtons}
      </div>
    </div>
  )
}
