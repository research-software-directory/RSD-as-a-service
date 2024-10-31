// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {patchKeyword} from './apiKeywords'

type KeywordEditProps = {
  id: string
  keyword: string
  token: string
}

export default function KeywordEdit({id, keyword, token}: KeywordEditProps) {
  const [value,setValue] = useState(keyword)

  async function updateKeyword(value: string) {
    // console.log('updateKeyword...', id, value)
    patchKeyword({
      id,
      value,
      token
    })
  }

  return (
    <input
      className="p-1 w-full focus:bg-base-200"
      type="text"
      value={value}
      onChange={({target})=>setValue(target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setValue(keyword)
        }
      }}
      onBlur={({target}) => {
        if (target.value !== keyword) {
          updateKeyword(target.value)
        }
      }}
    />
  )
}
