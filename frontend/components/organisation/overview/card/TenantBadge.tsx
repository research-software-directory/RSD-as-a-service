// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import UnpublishedIcon from '@mui/icons-material/Unpublished'

import OrganisationSignUpDialog from '~/components/home/rsd/OrganisationSignUpDialog'

type TenantBadgeProps = {
  is_tenant: boolean
  organisation: string
}

export default function TenantBadge({is_tenant,organisation}: TenantBadgeProps) {
  const [modal,setModal]=useState(false)

  // console.group('TenantBadge')
  // console.log('is_tenant...', is_tenant)
  // console.log('modal...', modal)
  // console.log('organisation...', organisation)
  // console.groupEnd()

  if (is_tenant === true) {
    return (
      <div className="flex items-end text-base-600">
        <Tooltip
          title="Verified organisation"
          placement='top'
          sx={{
            cursor:'default'
          }}
        >
          <CheckCircleOutlineIcon sx={{width:'1.5rem', height:'1.5rem',margin:'0.75rem'}} />
        </Tooltip>
      </div>
    )
  }

  return (
    <div className="flex items-end">
      <Tooltip describeChild
        title="Click here to contact us and claim this organisation."
        placement='top'
        // arrow
      >
        <IconButton
          size='large'
          onClick={(e) => {
            setModal(true)
            e.preventDefault()
          }}>
          <UnpublishedIcon sx={{width:'1.5rem', height:'1.5rem'}} />
        </IconButton>
      </Tooltip>
      {modal &&
        <OrganisationSignUpDialog
          title="Claim an organisation"
          reason={`I would like to become an administrator of ${organisation}.`}
          onClose={() => setModal(false)}
          open={modal}
          initOrg={organisation }
        />
      }
    </div>
  )
}
