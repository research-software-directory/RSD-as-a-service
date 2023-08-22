// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import {useSession} from '~/auth'
import {Controller, SubmitHandler, UseControllerProps, useController, useForm} from 'react-hook-form'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import {Input, Switch} from '@mui/material'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {GetServerSidePropsContext} from 'next'
import logger from '~/utils/logger'
import {useEffect, useState} from 'react'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import ControlledTextField from '~/components/form/ControlledTextField'

const formId = 'announcements-form'

type EditAnnouncementItem = {
  [id: string]: any,
  text: string | null,
  enabled: boolean
}

type EditAnnouncementFormProps = {
    data: EditAnnouncementItem
}

export default function AnnouncementsForm({data}: EditAnnouncementFormProps) {
  const {token} = useSession()
  const {handleSubmit, register, control, setValue, formState: {errors}} = useForm<EditAnnouncementItem>({
    defaultValues: {
        ...data
    },
    mode: 'onChange'
  })

  function onSubmit(dataToSubmit: EditAnnouncementItem) {
    saveAnnouncement(dataToSubmit).then(
      (resp) => {
        if (resp && [200, 201].includes(resp.status) && resp?.object) {
          const newObj = resp.object[0]
          setValue('enabled', newObj.enabled)
          setValue('id', newObj.id)
          setValue('text', newObj.text)
        } else {
          console.log('Error saving data:', resp)
        }
      }
    )
  }

  async function saveAnnouncement(item: EditAnnouncementItem) {
    try {
      let method
      let url
      if (item.id == '') {
        delete item.id
        method = 'POST'
        url = '/api/v1/global_announcement'
      } else {
        method = 'PATCH'
        url = `/api/v1/global_announcement?id=eq.${item.id}`
      }
      const resp = await fetch(url, {
        method: method,
        headers: {
          ...createJsonHeaders(token),
          Prefer: 'return=representation',
        },
        body: JSON.stringify(item)
      })
      if ([200, 201].includes(resp.status)) {
        return {
          status: 201,
          object: await resp.json()
        }
      }
      // return extractReturnMessage(resp, item.text ?? '')
    } catch (e: any) {
      logger(`saveAnnouncement: ${e?.message}`, 'error')
      return {
        status: 500,
        message: e?.message
      }
    }
  }

  return (
   <form
    id={formId}
    onSubmit={handleSubmit(onSubmit)}
    className="w-full md:w-[42rem]"
   >
    <Input type="hidden" {...register('id')}/>
    <ControlledTextField
      control={control}
      options={{
        name: 'text',
        label: 'Announcement'
      }}
      rules={{
        maxLength: {
          value: 300,
          message: 'Maximum length is 300.'
        }
      }}
    />
    <ControlledSwitch
      label='Visible'
      name='enabled'
      control={control}
    />
    <SubmitButtonWithListener
      disabled={false}
      formId={formId}
    />
   </form>
  )
}
