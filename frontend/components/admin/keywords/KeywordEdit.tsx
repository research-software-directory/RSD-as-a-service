// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {patchKeyword} from './apiKeywords'

type KeywordEditProps = {
  id: string
  keyword: string
  token: string
}

export default function KeywordEdit({id, keyword, token}: KeywordEditProps) {

  async function updateKeyword(value: string) {
    // console.log('updateKeyword...', id, value)
    const resp = patchKeyword({
      id,
      value,
      token
    })
  }

  return (
    <input
      style={{padding: '0.25rem', width:'100%'}}
      type="text"
      defaultValue={keyword}
      onBlur={({target}) => {
        if (target.value !== keyword) {
          updateKeyword(target.value)
        }
      }}
    />
  )
}
