// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {createKeyword} from '~/components/keyword/apiEditKeywords'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {deleteKeywordById, getKeywords, KeywordCount} from './apiKeywords'

export function useKeywords(token: string) {
  const {showErrorMessage} = useSnackbar()
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find or add keyword')
  const [keywords, setKeywords] = useState<KeywordCount[]>([])
  const [loading, setLoading] = useState(true)

  const loadKeywords = useCallback(async() => {
    setLoading(true)
    const {keywords, count} = await getKeywords({
      token,
      searchFor,
      page,
      rows
    })
    setKeywords(keywords)
    setCount(count)
    setLoading(false)
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, searchFor, page, rows])

  useEffect(() => {
    if (token) {
      loadKeywords()
    }
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token,searchFor,page,rows])

  async function addKeyword(value?: string) {
    // by default use searchFor
    let keyword = searchFor
    // if value provided use it
    if (value) keyword = value
    const resp = await createKeyword({
      keyword,
      token
    })
    if (resp.status === 201) {
      await loadKeywords()
    } else {
      showErrorMessage(`Failed to add keyword. ${resp.message}`)
    }
  }

  async function deleteKeyword(id: string) {
    const resp = await deleteKeywordById({
      id,
      token
    })
    if (resp.status === 200) {
      await loadKeywords()
    } else {
      showErrorMessage(`Failed to delete keyword. ${resp.message}`)
    }
  }

  return {
    loading,
    keywords,
    searchFor,
    addKeyword,
    deleteKeyword
  }
}
