// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import KeywordFilter from '../keyword/KeywordFilter'
import {searchForSoftwareKeyword} from './edit/information/searchForSoftwareKeyword'

type KeywordFilterProps = {
  items?: string[]
  onApply: (items: string[]) => void
}

/**
 * Keywords filter component. It receives array of keywords and returns
 * array of selected tags to use in filter using onSelect callback function
 */
export default function SoftwareKeywordsFilter({items = [], onApply}: KeywordFilterProps) {
  return (
    <KeywordFilter
      items={items}
      onApply={onApply}
      searchApi={searchForSoftwareKeyword}
    />
  )
}
