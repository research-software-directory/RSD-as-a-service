// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent, useEffect, useState} from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import {useSession} from '~/auth'
import useSnackbar from '../../snackbar/useSnackbar'
import {patchOrganisation} from '../../../utils/editOrganisation'
import LogoAvatar from '~/components/layout/LogoAvatar'
import IconButton from '@mui/material/IconButton'
import {deleteImage, getImageUrl, upsertImage} from '~/utils/editImage'
import {handleFileUpload} from '~/utils/handleFileUpload'

type OrganisationLogoProps = {
  id: string
  logo_id: string | null
  name: string
  isMaintainer: boolean
}

export default function OrganisationLogo({id,name,logo_id,isMaintainer}:
  OrganisationLogoProps) {
  const {token} = useSession()
  const {showWarningMessage,showErrorMessage} = useSnackbar()
  // currently shown image
  const [logo, setLogo] = useState<string|null>(null)

  // console.group('OrganisationLogo')
  // console.log('id...', id)
  // console.log('name...', name)
  // console.log('logo_id...', logo_id)
  // console.log('logo...', logo)
  // console.log('isMaintainer...', isMaintainer)
  // console.groupEnd()

  // Update logo when new value
  // received from parent
  useEffect(() => {
    if (logo_id) setLogo(logo_id)
  },[logo_id])

  async function onFileUpload(e:ChangeEvent<HTMLInputElement>|undefined) {
    if (typeof e !== 'undefined') {
      const {status, message, image_b64, image_mime_type} = await handleFileUpload(e)
      if (status === 200 && image_b64 && image_mime_type) {
        addLogo({
          data: image_b64,
          mime_type: image_mime_type
        })
      } else if (status===413) {
        showWarningMessage(message)
      } else {
        showErrorMessage(message)
      }
    }
  }

  async function addLogo({data, mime_type}: { data: string, mime_type: string }) {
    // split base64 to use only encoded content
    const b64data = data.split(',')[1]
    const resp = await upsertImage({
      data:b64data,
      mime_type,
      token
    })
    // console.log('addLogo...resp...', resp)
    if (resp.status === 201) {
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
    if (logo && token) {
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

  function renderAvatar() {
    return (
      <LogoAvatar
        name={name}
        src={getImageUrl(logo) ?? undefined}
      />
    )
  }

  if (isMaintainer) {
    return (
      <div className="pt-12 pb-2 flex relative">
        {renderAvatar()}
        <div style={{
          position: 'absolute',
          top: '0rem',
          right: '0rem'
        }}>
          <label htmlFor="upload-avatar-image"
            // style={{cursor:'pointer'}}
            title="Click to upload an image"
          >
            <input
              data-testid="organisation-logo-input"
              id="upload-avatar-image"
              type="file"
              accept="image/*"
              onChange={onFileUpload}
              style={{display:'none'}}
            />
            <IconButton
              title="Change logo"
              component="span"
              sx={{
                marginRight:'0.25rem'
              }}
              >
              <EditIcon />
            </IconButton>
          </label>
          <IconButton
            title="Remove logo"
            // color='primary'
            disabled={logo===null}
            onClick={removeLogo}
          >
            <DeleteIcon/>
          </IconButton>
        </div>
      </div>
    )
  }

  return renderAvatar()
}
