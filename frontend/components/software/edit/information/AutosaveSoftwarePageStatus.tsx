// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import {useFormContext} from 'react-hook-form'

import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {softwareInformation as config} from '../editSoftwareConfig'
import AutosaveSoftwareSwitch from './AutosaveSoftwareSwitch'

export default function AutosaveSoftwarePageStatus() {
  const {watch} = useFormContext()
  const [id, is_published] = watch(['id', 'is_published'])

  // console.group('AutosaveSoftwarePageStatus')
  // console.log('id...', id)
  // console.log('is_published...', is_published)
  // console.groupEnd()

  return (
    <>
      <EditSectionTitle
        title={config.pageStatus.title}
        subtitle={config.pageStatus.subtitle}
      />
      <div className="flex">
        <AutosaveSoftwareSwitch
          software_id={id}
          name='is_published'
          label={config.is_published.label}
          defaultValue={is_published}
        />
      </div>
      <Alert
        severity="info"
        sx={{
          marginTop:'1rem'
        }}
      >
        <AlertTitle>Publishing software page</AlertTitle>
        Setting the page status to published will expose the software page to all visitors.
        Unpublished software can be found under <strong>
          <Link href="/user/software">your profile</Link>
        </strong> page.
      </Alert>
    </>
  )
}
