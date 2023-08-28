// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import KeywordsFilter, {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import useQueryChange from '../useQueryChange'

type ProjectKeywordsFilterProps = {
  keywords: string[],
  keywordsList: KeywordFilterOption[]
}

export default function OrgProjectKeywordsFilter({keywords, keywordsList}: ProjectKeywordsFilterProps) {
  const {handleQueryChange} = useQueryChange()

  return (
    <div>
      <KeywordsFilter
        keywords={keywords}
        keywordsList={keywordsList}
        handleQueryChange={handleQueryChange}
      />
    </div>
  )

}
