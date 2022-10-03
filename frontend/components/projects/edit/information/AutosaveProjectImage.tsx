// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'

import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth'
import ImageAsBackground from '~/components/layout/ImageAsBackground'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {EditProject} from '~/types/Project'
import {getImageUrl} from '~/utils/getProjects'
import logger from '~/utils/logger'
import {addImage, deleteImage, updateImage} from '~/utils/editProject'
import AutosaveProjectTextField from './AutosaveProjectTextField'
import AutosaveControlledSwitch from './AutosaveControlledSwitch'
import {projectInformation as config} from './config'
import {patchProjectTable} from './patchProjectInfo'

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
    let resp
    // split base64 to use only encoded content
    const data = image_b64.split(',')[1]
    if (form_image_id && form_image_id !== null) {
      // update image
      resp = await updateImage({
        project: form_id,
        data,
        mime_type,
        token
      })
    } else {
      // add new image
      resp = await addImage({
        project: form_id,
        data,
        mime_type,
        token
      })
    }
    if (resp.status === 200) {
      // setValue works while resetField doesn't, not sure why?
      setValue('image_b64', image_b64 as string)
      setValue('image_mime_type', mime_type)
      // remove id for now
      setValue('image_id', null)
    } else {
      showErrorMessage(`Failed to save image. ${resp.message}`)
    }
  }

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
          // save image
          saveImage(reader.result as string,file.type)
        }
      }
      reader.readAsDataURL(file)
    } catch (e:any) {
      logger(`ProjectImage.handleFileUpload: ${e.message}`,'error')
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
    let resp = await deleteImage({
      project: form_id,
      token
    })
    if (resp.status === 200) {
      // clear all image values in the form
      if (form_image_b64) setValue('image_b64', null)
      if (form_image_mime_type) setValue('image_mime_type', null)
      if (form_image_id) setValue('image_id', null)
    } else {
      showErrorMessage(`Failed to remove image. ${resp.message}`)
      return
    }
    // reset image attributes
    // we do not show error message on failure
    resp = await patchProjectTable({
      id: form_id,
      data: {
        image_caption: null,
        image_contain: false
      },
      token
    })

    if (resp.status === 200) {
      resetField('image_caption', {defaultValue: null})
      resetField('image_contain',{defaultValue:false})
    } else {
      logger(`AutosaveProjectImage.patchImageCaption failed. ${resp.message}`,'warn')
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
            // no label
            label: '',
            defaultValue: form_image_caption,
            useNull: true,
            muiProps:{
              autoComplete: 'off',
              variant: 'standard',
              placeholder: 'Image caption',
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
        <AutosaveControlledSwitch
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
      <label htmlFor="upload-avatar-image"
        style={{cursor:'pointer'}}
        title="Click to upload an image"
      >
        <ImageAsBackground
          src={imageUrl()}
          alt={form_image_caption ?? 'image'}
          bgSize={form_image_contain ? 'contain' : 'cover'}
          bgPosition={form_image_contain ? 'center' : 'top center'}
          className="w-full h-[23rem]"
          noImgMsg="Click to upload image < 2MB"
        />
      </label>

      <input
        id="upload-avatar-image"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{display:'none'}}
      />

      {renderImageAttributes()}

    </div>
  )
}
