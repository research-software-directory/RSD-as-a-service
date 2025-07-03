// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import {app} from '~/config/app'
import DefaultLayout from '~/components/layout/DefaultLayout'
import PageTitle from '~/components/layout/PageTitle'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'

export default function CoupleLocal() {
  const pageTitle = `Couple local account | ${app.title}`

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <PageTitle title="Couple local account">
      </PageTitle>
      <ContentInTheMiddle>
        <form action="/auth/couple/local" method="post">
          <TextField required slotProps={{htmlInput: {pattern: '\\w+'}}} id="username-field" label="Username" variant="standard" name="sub"/>
          <Button variant="contained" type='submit'>Login</Button>
        </form>

      </ContentInTheMiddle>
    </DefaultLayout>
  )
}
