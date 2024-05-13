// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {useSession} from '~/auth'
import {deleteImage,getImageUrl,upsertImage} from '~/utils/editImage'
import LogoAvatar from '~/components/layout/LogoAvatar'
import useSnackbar from '~/components/snackbar/useSnackbar'
import OrganisationLogoMenu from '~/components/organisation/metadata/OrganisationLogoMenu'
import {patchCommunityTable} from '../apiCommunities'

type CommunityLogoProps = {
  id: string,
  name: string,
  logo_id: string | null,
  isMaintainer: boolean
}

export type ImageDataProps = {
  data: string,
  mime_type: string
}

export default function CommunityLogo({id,name,logo_id,isMaintainer}:CommunityLogoProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  // currently shown image
  const [logo, setLogo] = useState<string|null>(logo_id)

  // console.group('CommunityLogo')
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
      const patch = await patchCommunityTable({
        id,
        data: {
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
      const resp = await patchCommunityTable({
        id,
        data: {
          logo_id: null
        },
        token
      })
      // console.log('removeLogo...',resp)
      if (resp.status === 200) {
        // delete logo without check
        const del = await deleteImage({
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
    <>
      <LogoAvatar
        name={name ?? ''}
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
      {isMaintainer &&
        <OrganisationLogoMenu
          logo={logo}
          onAddLogo={addLogo}
          onRemoveLogo={removeLogo}
        />
      }
    </>
  )

}
