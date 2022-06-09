// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, useMediaQuery
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import {useForm} from 'react-hook-form'

import logger from '~/utils/logger'
import {getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'
import {TeamMember} from '~/types/Project'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ControlledTextField from '~/components/form/ControlledTextField'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import ContributorAvatar from '~/components/software/ContributorAvatar'
import ControlledAffiliation from '~/components/form/ControlledAffiliation'
import {cfgTeamMembers as config} from './config'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'

type TeamMemberModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: { data: TeamMember, pos?: number }) => void,
  member?: TeamMember,
  pos?: number
}

const formId='edit-team-member-modal'

export default function TeamMemberModal({open, onCancel, onSubmit, member, pos}: TeamMemberModalProps) {
  const {showErrorMessage} = useSnackbar()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const [b64Image, setB64Image]=useState<string>()
  const {handleSubmit, watch, formState, reset, control, register, setValue} = useForm<TeamMember>({
    mode: 'onChange',
    defaultValues: {
      ...member,
      avatar_b64:null
    }
  })

  // extract
  const {isValid, isDirty} = formState
  const formData = watch()

  useEffect(() => {
    if (member) {
      reset(member)
    }
  }, [member,reset])

  function handleCancel() {
    // reset form
    reset()
    // remove image upload
    setB64Image(undefined)
    // hide
    onCancel()
  }

  function handleFileUpload({target}:{target: any}) {
    try {
      let file = target.files[0]
      if (typeof file == 'undefined') return
      // check file size
      if (file.size > 2097152) {
        // file is to large > 2MB
        showErrorMessage('The file is too large. Please select image < 2MB.')
        return
      }
      let reader = new FileReader()
      reader.onloadend = function () {
        if (reader.result) {
          // write to new avatar b64
          setValue('avatar_b64', reader.result as string)
          setValue('avatar_mime_type', file.type,{shouldDirty: true})
        }
      }
      reader.readAsDataURL(file)
    } catch (e:any) {
      logger(`handleFileUpload: ${e.message}`,'error')
    }
  }

  function getAvatarUrl() {
    if (formData?.avatar_b64 && formData?.avatar_b64?.length > 10) {
      return formData?.avatar_b64
    }
    if (formData?.avatar_url && formData?.avatar_url.length > 10) {
      return formData?.avatar_url
    }
    return ''
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
        Team member
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit((data: TeamMember) => onSubmit({data, pos}))}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <input type="hidden"
          {...register('project')}
        />
        <input type="hidden"
          {...register('avatar_mime_type')}
        />
        <input type="hidden"
          {...register('avatar_b64')}
        />
        <DialogContent sx={{
          width: ['100%', '37rem'],
        }}>
          <section className="grid grid-cols-[1fr,2fr] gap-8">
            <div>
              <label htmlFor="upload-avatar-image"
                  style={{cursor:'pointer'}}
                  title="Click to upload an image"
                >
                <ContributorAvatar
                  size={8}
                  avatarUrl={getAvatarUrl()}
                  displayName={getDisplayName(member ?? {}) ?? ''}
                  displayInitials={getDisplayInitials(member ?? {}) ?? ''}
                />
              </label>
              <input
                id="upload-avatar-image"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{display:'none'}}
              />
              <div className="flex pt-4">
                <Button
                  title="Remove image"
                  // color='primary'
                  disabled={!formData.avatar_b64 && !formData.avatar_url}
                  onClick={() => {
                    if (formData?.avatar_b64) {
                      setValue('avatar_b64', null)
                    }
                    if (formData.avatar_url) {
                      setValue('avatar_url', null)
                    }
                    setValue('avatar_mime_type',null,{shouldDirty: true})
                  }}
                >
                  remove <DeleteIcon/>
                </Button>
              </div>
            </div>
            <div>
              <ControlledTextField
                control={control}
                options={{
                  name: 'given_names',
                  label: config.given_names.label,
                  useNull: true,
                  defaultValue: member?.given_names,
                  helperTextMessage: config.given_names.help,
                  // helperTextCnt: `${formData?.given_names?.length || 0}/${config.given_names.validation.maxLength.value}`,
                }}
                rules={config.given_names.validation}
              />
              <div className="py-4"></div>
              <ControlledTextField
                control={control}
                options={{
                  name: 'family_names',
                  label: config.family_names.label,
                  useNull: true,
                  defaultValue: member?.family_names,
                  helperTextMessage: config.family_names.help,
                  // helperTextCnt: `${formData?.family_names?.length || 0}/${config.family_names.validation.maxLength.value}`,
                }}
                rules={config.family_names.validation}
              />
            </div>
          </section>
          <div className="py-4"></div>
          <section className="py-4 grid grid-cols-[1fr,1fr] gap-8">
            <ControlledTextField
              control={control}
              options={{
                name: 'email_address',
                label: config.email_address.label,
                type: 'email',
                useNull: true,
                defaultValue: member?.email_address,
                helperTextMessage: config.email_address.help,
                // helperTextCnt: `${formData?.email_address?.length || 0}/${config.email_address.validation.maxLength.value}`,
              }}
              rules={config.email_address.validation}
            />

            <ControlledTextField
                options={{
                  name: 'orcid',
                  label: config.orcid.label,
                  useNull: true,
                  defaultValue: member?.orcid,
                  helperTextMessage: config.orcid.help,
                  // helperTextCnt: `${formData?.orcid?.length || 0}/${config.orcid.validation.maxLength.value}`,
                }}
                control={control}
                rules={config.orcid.validation}
              />

            <ControlledTextField
              control={control}
              options={{
                name: 'role',
                label: config.role.label,
                useNull: true,
                defaultValue: member?.role,
                helperTextMessage: config.role.help,
                // helperTextCnt: `${formData?.role?.length || 0}/${config.role.validation.maxLength.value}`,
              }}
              rules={config.role.validation}
            />
            <ControlledAffiliation
              name= 'affiliation'
              label={config.affiliation.label}
              affiliation={member?.affiliation ?? ''}
              institution={member?.institution ?? null}
              control={control}
              rules={config.affiliation.validation}
              helperTextMessage={config.affiliation.help}
            />
          </section>
          <section>
            <ControlledSwitch
              name="is_contact_person"
              label="Contact person"
              control={control}
              defaultValue={member?.is_contact_person ?? false}
            />
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
