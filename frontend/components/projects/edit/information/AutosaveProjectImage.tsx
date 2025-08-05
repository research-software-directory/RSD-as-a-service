// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'

import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import ImageAsBackground from '~/components/layout/ImageAsBackground'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {EditProject} from '~/types/Project'
import {getImageUrl} from '~/utils/editImage'
import AutosaveProjectTextField from './AutosaveProjectTextField'
import AutosaveProjectSwitch from './AutosaveProjectSwitch'
import {projectInformation as config} from './config'
import {patchProjectTable} from './patchProjectInfo'
import {upsertImage,deleteImage} from '~/utils/editImage'
import {ChangeEvent} from 'react'
import {handleFileUpload} from '~/utils/handleFileUpload'
import ImageInput from '~/components/form/ImageInput'
import ImageDropZone from '~/components/form/ImageDropZone'

export default function AutosaveProjectImage() {
  const {token} = useSession()
  const {showWarningMessage, showErrorMessage} = useSnackbar()
  const {watch, setValue, resetField} = useFormContext<EditProject>()

  const [
    form_id, form_image_id, form_image_b64, form_image_mime_type, form_image_caption, form_image_contain
  ] = watch([
    'id', 'image_id', 'image_b64', 'image_mime_type','image_caption','image_contain'
  ])

  async function saveImage(image_b64: string, mime_type: string) {
    // split base64 to use only encoded content
    const data = image_b64.split(',')[1]
    if (form_image_id) {
      const patch = await patchProjectTable({
        id: form_id,
        data: {
          image_id: null
        },
        token
      })
      if (patch.status === 200) {
        // try to remove old image
        // but don't wait for results
        deleteImage({
          id: form_image_id,
          token
        })
      }
    }
    // add new image to db
    const resp = await upsertImage({
      data,
      mime_type,
      token
    })
    if (resp.status !== 201) {
      showErrorMessage(`Failed to save image. ${resp.message}`)
      return
    }
    const patch = await patchProjectTable({
      id:form_id,
      data: {
        image_id:resp.message
      },
      token
    })
    if (patch.status === 200) {
      // setValue works while resetField doesn't, not sure why?
      // setValue('image_b64', image_b64 as string)
      // setValue('image_mime_type', mime_type)
      // remove id for now
      setValue('image_id', resp.message)
      // debugger
    } else {
      showErrorMessage(`Failed to save image. ${resp.message}`)
    }
  }

  async function onFileUpload(e: ChangeEvent<HTMLInputElement> | {target: {files: FileList | Blob[]}} | undefined): Promise<void> {
    if (e === undefined) {
      return
    }

    const {status, message, image_b64, image_mime_type} = await handleFileUpload(e)
    if (status === 200 && image_b64 && image_mime_type) {
      // save image
      saveImage(image_b64,image_mime_type)
    } else if (status===413) {
      showWarningMessage(message)
    } else {
      showErrorMessage(message)
    }
  }

  function imageUrl() {
    if (form_image_b64 && form_image_b64.length > 10) {
      return form_image_b64
    }
    if (form_image_id && form_image_id.length > 10) {
      return getImageUrl(form_image_id)
    }
    return null
  }

  async function removeImage() {
    // remove image
    const resp = await patchProjectTable({
      id: form_id,
      data: {
        image_id: null,
        image_caption: null,
        image_contain: false
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
        deleteImage({
          id: form_image_id,
          token
        })
        setValue('image_id', null)
      }
      // reset form values
      resetField('image_caption', {defaultValue: null})
      resetField('image_contain', {defaultValue: false})
    } else {
      showErrorMessage(`Failed to remove image. ${resp.message}`)
      return
    }
  }

  function renderImageAttributes() {
    // debugger
    if (form_image_b64 === null && form_image_id === null) {
      return null
    }
    return (
      <>
        <div className="flex pt-4">
          <AutosaveProjectTextField
            project_id={form_id}
            options={{
              name: 'image_caption',
              label: 'Image caption',
              defaultValue: form_image_caption,
              useNull: true,
              muiProps:{
                autoComplete: 'off',
                variant: 'outlined',
                sx: {
                  width: '100%',
                  '& .MuiInput-root:before':{
                    border: '2px transparent'
                  }
                }
              }
            }}
          />

          <div className="flex items-center pl-4">
            <IconButton
              color="primary"
              aria-label="remove picture"
              component="span"
              title="Delete image"
              onClick={removeImage}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>

        <div className="flex pb-3">
          <AutosaveProjectSwitch
            project_id={form_id}
            name='image_contain'
            label={config.image_contain.label}
            defaultValue={form_image_contain}
          />
        </div>
      </>
    )
  }

  return (
    <div>
      <ImageDropZone onImageDrop={onFileUpload}>
        <label htmlFor="upload-avatar-image"
          style={{cursor: 'pointer'}}
          title="Click or drop to upload an image"
        >
          <ImageAsBackground
            src={imageUrl()}
            alt={form_image_caption ?? 'image'}
            bgSize={form_image_contain ? 'contain' : 'cover'}
            bgPosition={form_image_contain ? 'center' : 'center center'}
            className="w-full h-[23rem]"
            noImgMsg="Click or drop to upload image < 2MB"
          />
        </label>
      </ImageDropZone>

      <ImageInput
        id="upload-avatar-image"
        onChange={onFileUpload}
      />

      {renderImageAttributes()}

    </div>
  )
}
