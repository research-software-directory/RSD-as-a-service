// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import AddRsdInfo from './AddRsdInfo'
import {RsdInfo} from './apiRsdInfo'

export default function NoRsdInfoAlert({addRsdInfo}:Readonly<{addRsdInfo:(data:RsdInfo)=>void}>) {
  return (
    <section className="pr-4 flex-1 flex gap-4 items-center justify-between">
      <Alert severity="warning"
        sx={{
          marginTop: '0.5rem'
        }}
      >
        <AlertTitle sx={{fontWeight:500}}>RSD info not found</AlertTitle>
        Use <strong>Add</strong> button to create new entry. At least you should add <strong>remote_name</strong> to communicate name of your instance to other RSD instances.
      </Alert>
      <AddRsdInfo onAdd={addRsdInfo} />
    </section>
  )
}
