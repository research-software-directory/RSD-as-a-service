// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import {useSession} from '~/auth'
import {SubmitHandler, UseControllerProps, useController, useForm} from 'react-hook-form'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import {Input, Switch} from '@mui/material'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {GetServerSidePropsContext} from 'next'
import logger from '~/utils/logger'
import {useEffect, useState} from 'react'
import AnnouncementsForm from './AnnouncementsForm'
import ContentLoader from '~/components/layout/ContentLoader'

const formId = 'announcements-form'

type EditAnnouncementItem = {
  [id: string]: any,
  text: string | null,
  enabled: boolean
}


function getData({token}: {token: string}) {
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<EditAnnouncementItem>()

  async function getAnnouncement() {
    const url = getBaseUrl() + '/global_announcement'
    setLoading(true)
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })

    if (resp.status === 200) {
      const json = await resp.json()
      if (json[0]) {
        setItem({
          id: json[0].id,
          enabled: json[0].enabled,
          text: json[0].text
        })
      } else {
        setItem({
          enabled: false,
          text: ''
        })
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    getAnnouncement()
  }, [])

  return {
    formProps: item,
    loading
  }

}


export default function AnnouncementsPage() {
  const {token} = useSession()
  const {formProps, loading} = getData({token})

  if (loading) return (
    <ContentLoader />
  )

  if (formProps) {
    return (
      <AnnouncementsForm data={formProps} />
     )
  }

  return <ContentLoader />
}
