// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext} from 'react-hook-form'
import {EditSoftwareItem} from '~/types/SoftwareTypes'

import EditSectionTitle from '~/components/layout/EditSectionTitle'
import AutosaveSoftwareTextField from '~/components/software/edit/information/AutosaveSoftwareTextField'
import {config} from './config'

export default function GetStartedUrl() {
  // use form context to interact with form data
  const {watch} = useFormContext<EditSoftwareItem>()
  // watch form data changes
  const [id, get_started_url] = watch(['id', 'get_started_url'])

  return (
    <>
      <EditSectionTitle
        title='Get started'
        subtitle='Link to a webpage explaining how to use this software.'
      />
      <AutosaveSoftwareTextField
        software_id={id}
        options={{
          name: 'get_started_url',
          label: config.get_started_url.label,
          useNull: true,
          defaultValue: get_started_url,
          helperTextMessage: config.get_started_url.help,
          helperTextCnt: `${get_started_url?.length || 0}/${config.get_started_url.validation.maxLength.value}`,
        }}
        rules={config.get_started_url.validation}
      />
    </>
  )
}
