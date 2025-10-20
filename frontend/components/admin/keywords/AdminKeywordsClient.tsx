// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import {useSession} from '~/auth/AuthProvider'
import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'
import KeywordTable from './KeywordTable'
import {useKeywords} from './useKeywords'

export default function AdminKeywordsClient() {
  const {token} = useSession()
  const keywordProps = useKeywords(token)
  const {addKeyword, searchFor} = keywordProps
  const disabled = (searchFor === undefined || searchFor.length < 2)

  // console.group('AdminKeywordsClient')
  // console.log('token...', token)
  // console.log('keywordProps...', keywordProps)
  // console.log('disabled...', disabled)
  // console.groupEnd()

  return (
    <section className="flex-1">
      <div className="flex flex-wrap items-center justify-end">
        <Searchbox />
        <Button
          variant='contained'
          disabled={disabled}
          startIcon={<AddIcon/> }
          onClick={() => addKeyword(searchFor)}
          sx={{
            marginLeft:'1rem'
          }}
        >
          Add
        </Button>
        <Pagination />
      </div>
      <KeywordTable {...keywordProps} />
    </section>
  )
}
