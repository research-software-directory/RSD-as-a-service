// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {patchOrganisation} from '~/components/organisation/apiEditOrganisation'
import {deleteImage, getImageUrl, upsertImage} from '~/utils/editImage'
import useSnackbar from '~/components/snackbar/useSnackbar'
import Logo from '~/components/layout/Logo'
import useOrganisationContext from '../context/useOrganisationContext'

type OrganisationLogoProps = {
  isMaintainer: boolean
}

export type ImageDataProps = {
  data: string,
  mime_type: string
}

export default function OrganisationLogo({isMaintainer}:OrganisationLogoProps) {
  const {token} = useSession()
  const {id,name,logo_id} = useOrganisationContext()
  const {showErrorMessage} = useSnackbar()
  // currently shown image
  const [logo, setLogo] = useState<string|null>(logo_id ?? null)

  // console.group('OrganisationLogo')
  // console.log('id...', id)
  // console.log('name...', name)
  // console.log('logo_id...', logo_id)
  // console.log('logo...', logo)
  // console.log('isMaintainer...', isMaintainer)
  // console.groupEnd()

  async function addLogo({data, mime_type}: ImageDataProps) {
    // split base64 to use only encoded content
    const b64data = data.split(',')[1]
    const resp = await upsertImage({
      data:b64data,
      mime_type,
      token
    })
    // console.log('addLogo...resp...', resp)
    if (resp.status === 201 && id) {
      // update logo_id reference
      const patch = await patchOrganisation({
        data: {
          id,
          logo_id: resp.message
        },
        token
      })
      if (patch.status === 200) {
        // if we are replacing existing logo
        if (logo !== null && resp.message &&
          logo !== resp.message
        ) {
          // try to remove old logo from db
          // do not await for result
          // NOTE! delete MUST be after patching organisation
          // because we are removing logo_id reference
          deleteImage({
            id: logo,
            token
          })
        }
        setLogo(resp.message)
      } else {
        showErrorMessage(`Failed to upload logo. ${resp.message}`)
      }
    } else {
      showErrorMessage(`Failed to upload logo. ${resp.message}`)
    }
  }

  async function removeLogo() {
    if (logo && token && id) {
      // remove logo_id from organisation
      const resp = await patchOrganisation({
        data: {
          id,
          logo_id: null
        },
        token
      })
      // console.log('removeLogo...',resp)
      if (resp.status === 200) {
        // delete logo without check
        deleteImage({
          id: logo,
          token
        })
        setLogo(null)
      } else {
        showErrorMessage(`Failed to remove logo. ${resp.message}`)
      }
    }
  }

  return (
    <Logo
      name={name ?? ''}
      logo={logo}
      onAddLogo={addLogo}
      onRemoveLogo={removeLogo}
      canEdit={isMaintainer}
      src={getImageUrl(logo) ?? undefined}
      sx={{
        backgroundColor: logo ? 'inherit' : 'text.disabled',
        height: '10rem',
        'img': {
          objectFit: 'contain',
          objectPosition: 'center'
        }
      }}
    />
  )
}
