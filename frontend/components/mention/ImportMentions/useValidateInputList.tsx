// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'
import useEditMentionReducer from '../useEditMentionReducer'
import {validateInputList} from './apiImportMentions'

export default function useValidateInputList(token: string){
  const {mentions} = useEditMentionReducer()
  const [validating, setValidating] = useState(false)

  async function validateInput(value: string) {
    setValidating(true)
    const doiList = value.split(/\r\n|\n|\r/)
    const searchResults = await validateInputList(doiList, mentions, token)
    setValidating(false)
    return searchResults
  }

  return {
    validateInput,
    validating
  }
}
