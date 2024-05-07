// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'
import Switch from '@mui/material/Switch'
import Input from '@mui/material/Input'

import RsdUsersList from './RsdUsersList'
import FormControlLabel from '@mui/material/FormControlLabel'

const digitsOnlyPattern = new RegExp('^\\d+$')

export default function RsdUsersPage() {
  const [adminsOnly, setAdminsOnly] = useState<boolean>(false)
  const [inactiveDays, setInactiveDays] = useState<number>(0)
  const [inactiveDaysError, setInactiveDaysError] = useState<boolean>(false)

  function handleAdminsOnlyChange(event : React.ChangeEvent<HTMLInputElement>) {
    setAdminsOnly(event.target.checked)
  }

  function handleInactiveDaysChange(event : React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) {
      setInactiveDays(0)
      setInactiveDaysError(false)
    } else if (!digitsOnlyPattern.test(event.target.value)) {
      setInactiveDaysError(true)
    } else {
      setInactiveDays(parseInt(event.target.value))
      setInactiveDaysError(false)
    }
  }

  return (
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
        <Pagination/>
      </div>
      <RsdUsersList adminsOnly={adminsOnly} inactiveDays={inactiveDays}/>
    </section>
  )
}
