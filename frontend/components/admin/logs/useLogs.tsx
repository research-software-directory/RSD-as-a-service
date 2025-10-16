// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {OrderByProps} from '~/components/table/EditableTable'
import {getLogs,deleteLogById, deleteLogsOlderThan} from './apiLogs'

export type BackendLog = {
  id: string,
  service_name: string
  table_name: string
  reference_id: string
  message: string
  stack_trace: string
  other_data: string
  created_at: string,
  slug: string,
  delete?: boolean
}

type useContributorsProps = {
  orderBy?: OrderByProps<BackendLog, keyof BackendLog>
}

export default function useLogs({orderBy}:useContributorsProps) {
  const {token} = useSession()
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find log')
  const [logs, setLogs] = useState<BackendLog[]>([])
  const [loading, setLoading] = useState(true)

  const loadLogs = useCallback(async () => {
    let abort = false
    setLoading(true)

    // console.group('loadLogs')
    // console.log('page...', page)
    // console.log('rows...', rows)
    // console.log('orderBy...', orderBy)
    // console.groupEnd()

    const {logs, count} = await getLogs({
      token,
      searchFor,
      page,
      rows,
      orderBy
    })

    if (abort === false) {
      setLogs(logs)
      if (count) {
        setCount(count)
      }
      setLoading(false)
    }

    return ()=>{abort=true}
  // do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, searchFor, page, rows, orderBy])

  /**
   * Delete log and reload table.
   */
  const deleteLog = useCallback(async(id: string)=>{
    const resp = await deleteLogById({
      id,
      token
    })
    if (resp.status===200) {
      // load logs again
      await loadLogs()
    } else {
      showErrorMessage(`Failed to remove log ${id}. ${resp.message}`)
    }
  // we exclude showErrorMessage to avoid extra reloads
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,loadLogs])

  const deleteOldLogs = useCallback(async(days?:number)=>{
    const resp = await deleteLogsOlderThan({
      days,
      token,
    })
    if (resp.status===200) {
      showSuccessMessage(`Removed ${resp.message} log items`)
      // load logs again if some records are deleted
      if (Number.parseInt(resp.message) > 0) loadLogs()
    } else {
      showErrorMessage(`Failed to remove old logs. ${resp.message}`)
    }
  // we exclude showErrorMessage,showSuccessMessage to avoid extra reloads
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,loadLogs])


  useEffect(() => {
    if (token) loadLogs()
  },[token,loadLogs])

  return {
    loading,
    logs,
    loadLogs,
    deleteLog,
    deleteOldLogs
  }
}

