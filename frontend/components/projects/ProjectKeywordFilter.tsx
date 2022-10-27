// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import KeywordFilter from '~/components/keyword/KeywordFilter'
import {searchForProjectKeyword} from './edit/information/searchForKeyword'

type KeywordFilterProps = {
  items?: string[]
  onApply: (items: string[]) => void
}

/**
 * Keywords filter component. It receives array of keywords and returns
 * array of selected tags to use in filter using onSelect callback function
 */
export default function ProjectKeywordFilter({items=[], onApply}:KeywordFilterProps) {
  return (
    <KeywordFilter
      items={items}
      onApply={onApply}
      searchApi={searchForProjectKeyword}
    />
  )
}
