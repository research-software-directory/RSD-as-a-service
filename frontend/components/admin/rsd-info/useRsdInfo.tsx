// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

import {OrderByProps} from '~/components/table/EditableTable'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {createInfo, deleteInfoByKey, getRsdInfo, RsdInfoTable, RsdInfo} from './apiRsdInfo'
import {createColumns} from './config'

type useContributorsProps = {
  token: string,
  orderBy?: OrderByProps<RsdInfo, keyof RsdInfo>
}

export default function useRsdInfo({token, orderBy}:useContributorsProps) {
  const {showErrorMessage} = useSnackbar()
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find info by key or value')
  const [rsdInfo, setRsdInfo] = useState<RsdInfoTable[]>([])
  // show loading only on initial load
  const [loading, setLoading] = useState(true)
  const [columns] = useState(createColumns(token,addRsdInfo,deleteRsdInfo))

  const loadRsdInfo = useCallback(async () => {
    let abort = false
    const {rsdInfo, count} = await getRsdInfo({
      token,
      searchFor,
      page,
      rows,
      orderBy
    })

    if (abort === false) {
      if (orderBy) {
        // update columns order
        columns.forEach(col => {
          if (col.key === orderBy.column) {
            col.order = {
              active: true,
              direction: orderBy.direction
            }
          } else {
            col.order = {
              active: false,
              direction: 'asc'
            }
          }
        })
      }
      setRsdInfo(rsdInfo)
      setCount(count)
      setLoading(false)
    }

    return ()=>{abort=true}
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, searchFor, page, rows, columns, orderBy])

  useEffect(() => {
    loadRsdInfo()
  },[loadRsdInfo])

  async function addRsdInfo(data:RsdInfo) {
    const resp = await createInfo({
      data,
      token
    })
    if (resp.status === 201) {
      await loadRsdInfo()
    } else {
      showErrorMessage(`Failed to add info. ${resp.message}`)
    }
  }

  async function deleteRsdInfo(key: string) {
    const resp = await deleteInfoByKey({
      key,
      token
    })
    if (resp.status === 200) {
      await loadRsdInfo()
    } else {
      showErrorMessage(`Failed to delete info. ${resp.message}`)
    }
  }

  return {
    loading,
    columns,
    rsdInfo,
    addRsdInfo
  }
}
