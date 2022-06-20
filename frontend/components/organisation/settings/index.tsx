// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {useForm} from 'react-hook-form'

import {Session} from '../../../auth'
import useSnackbar from '../../snackbar/useSnackbar'
import ControlledTextField from '../../form/ControlledTextField'
import {OrganisationForOverview} from '../../../types/Organisation'
import {EditOrganisation} from '../../../types/Organisation'
import {updateOrganisation} from '../../../utils/editOrganisation'
import {organisationInformation as config} from '../organisationConfig'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import RorIdWithUpdate from './RorIdWithUpdate'
import useOrganisationSettings from './useOrganisationSettings'

const formId='organisation-settings-form'

export default function OrganisationSettings({organisation, session}:
  { organisation: OrganisationForOverview, session: Session }) {
  const {showErrorMessage, showSuccessMessage} = useSnackbar()
  const {loading, settings} = useOrganisationSettings({
    uuid: organisation.id,
    token: session.token
  })
  const {handleSubmit, watch, formState, reset, control, register, setValue} = useForm<EditOrganisation>({
    mode: 'onChange',
    defaultValues: {
      ...organisation
    }
  })
  // extract
  const {isValid, isDirty} = formState
  const formData = watch()

  useEffect(() => {
    if (settings && loading==false) {
      reset(settings)
    }
  }, [settings,loading,reset])

  function isSaveDisabled() {
    // if pos is undefined we are creating
    // new entry, but we might already have required
    // information (first name - last name). In this
    // case we only check if form is valid
    if (isValid === false) return true
    if (isDirty === false) return true
    return false
  }

  async function onSubmit(data: EditOrganisation) {
    // console.log('submit...', data)
    if (data && data.id) {
      const resp = await updateOrganisation({
        item: data,
        token: session.token
      })
      // debugger
      if (resp.status === 200) {
        showSuccessMessage(`Saved ${data.name} settings.`)
        reset(data)
      } else {
        showErrorMessage(`Failed to save. ${resp.message}`)
      }
    } else {
      showErrorMessage('Failed to save. Organisation UUID is missing.')
    }
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      {/* hidden inputs */}
      <input type="hidden"
        {...register('id')}
      />
      <input type="hidden"
        {...register('parent')}
      />
      <section className="flex justify-between align-center">
        <h2>Settings</h2>
        <SubmitButtonWithListener
          formId={formId}
          disabled={isSaveDisabled()}
        />
      </section>
      <div className="flex pt-8"></div>
      <section className="grid grid-cols-[1fr,1fr] gap-8">
        <ControlledTextField
          control={control}
          options={{
            name: 'name',
            // variant: 'outlined',
            label: config.name.label,
            useNull: true,
            defaultValue: formData?.name,
            helperTextMessage: config.name.help,
            helperTextCnt: `${formData?.name?.length || 0}/${config.name.validation.maxLength.value}`,
          }}
          rules={config.name.validation}
        />
        <div>
          <RorIdWithUpdate
            control={control}
            setValue={setValue}
          />
        </div>
      </section>
      <div className="py-4"></div>
      <ControlledTextField
        control={control}
        options={{
          name: 'website',
          // variant: 'outlined',
          label: config.website.label,
          useNull: true,
          defaultValue: formData?.website,
          helperTextMessage: config.website.help,
          helperTextCnt: `${formData?.website?.length || 0}/${config.website.validation.maxLength.value}`,
        }}
        rules={config.website.validation}
      />
    </form>
  )
}
