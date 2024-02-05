// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type UseListPaginationProps<T>={
  items: T[]
  limit: number,
}

export default function useListPagination<T>({items,limit=50}:UseListPaginationProps<T>){
  let selection:T[] = []

  if (limit >= items.length && selection.length < items.length){
    selection = [
      ...items
    ]
  }

  if (limit < items.length && selection.length !== limit){
    selection = items.slice(0,limit)
  }

  // console.group('useListPagination')
  // console.log('items...', items)
  // console.log('selection...', selection)
  // console.log('limit...', limit)
  // console.groupEnd()

  return {
    selection,
    hasMore: selection?.length < items?.length
  }
}
