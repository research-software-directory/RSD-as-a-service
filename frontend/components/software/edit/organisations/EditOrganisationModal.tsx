// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent, useEffect} from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import DeleteIcon from '@mui/icons-material/Delete'
import {useForm} from 'react-hook-form'

import {useSession} from '~/auth'
import useSnackbar from '../../../snackbar/useSnackbar'
import ControlledTextField from '../../../form/ControlledTextField'
import {EditOrganisation} from '../../../../types/Organisation'
import {organisationInformation as config} from '../editSoftwareConfig'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {deleteImage, getImageUrl} from '~/utils/editImage'
import {handleFileUpload} from '~/utils/handleFileUpload'

type EditOrganisationModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: { data: EditOrganisation, pos?: number }) => void,
  // onDeleteLogo: (logo_id:string) => void,
  organisation?: EditOrganisation,
  // item position in the array
  pos?: number
}

const formId='edit-organisation-modal'

export default function EditOrganisationModal({open, onCancel, onSubmit, organisation, pos}: EditOrganisationModalProps) {
  const {token} = useSession()
  const {showWarningMessage,showErrorMessage} = useSnackbar()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, reset, control, register, setValue, trigger} = useForm<EditOrganisation>({
    mode: 'onChange',
    defaultValues: {
      ...organisation
    }
  })

  // extract
  const {isValid, isDirty, isSubmitSuccessful} = formState
  const formData = watch()

  // console.group('EditOrganisationModal')
  // console.log('formData...', formData)
  // console.log('isValid...', isValid)
  // console.log('errors...', errors)
  // console.log('isSubmitSuccessful...', isSubmitSuccessful)
  // console.groupEnd()

  useEffect(() => {
    setTimeout(() => {
      // validate name on opening of the form
      // we validate organisation name because we take it
      // over from ROR or user input (which might not be valid entry)
      // it needs to be at the end of the cicle, so we need to use setTimeout
      trigger('name')
    }, 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    if (isSubmitSuccessful) {
      // console.group('EditOrganisationModal')
      // console.log('reset form...', isSubmitSuccessful)
      // console.groupEnd()
      reset()
    }
  }, [isSubmitSuccessful,reset])

  function handleCancel() {
    // hide
    onCancel()
  }

  async function onFileUpload(e:ChangeEvent<HTMLInputElement>|undefined) {
    if (typeof e !== 'undefined') {
      const {status, message, image_b64, image_mime_type} = await handleFileUpload(e)
      if (status === 200 && image_b64 && image_mime_type) {
        // save image
        replaceLogo(image_b64,image_mime_type)
      } else if (status===413) {
        showWarningMessage(message)
      } else {
        showErrorMessage(message)
      }
    }
  }

  async function replaceLogo(logo_b64:string, logo_mime_type:string) {
    if (formData.logo_id) {
      // remove old logo from db
      const del = await deleteImage({
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
      // remove old logo from db
      const del = await deleteImage({
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
        Organisation
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
          {...register('slug')}
        />
        <input type="hidden"
          {...register('position')}
        />
        <input type="hidden"
          {...register('logo_id')}
        />
        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem'
        }}>
          <section className="grid grid-cols-[1fr,3fr] gap-8">
             <div>
              <label htmlFor="upload-avatar-image"
                  style={{cursor:'pointer'}}
                  title="Click to upload an image"
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
              <input
                id="upload-avatar-image"
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                style={{display:'none'}}
              />
              <div className="flex pt-4">
                <Button
                  title="Remove image"
                  // color='primary'
                  disabled={!formData.logo_b64 && !formData.logo_id}
                  onClick={deleteLogo}
                >
                  remove <DeleteIcon/>
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
                  disabled: organisation?.source==='ROR' ? true : false
                }}
                rules={config.name.validation}
              />
              <div className="py-4"></div>
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
                  disabled: organisation?.source==='ROR' ? true : false
                }}
                rules={config.website.validation}
              />
            </div>
          </section>
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
            formId={formId}
            disabled={isSaveDisabled()}
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
