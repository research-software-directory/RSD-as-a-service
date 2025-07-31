// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {home_config} from './home_config'
import OrganisationSignUpButton from './OrganisationSignUpButton'
import OrganisationSignUpDialog from './OrganisationSignUpDialog'

export default function OrganisationSignUp({minWidth = '9rem'}:{minWidth:string}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <OrganisationSignUpButton
        onClick={setOpen}
        minWidth={minWidth}
        label={home_config.button.register.label}
      />
      {open &&
        <OrganisationSignUpDialog
          title={home_config.button.register.label}
          onClose={() => setOpen(false)}
          open={open}
        />
      }
    </>
  )
}
