// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

const useProjectParams=jest.fn(()=>{
  // useEffect re-renders in api hooks
  const params = {
    search: null,
    order: null,
    rows: 12,
    page: 1,
    project_status: null,
    keywords_json: null,
    domains_json: null,
    organisations_json: null,
    categories_json: null
  }

  // if masonry we change to grid
  const view = 'grid'

  function getFilterCount() {
    let count = 0
    if (params?.search) count++
    if (params?.project_status) count++
    if (params?.keywords_json) count++
    if (params?.domains_json) count++
    if (params?.organisations_json) count++
    if (params?.categories_json) count++
    return count
  }

  const filterCnt = getFilterCount()

  // console.group('useProjectParams')
  // console.log('params...', params)
  // console.log('rsd_page_rows...', rsd_page_rows)
  // console.groupEnd()

  // return these
  return {
    ...params,
    filterCnt,
    view
  }
})

export default useProjectParams
