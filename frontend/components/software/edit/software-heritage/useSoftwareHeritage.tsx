// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useCallback, useEffect, useState} from 'react'
import {
  deleteSoftwareHeritageItem, getSoftwareHeritageItems, NewSoftwareHeritage,
  patchSoftwareHeritageItem, patchSoftwareHeritageList, postSoftwareHeritage,
  SoftwareHeritageItem
} from './apiSoftwareHeritage'

export default function useSoftwareHeritage({token, software}: {token: string, software: string}) {
  const [swhids,setSwhids]=useState<SoftwareHeritageItem[]>([])
  const [loading,setLoading]=useState(true)

  const getSWH = useCallback(async () => {
    setLoading(true)
    const items = await getSoftwareHeritageItems({
      software,
      token
    })
    setSwhids(items)
    setLoading(false)
  },[software,token])


  useEffect(() => {
    if (token && software) {
      getSWH()
    }
  }, [token, software, getSWH])

  async function saveItem(data: NewSoftwareHeritage) {
    const resp = await postSoftwareHeritage({
      data,
      token
    })
    // debugger
    if (resp.status == 200) {
      // reload package managers
      await getSWH()
    }
    return resp
  }

  async function updateItem(data: SoftwareHeritageItem) {
    // update swhid

    const resp = await patchSoftwareHeritageItem({
      id: data.id,
      key: 'swhid',
      value: data.swhid,
      token
    })
    // debugger
    if (resp.status == 200) {
      // reload package managers
      await getSWH()
    }
    return resp
  }

  async function deleteItem(id: string) {
    if (id) {
      const resp = await deleteSoftwareHeritageItem({
        id,
        token
      })
      if (resp.status !== 200) {
        return resp
      }

      await getSWH()
      return {
        status: 200,
        message: 'OK'
      }
    } else {
      return {
        status: 400,
        message: 'Id is missing'
      }
    }
  }

  async function sortList(items: SoftwareHeritageItem[]) {
    const oldList = {
      ...swhids
    }
    // visually confirm position change
    setSwhids(items)
    // make all request
    const resp = await patchSoftwareHeritageList({
      items,
      token
    })
    if (resp.status !== 200) {
      // revert back in case of error
      setSwhids(oldList)
    }
    // return response
    return resp
  }

  return {
    swhids,
    loading,
    saveItem,
    updateItem,
    sortList,
    deleteItem
  }
}
