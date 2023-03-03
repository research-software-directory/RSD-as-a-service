// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import EditSectionTitle from '~/components/layout/EditSectionTitle'

export default function AddOrcidUser({onSubmitOrcid}:{onSubmitOrcid:Function}) {
  return (
    <div>
      <EditSectionTitle title={'Add an ORCID user'} />
      <div className='py-2'></div>
      <form onSubmit={(e) => {
        e.preventDefault()
        onSubmitOrcid()
      }}>
        <TextField
          id="orcid-input"
          variant="standard"
          autoComplete='off'
          placeholder="0000-0000-0000-0000"
          helperText="Provide valid orcid"
          inputProps={{pattern: '^\\d{4}-\\d{4}-\\d{4}-\\d{3}[0-9X]$'}}
          required
        />
        <Button variant="text" type='submit'>Add user</Button>
      </form>
    </div>
  )
}
