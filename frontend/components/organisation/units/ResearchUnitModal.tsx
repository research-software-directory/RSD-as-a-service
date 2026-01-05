// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent, useEffect, useState} from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import DeleteIcon from '@mui/icons-material/Delete'

import {useForm} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '../../snackbar/useSnackbar'
import ControlledTextField from '../../form/ControlledTextField'
import {EditOrganisation} from '~/types/Organisation'
import config from '../settings/general/generalSettingsConfig'
import {deleteImage, getImageUrl} from '~/utils/editImage'
import {handleFileUpload} from '~/utils/handleFileUpload'
import {getSlugFromString} from '~/utils/getSlugFromString'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ImageInput from '~/components/form/ImageInput'
import ImageDropZone from '~/components/form/ImageDropZone'


type EditOrganisationModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: {data: EditOrganisation, pos?: number}) => void,
  // onDeleteLogo: (logo_id:string) => void,
  organisation?: EditOrganisation,
  // item position in the array
  pos?: number
  title?: string
}

const formId='research-unit-modal'

export default function ResearchUnitModal({
  open, onCancel, onSubmit, organisation, pos, title = 'Organisation'
}: EditOrganisationModalProps) {
  const {token} = useSession()
  const {showWarningMessage,showErrorMessage} = useSnackbar()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const [baseUrl, setBaseUrl] = useState('')
  const {
    handleSubmit, watch, formState, reset, control, register, setValue
  } = useForm<EditOrganisation>({
    mode: 'onChange',
    defaultValues: {
      ...organisation
    }
  })

  // extract
  const {isValid, isDirty, errors} = formState
  const formData = watch()

  // console.group('ResearchUnitModal')
  // console.log('isValid...', isValid)
  // console.log('isDirty...', isDirty)
  // console.log('errors...', errors)
  // console.groupEnd()

  useEffect(() => {
    if (typeof location != 'undefined') {
      const baseUrl = location.href.split('?')
      // baseUrl is current location without params
      setBaseUrl(`${baseUrl[0]}/`)
    }
  }, [])

  useEffect(() => {
    if (organisation) {
      reset(organisation)
    }
  }, [organisation, reset])

  useEffect(() => {
    if (formData.name) {
      const organisationSlug = getSlugFromString(formData.name)
      setValue('slug', organisationSlug, {
        shouldValidate: true,
        shouldDirty: true
      })
    }
  },[formData.name, setValue])

  function handleCancel() {
    // hide
    onCancel()
  }

  async function onFileUpload(e: ChangeEvent<HTMLInputElement> | {target: {files: FileList | Blob[]}} | undefined): Promise<void> {
    if (e === undefined) {
      return
    }

    const {status, message, image_b64, image_mime_type} = await handleFileUpload(e)
    if (status === 200 && image_b64 && image_mime_type) {
      replaceLogo(image_b64, image_mime_type)
    } else if (status===413) {
      showWarningMessage(message)
    } else {
      showErrorMessage(message)
    }
  }

  async function replaceLogo(logo_b64:string, logo_mime_type:string) {
    if (formData.logo_id) {
      // remove old logo from db without waiting
      deleteImage({
        id: formData.logo_id,
        token
      })
      setValue('logo_id', null)
    }
    // write new logo to logo_b64
    // we upload the image after submit
    setValue('logo_b64', logo_b64)
    setValue('logo_mime_type', logo_mime_type, {shouldDirty: true})
  }

  async function deleteLogo() {
    if (formData.logo_id) {
      // remove old logo from db without waiting
      deleteImage({
        id: formData.logo_id,
        token
      })
    }
    setValue('logo_id', null)
    setValue('logo_b64', null)
    setValue('logo_mime_type', null, {shouldDirty: true})
  }

  return (
    <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        {title}
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit((data: EditOrganisation) => onSubmit({data, pos}))}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <input type="hidden"
          {...register('parent')}
        />
        <input type="hidden"
          {...register('position')}
        />
        <input type="hidden"
          {...register('logo_id')}
        />
        <DialogContent sx={{
          width: '100%',
          padding: '2rem 1.5rem 2.5rem'
        }}>
          <section className="grid grid-cols-[1fr_3fr] gap-8">
            <div>
              <ImageDropZone onImageDrop={onFileUpload}>
                <label htmlFor="upload-avatar-image-modal"
                  style={{cursor:'pointer'}}
                  title="Click or drop to upload an image"
                >
                  <Avatar
                    alt={formData.name ?? ''}
                    src={formData.logo_b64 ?? getImageUrl(formData?.logo_id) ?? undefined}
                    sx={{
                      width: '8rem',
                      height: '8rem',
                      fontSize: '3rem',
                      marginRight: '0rem',
                      '& img': {
                        height:'auto'
                      }
                    }}
                    variant="square"
                  >
                    {formData.name ? formData.name.slice(0,3) : ''}
                  </Avatar>
                </label>
              </ImageDropZone>
              <ImageInput
                id="upload-avatar-image-modal"
                onChange={onFileUpload}
              />
              <div className="flex pt-4">
                <Button
                  title="Remove image"
                  endIcon={<DeleteIcon/>}
                  // color='primary'
                  disabled={!formData.logo_b64 && !formData.logo_id}
                  onClick={deleteLogo}
                >
                  Remove
                </Button>
              </div>
            </div>
            <div>
              <ControlledTextField
                control={control}
                options={{
                  name: 'name',
                  // variant: 'outlined',
                  label: config.name.label,
                  useNull: true,
                  defaultValue: formData?.name,
                  helperTextMessage: config.name.help,
                  helperTextCnt: `${formData?.name?.length || 0}/${config.name.validation.maxLength.value}`,
                }}
                rules={config.name.validation}
              />
              <div className="py-2"></div>
              <div className="text-xs">{baseUrl}{formData.slug ?? ''}</div>
              <TextField
                autoComplete='off'
                placeholder={config.slug.label}
                variant="standard"
                value={formData.slug ?? ''}
                error={errors?.slug ? true : false}
                helperText={errors?.slug ? errors?.slug?.message : config.slug.help}
                sx={{
                  width:'100%'
                }}
                {...register('slug',config.slug.validation)}
              />
            </div>
          </section>
          <div className="py-2"></div>
          <ControlledTextField
            control={control}
            options={{
              name: 'website',
              // variant: 'outlined',
              label: config.website.label,
              useNull: true,
              defaultValue: formData?.website,
              helperTextMessage: config.website.help,
              helperTextCnt: `${formData?.website?.length || 0}/${config.website.validation.maxLength.value}`,
            }}
            rules={config.website.validation}
          />
        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            tabIndex={1}
            onClick={handleCancel}
            color="secondary"
            sx={{marginRight:'2rem'}}
          >
            Cancel
          </Button>
          <SubmitButtonWithListener
            disabled={isSaveDisabled()}
            formId={formId}
          />
        </DialogActions>
      </form>
    </Dialog>
  )

  function isSaveDisabled() {
    // if pos is undefined we are creating
    // new entry, but we might already have required
    // information (first name - last name). In this
    // case we only check if form is valid
    if (typeof pos == 'undefined') {
      if (isValid === false) return true
    } else {
      if (isValid === false) return true
      if (isDirty === false) return true
    }
    return false
  }
}

