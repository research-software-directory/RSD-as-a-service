// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent} from 'react'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth'
import {handleFileUpload} from '~/utils/handleFileUpload'
import {deleteImage, getImageUrl, upsertImage} from '~/utils/editImage'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import ImageWithPlaceholder from '~/components/layout/ImageWithPlaceholder'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {EditNewsItem, patchNewsTable} from '../apiNews'
import {newsConfig as config} from './config'
import CopyToClipboard from '~/components/layout/CopyToClipboard'


export default function AutosaveNewsImage() {
  const {token} = useSession()
  const {showWarningMessage, showErrorMessage, showInfoMessage} = useSnackbar()
  const {watch, setValue} = useFormContext<EditNewsItem>()

  const [
    form_id, form_image_id, form_image_b64, form_image_mime_type
  ] = watch([
    'id', 'image_id', 'image_b64', 'image_mime_type'
  ])

  function imageUrl() {
    if (form_image_b64 && form_image_b64.length > 10) {
      return form_image_b64
    }
    if (form_image_id && form_image_id.length > 10) {
      return getImageUrl(form_image_id)
    }
    return null
  }

  async function saveImage(image_b64: string, mime_type: string) {
    let resp
    // split base64 to use only encoded content
    const data = image_b64.split(',')[1]
    if (form_image_id) {
      const patch = await patchNewsTable({
        id: form_id,
        data: {
          image_id: null
        },
        token
      })
      if (patch.status === 200) {
        // try to remove old image
        // but don't wait for results
        const del = await deleteImage({
          id: form_image_id,
          token
        })
      }
    }
    // add new image to db
    resp = await upsertImage({
      data,
      mime_type,
      token
    })
    if (resp.status !== 201) {
      showErrorMessage(`Failed to save image. ${resp.message}`)
      return
    }
    const patch = await patchNewsTable({
      id:form_id,
      data: {
        image_id:resp.message
      },
      token
    })
    if (patch.status === 200) {
      // save value
      setValue('image_id', resp.message)
    } else {
      showErrorMessage(`Failed to save image. ${resp.message}`)
    }
  }

  async function removeImage() {
    // remove image
    const resp = await patchNewsTable({
      id: form_id,
      data: {
        image_id: null,
      },
      token
    })
    if (resp.status === 200) {
      // clear all image values in the form
      if (form_image_b64) setValue('image_b64', null)
      if (form_image_mime_type) setValue('image_mime_type', null)
      if (form_image_id) {
        // try to remove old image
        // but don't wait for results
        const del = await deleteImage({
          id: form_image_id,
          token
        })
        setValue('image_id', null)
      }
    } else {
      showErrorMessage(`Failed to remove image. ${resp.message}`)
      return
    }
  }

  async function onFileUpload(e:ChangeEvent<HTMLInputElement>|undefined) {
    if (typeof e !== 'undefined') {
      const {status, message, image_b64, image_mime_type} = await handleFileUpload(e)
      if (status === 200 && image_b64 && image_mime_type) {
        saveImage(image_b64, image_mime_type)
      } else if (status===413) {
        showWarningMessage(message)
      } else {
        showErrorMessage(message)
      }
    }
  }

  function markdownLink(){
    const imgUrl = imageUrl()
    if (imgUrl){
      const link = `![image](${imgUrl})`
      return link
    }
    return null
  }

  function onCopiedLink(success:boolean){
    if (success){
      showInfoMessage('Copied to clipboard')
    }else{
      showErrorMessage('Failed to copy image link')
    }
  }

  function renderImageAttributes() {
    // debugger
    if (form_image_b64 === null && form_image_id === null) {
      return null
    }
    return (
      <div className="flex gap-4 justify-between py-4">
        <Button
          startIcon={<DeleteIcon />}
          onClick={removeImage}
          aria-label="Delete image"
        >
          Delete image
        </Button>
        <CopyToClipboard
          label="Copy link"
          value={markdownLink()}
          onCopied={onCopiedLink}
        />
      </div>
    )
  }

  return (
    <>
      <EditSectionTitle
        title={config.image.label}
        subtitle={config.image.help}
      />

      <label htmlFor='upload-article-image'
        style={{cursor: 'pointer'}}
        title="Click to upload an image"
      >
        <ImageWithPlaceholder
          placeholder="Click to upload image < 2MB"
          src={imageUrl()}
          alt={'image'}
          bgSize={'cover'}
          bgPosition={'left center'}
          className="w-full h-[9rem]"
        />
      </label>

      <input
        id="upload-article-image"
        type="file"
        accept="image/*"
        onChange={onFileUpload}
        style={{display:'none'}}
      />

      {renderImageAttributes()}
    </>
  )
}
