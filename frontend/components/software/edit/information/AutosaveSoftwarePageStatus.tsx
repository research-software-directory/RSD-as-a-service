// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import EditSectionTitle from '../../../layout/EditSectionTitle'
import AutosaveControlledSwitch from './AutosaveControlledSwitch'
import {softwareInformation as config} from '../editSoftwareConfig'
import {useFormContext} from 'react-hook-form'

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
        <AutosaveControlledSwitch
          software_id={id}
          name='is_published'
          label={config.is_published.label}
          defaultValue={is_published}
        />
      </div>
    </>
  )
}
