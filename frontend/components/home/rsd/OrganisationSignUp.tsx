// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {config} from './config'
import OrganisationSignUpButton from './OrganisationSignUpButton'
import OrganisationSignUpDialog from './OrganisationSignUpDialog'

export default function OrganisationSignUp({minWidth = '9rem'}:{minWidth:string}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <OrganisationSignUpButton
        onClick={setOpen}
        minWidth={minWidth}
        label={config.button.register.label}
      />
      {open &&
        <OrganisationSignUpDialog
          title={config.button.register.label}
          onClose={() => setOpen(false)}
          open={open}
        />
      }
    </>
  )
}
