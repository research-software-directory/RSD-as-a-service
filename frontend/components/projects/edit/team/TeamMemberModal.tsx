// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent, useEffect, useState} from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import DeleteIcon from '@mui/icons-material/Delete'

import {useForm} from 'react-hook-form'

import {useSession} from '~/auth'
import {getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'
import {SaveTeamMember, TeamMember} from '~/types/Project'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ControlledTextField from '~/components/form/ControlledTextField'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import ContributorAvatar from '~/components/software/ContributorAvatar'
import ControlledAffiliation from '~/components/form/ControlledAffiliation'
import {cfgTeamMembers as config} from './config'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {handleFileUpload} from '~/utils/handleFileUpload'
import {deleteImage, getImageUrl, upsertImage} from '~/utils/editImage'
import {patchTeamMember, postTeamMember} from './editTeamMembers'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import {TeamMemberProps} from '~/types/Contributor'

type TeamMemberModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({member, pos}: { member: SaveTeamMember, pos?: number }) => void,
  member?: TeamMember,
  pos?: number
}

const formId='edit-team-member-modal'

export default function TeamMemberModal({open, onCancel, onSubmit, member, pos}: TeamMemberModalProps) {
  const {token} = useSession()
  const {showWarningMessage,showErrorMessage} = useSnackbar()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const [removeAvatar, setRemoveAvatar] = useState<null|string>(null)
  const {handleSubmit, watch, formState, reset, control, register, setValue} = useForm<TeamMember>({
    mode: 'onChange',
    defaultValues: {
      ...member
    }
  })

  // extract
  const {isValid, isDirty} = formState
  const formData = watch()

  // console.group('TeamMemberModal')
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.groupEnd()

  useEffect(() => {
    if (member) {
      reset(member)
    }
  }, [member,reset])

  function handleCancel() {
    // reset form
    reset()
    // hide
    onCancel()
  }

  async function onFileUpload(e:ChangeEvent<HTMLInputElement>|undefined) {
    if (typeof e !== 'undefined') {
      const {status, message, image_b64, image_mime_type} = await handleFileUpload(e)
      if (status === 200 && image_b64 && image_mime_type) {
        replaceImage(image_b64, image_mime_type)
      } else if (status===413) {
        showWarningMessage(message)
      } else {
        showErrorMessage(message)
      }
    }
  }

  async function replaceImage(avatar_b64:string, avatar_mime_type:string) {
    if (formData.id && formData.avatar_id) {
      // mark old image for deletion
      // we will remove it on Save
      setRemoveAvatar(formData.avatar_id)
      // and remove id in the form too
      setValue('avatar_id', null)
    }
    // write new logo to logo_b64
    // we upload the image after submit
    setValue('avatar_b64', avatar_b64)
    setValue('avatar_mime_type', avatar_mime_type, {shouldDirty: true})
  }

  function deleteAvatar() {
    if (formData.id && formData.avatar_id) {
      // mark image for deletion
      setRemoveAvatar(formData.avatar_id)
      // update form
      setValue('avatar_id', null, {shouldDirty: true,shouldValidate:true})
     } else {
      // just remove uploaded image from form
      // because it is not saved yet to DB
      setValue('avatar_b64', null)
      setValue('avatar_mime_type', null, {shouldDirty: true})
    }
  }

  async function onSave(data: TeamMember) {
    // UPLOAD avatar
    if (data.avatar_b64 && data.avatar_mime_type) {
      // split base64 to use only encoded content
      const b64data = data.avatar_b64.split(',')[1]
      const upload = await upsertImage({
        data: b64data,
        mime_type: data.avatar_mime_type,
        token
      })

      // debugger
      if (upload.status === 201) {
        // update data values
        data.avatar_id = upload.message
      } else {
        showErrorMessage(`Failed to upload image. ${upload.message}`)
        return
      }
    }
    // prepare member object for save (remove helper props)
    const member:SaveTeamMember = getPropsFromObject(data, TeamMemberProps)
    // CREATE or UPDATE
    if (member.id && typeof pos !== 'undefined') {
      const resp = await patchTeamMember({
        member,
        token
      })
      // debugger
      if (resp.status === 200) {
        if (removeAvatar) {
          // try to remove avatar from db
          // without waiting for result
          deleteImage({
            id: removeAvatar,
            token
          })
        }
        // pass member to parent
        onSubmit({member, pos})
      } else {
        showErrorMessage(`Failed to update member. ${resp.message}`)
      }
    } else {
      // new team member we need to add
      const resp = await postTeamMember({
        member,
        token
      })
      // debugger
      if (resp.status === 201) {
        // get id out of message
        member.id = resp.message
        // pass member to parent
        onSubmit({member, pos})
      } else {
        showErrorMessage(`Failed to add member. ${resp.message}`)
      }
    }
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
        onSubmit={handleSubmit((data: TeamMember) => onSave(data))}
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
          {...register('position')}
        />
        <input type="hidden"
          {...register('avatar_id')}
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
                  avatarUrl={formData.avatar_b64 ?? getImageUrl(formData.avatar_id) ?? ''}
                  displayName={getDisplayName(member ?? {}) ?? ''}
                  displayInitials={getDisplayInitials(member ?? {}) ?? ''}
                />
              </label>
              <input
                data-testid="upload-avatar-input"
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
                  disabled={!formData.avatar_b64 && !formData.avatar_id}
                  onClick={deleteAvatar}
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
                  helperTextCnt: `${formData?.given_names?.length || 0}/${config.given_names.validation.maxLength.value}`,
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
                  helperTextCnt: `${formData?.family_names?.length || 0}/${config.family_names.validation.maxLength.value}`,
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
                helperTextCnt: `${formData?.email_address?.length || 0}/${config.email_address.validation.maxLength.value}`,
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
                helperTextCnt: `${formData?.role?.length || 0}/${config.role.validation.maxLength.value}`,
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
