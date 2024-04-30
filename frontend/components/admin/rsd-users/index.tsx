// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Pagination from '~/components/pagination/Pagination'
import Searchbox from '~/components/search/Searchbox'
import {Switch} from '@mui/material'
import {useState} from 'react'

import RsdUsersList from './RsdUsersList'


export default function RsdUsersPage() {
  const [adminsOnly, setAdminsOnly] = useState<boolean>(false)

  function handleAdminsOnlyChange(event : React.ChangeEvent<HTMLInputElement>) {
    setAdminsOnly(event.target.checked)
  }

  return (
    <section className="flex-1">
      <div className="flex flex-wrap items-center justify-end">
        <Searchbox />
        Admins only: <Switch onChange={handleAdminsOnlyChange} />
        <Pagination />
      </div>
      <RsdUsersList adminsOnly={adminsOnly} />
    </section>
  )
}
