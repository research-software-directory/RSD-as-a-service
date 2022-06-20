// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'

import {useFormContext} from 'react-hook-form'

import ControlledTextInput from '~/components/form/ControlledTextInput'
import ImageAsBackground from '~/components/layout/ImageAsBackground'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {EditProject} from '~/types/Project'
import {getImageUrl} from '~/utils/getProjects'
import logger from '~/utils/logger'

export default function ProjectImage() {
  const {showWarningMessage} = useSnackbar()
  const {control, watch, setValue} = useFormContext<EditProject>()

  const formData = watch()

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
          setValue('image_b64', reader.result as string)
          setValue('image_mime_type', file.type,{shouldDirty: true})
        }
      }
      reader.readAsDataURL(file)
    } catch (e:any) {
      logger(`ProjectImage.handleFileUpload: ${e.message}`,'error')
    }
  }

  function imageUrl() {
    if (formData?.image_b64 && formData?.image_b64?.length > 10) {
      return formData?.image_b64
    }
    if (formData?.image_id && formData?.image_id.length > 10) {
      return getImageUrl(formData.image_id)
    }
    return null
  }

  function removeImage() {
    if (formData.image_b64) setValue('image_b64', null)
    if (formData.image_mime_type) setValue('image_mime_type', null)
    if (formData.image_id) setValue('image_id', null,{shouldDirty:true})
  }

  function isCaptionDisabled() {
    if (formData.image_b64 === null && formData.image_id === null) {
      return true
    }
    return false
  }

  return (
    <div>
      <label htmlFor="upload-avatar-image"
        style={{cursor:'pointer'}}
        title="Click to upload an image"
      >
        <ImageAsBackground
          src={imageUrl()}
          alt={formData.image_caption ?? 'image'}
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
      <div className="flex">
        <ControlledTextInput
          name="image_caption"
          defaultValue={formData.image_caption}
          control={control}
          muiProps={{
            autoComplete: 'off',
            variant: 'standard',
            placeholder: 'Image caption',
            // disabled: isCaptionDisabled(),
            sx: {
              // margin:'0.25rem 0rem 0.5rem 0rem',
              width: '100%',
              // '& .MuiInput-root': {
              //   fontSize: '0.825rem',
              // },
              '& .MuiInput-root:before':{
                border: '2px transparent'
              }
            }
          }}
        />
        <div className="flex pl-4">
          <IconButton
            color="primary"
            aria-label="remove picture"
            component="span"
            title="Delete image"
            onClick={removeImage}
            disabled={isCaptionDisabled()}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
