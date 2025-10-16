// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'
import Switch from '@mui/material/Switch'
import Input from '@mui/material/Input'
import FormControlLabel from '@mui/material/FormControlLabel'

import {defaultPagination, rowsPerPageOptions} from '~/config/pagination'
import {useUserSettings} from '~/config/UserSettingsContext'
import Pagination from '~/components/pagination/Pagination'
import {PaginationProvider} from '~/components/pagination/PaginationContext'
import Searchbox from '~/components/search/Searchbox'
import {SearchProvider} from '~/components/search/SearchContext'
import RsdUsersList from './RsdUsersList'

const digitsOnlyPattern = new RegExp('^\\d+$')

export default function AdminRsdUsersPage() {
  const {rsd_page_rows} = useUserSettings()
  const [adminsOnly, setAdminsOnly] = useState<boolean>(false)
  const [lockedOnly, setLockedOnly] = useState<boolean>(false)
  const [inactiveDays, setInactiveDays] = useState<number>(0)
  const [inactiveDaysError, setInactiveDaysError] = useState<boolean>(false)
  const pagination = {
    ...defaultPagination,
    rows: rsd_page_rows ?? rowsPerPageOptions[0]
  }

  function handleAdminsOnlyChange(event : React.ChangeEvent<HTMLInputElement>) {
    setAdminsOnly(event.target.checked)
  }

  function handleLockedOnlyChange(event : React.ChangeEvent<HTMLInputElement>) {
    setLockedOnly(event.target.checked)
  }

  function handleInactiveDaysChange(event : React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setInactiveDays(0)
      setInactiveDaysError(false)
    } else if (!digitsOnlyPattern.test(event.target.value)) {
      setInactiveDaysError(true)
    } else {
      setInactiveDays(Number.parseInt(event.target.value))
      setInactiveDaysError(false)
    }
  }

  return (
    <SearchProvider>
      <PaginationProvider pagination={pagination}>
        <section className="flex-1">
          <div className="flex flex-wrap items-center justify-end gap-4">
            <Searchbox/>
            <Input
              type="number"
              error={inactiveDaysError}
              placeholder="Last login (days)"
              onChange={handleInactiveDaysChange}
              className="max-w-[9rem]"
            />
            <FormControlLabel
              label="Admin"
              control={
                <Switch
                  onChange={handleAdminsOnlyChange}
                />
              }
            />
            <FormControlLabel
              label="Locked"
              control={
                <Switch
                  onChange={handleLockedOnlyChange}
                />
              }
            />
            <Pagination/>
          </div>
          <RsdUsersList adminsOnly={adminsOnly} lockedOnly={lockedOnly} inactiveDays={inactiveDays}/>
        </section>
      </PaginationProvider>
    </SearchProvider>
  )
}
