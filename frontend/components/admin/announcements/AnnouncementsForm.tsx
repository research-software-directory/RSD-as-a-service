// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useForm} from 'react-hook-form'
import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import ControlledTextField from '~/components/form/ControlledTextField'
import {AnnouncementItem, saveAnnouncement} from './apiAnnouncement'

const formId = 'announcements-form'

export default function AnnouncementsForm({data}: {data: AnnouncementItem|null}) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {handleSubmit, register, control, reset, formState} = useForm<AnnouncementItem>({
    defaultValues: {
      ...data
    },
    mode: 'onChange'
  })

  // track form state
  const {isValid, isDirty} = formState

  async function onSubmit(item: AnnouncementItem) {
    const resp = await saveAnnouncement({
      id: item.id,
      enabled: item.enabled,
      text: item.text
    }, token)

    if (resp.status === 200) {
      // use values returned from api
      const update = {
        id: resp.message?.id ?? true,
        enabled: resp.message.enabled ?? false,
        text: resp.message.text ?? null
      }
      // will reset form state
      reset(update)
    } else {
      showErrorMessage(`Failed to save announcement. ${resp.message}`)
    }
  }

  function isSaveDisabled() {
    if (isValid === false) return true
    if (isDirty === false) return true
    return false
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1"
    >
      {/* id */}
      <input type="hidden" {...register('id')} />
      {/* active/visible */}
      <ControlledSwitch
        label='Visible'
        name='enabled'
        control={control}
      />
      <div className="flex justify-between items-center gap-8 py-4">
        <ControlledTextField
          control={control}
          options={{
            name: 'text',
            label: 'Announcement',
            multiline: true
          }}
          rules={{
            required: 'Announcement text is required',
            minLength: {
              value: 3,
              message: 'Minimum length is 3.'
            },
            maxLength: {
              value: 2000,
              message: 'Maximum length is 2000.'
            }
          }}
        />
        <SubmitButtonWithListener
          disabled={isSaveDisabled()}
          formId={formId}
        />
      </div>
    </form>
  )
}
