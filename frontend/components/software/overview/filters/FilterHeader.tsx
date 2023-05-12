// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'

type FilterHeaderProps = {
  filterCnt: number
  resetFilters: () => void
}

export default function FilterHeader({filterCnt,resetFilters}:FilterHeaderProps) {
  return (
    <div className="flex justify-between">
      <div className="flex justify-center items-center gap-2 mr-12">
        <span
          className="rounded-full bg-gray-100 h-8 w-8 flex items-center justify-center font-semibold">
          {filterCnt}
        </span>
        {filterCnt===1 ? 'Filter' : 'Filters'}
      </div>

      <Button
        size="small"
        onClick={resetFilters}
        disabled={filterCnt === 0}
        variant="outlined"
        color="primary"
      >
        Clear
      </Button>
    </div>
  )
}
