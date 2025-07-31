// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import DeleteIcon from '@mui/icons-material/Delete'

import {useSession} from '~/auth/AuthProvider'
import ContentLoader from '~/components/layout/ContentLoader'
import {KeywordCount} from './apiKeywords'
import KeywordEdit from './KeywordEdit'
import {ssrProjectsUrl, ssrSoftwareUrl} from '~/utils/postgrestUrl'
import IconButton from '@mui/material/IconButton'

type KeywordTableProps = {
  loading: boolean
  keywords: KeywordCount[]
  searchFor: string
  deleteKeyword: (id:string)=>void
}


export default function KeywordTable({loading, keywords, searchFor, deleteKeyword}:KeywordTableProps) {
  const {token} = useSession()

  if (loading) return <ContentLoader />

  if (keywords.length === 0) {
    return (
      <section className="flex-1">
        <Alert severity="warning"
          sx={{
            marginTop: '0.5rem'
          }}
        >
          <AlertTitle sx={{fontWeight:500}}>Keyword not found</AlertTitle>
          You can add <strong>{searchFor}</strong> keyword using add button.
        </Alert>
      </section>
    )
  }

  return (
    <table className='w-full my-4'>
      <thead>
        <tr>
          <th align='left'>Keyword *</th>
          <th align='left'>Software</th>
          <th align='left'>Projects</th>
          <th align='left'></th>
        </tr>
      </thead>
      <tbody>
        {
          keywords.map(item => {
            return (
              <tr key={item.keyword}>
                <td
                  className="py-2 px-1"
                >
                  <KeywordEdit
                    id={item.id}
                    keyword={item.keyword}
                    token={token}
                  />

                </td>
                <td>
                  <Link
                    href={ssrSoftwareUrl({keywords:[item.keyword]})}
                    target="_blank"
                  >
                    {item.software_cnt ?? 0}
                  </Link>
                </td>
                <td>
                  <Link
                    href={ssrProjectsUrl({keywords:[item.keyword]})}
                    target="_blank"
                  >
                    {item.projects_cnt ?? 0}
                  </Link>
                </td>
                <td title="Used keyword cannot be deleted">
                  <IconButton
                    disabled={item.projects_cnt > 0 || item.software_cnt > 0}
                    onClick={() =>
                      deleteKeyword(item.id)
                    }>
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            )
          })
        }
      </tbody>
      <tfoot>
        <tr>
          <td
            className="text-sm text-base-content-disabled py-2"
            colSpan={3}
          >
            * Click on the keyword to edit. Use escape key to cancel changes.
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
