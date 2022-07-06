// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import useSnackbar from '../../snackbar/useSnackbar'
import {deleteOrganisationLogo, getUrlFromLogoId, uploadOrganisationLogo} from '../../../utils/editOrganisation'
import logger from '../../../utils/logger'
import Link from 'next/link'
import LogoAvatar from '~/components/layout/LogoAvatar'
import IconButton from '@mui/material/IconButton'

type OrganisationLogoProps = {
  id: string
  logo_id: string | null
  name: string
  website: string | null
  isMaintainer: boolean
  token?: string
}

type LogoProps = {
  id: string | null
  b64: string | null
  mime_type: string | null
}

export default function OrganisationLogo({id,name,website,logo_id,isMaintainer,token}:
  OrganisationLogoProps) {
  const {showWarningMessage,showErrorMessage} = useSnackbar()
  // currently shown image
  // after new upload uses b64 prop
  const [logo, setLogo] = useState<LogoProps>({
    id: logo_id,
    b64: null,
    mime_type: null
  })
  // new to upload image
  const [upload, setUpload] = useState<LogoProps>({
    id: null,
    b64: null,
    mime_type:null
  })

  useEffect(() => {
    if (id) {
      setLogo({
        id: logo_id,
        b64: null,
        mime_type: null
      })
    }
  },[id,logo_id])


  useEffect(() => {
    let abort = false
    async function uploadLogo({id, b64, mime_type, token}:
      {id: string, b64: string, mime_type: string, token: string }) {
      const resp = await uploadOrganisationLogo({
        id,
        // send just b64 data
        data:b64.split(',')[1],
        mime_type,
        token
      })
      if (abort) return
      // update local state
      setLogo({
        id,
        b64,
        mime_type
      })
    }
    if (upload.id && upload.b64 && upload.mime_type && token) {
      uploadLogo({
        id: upload.id,
        b64: upload.b64,
        mime_type: upload.mime_type,
        token
      })
    }
    return ()=>{abort=true}
  },[upload,token])

  function handleFileUpload({target}:{target: any}) {
    try {
      let file = target.files[0]
      if (typeof file == 'undefined') return
      // check file size
      if (file.size > 2097152) {
        // file is to large > 2MB
        showWarningMessage('The file is too large. Please select image < 2MB.')
        return
      }
      let reader = new FileReader()
      reader.onloadend = function () {
        if (reader.result) {
          // write to new avatar b64
          setUpload({
            id,
            b64: reader.result as string,
            mime_type: file.type
          })
        }
      }
      reader.readAsDataURL(file)
    } catch (e:any) {
      logger(`handleFileUpload: ${e.message}`,'error')
    }
  }

  async function removeLogo() {
    if (logo.id && token) {
      const resp = await deleteOrganisationLogo({
        id: logo.id,
        token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to remove logo. ${resp.message}`)
      } else {
        setLogo({
          id: null,
          b64: null,
          mime_type:null
        })
      }
    }
  }

  function renderAvatar() {
    return (
      <LogoAvatar
        name={name}
        src={logo.b64 ?? getUrlFromLogoId(logo.id) ?? undefined}
      />
    )
  }

  // for the users we add link to organisation website (if present)
  // for the maintainers click on the logo opens the image upload
  function renderLogo() {
    if (website) {
      return (
        <Link href={website} passHref>
          <a target="_blank">
            {renderAvatar()}
          </a>
        </Link>
      )
    }
    return renderAvatar()
  }
  if (isMaintainer) {
    return (
      <div className="py-[4rem] flex relative">
        {renderAvatar()}
        <div className="absolute flex justify-start left-2 bottom-1">
          <label htmlFor="upload-avatar-image"
            // style={{cursor:'pointer'}}
            title="Click to upload an image"
          >
            <input
              id="upload-avatar-image"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
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
            disabled={!logo.b64 && !logo.id}
            onClick={removeLogo}
          >
            <DeleteIcon/>
          </IconButton>
        </div>
      </div>
    )
  }

  return (
    <div className='hidden md:block md:py-[3rem]'>
      {renderLogo()}
    </div>
  )
}
