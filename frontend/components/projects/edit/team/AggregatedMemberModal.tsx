// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'

import {useForm} from 'react-hook-form'

import {useSession} from '~/auth'
import {SaveTeamMember} from '~/types/Project'
import {TeamMemberProps} from '~/types/Contributor'
import {upsertImage} from '~/utils/editImage'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ControlledTextField from '~/components/form/ControlledTextField'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledAutocomplete from '~/components/form/ControlledAutocomplete'
import {AggregatedPerson} from '~/components/person/groupByOrcid'
import AvatarOptionsTeamMember from './AvatarOptionsTeamMember'
import {postTeamMember} from './editTeamMembers'
import {cfgTeamMembers as config} from './config'

type AggregatedMemberModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: (person: SaveTeamMember) => void,
  member: NewRsdMember
}

export type NewRsdMember = AggregatedPerson & {
  project: string
  selected_avatar: string | null
  avatar_id: string|null
  avatar_b64: string|null
  avatar_mime_type: string|null
  role: string|null
  is_contact_person: boolean
  position: number
}

const formId = 'aggregated-member-modal'

export default function AggregatedMemberModal({open, onCancel, onSubmit, member}: AggregatedMemberModalProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, reset, control, register, setValue} = useForm<NewRsdMember>({
    mode: 'onChange',
    defaultValues: {
      ...member
    }
  })

  // extract
  const {isValid, isDirty} = formState
  const formData = watch()

  // console.group('AggregatedMemberModal')
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('formData...', formData)
  // console.groupEnd()

  function handleCancel(e?: any, reason?: 'backdropClick' | 'escapeKeyDown') {
    if (reason && reason==='backdropClick') return
    // reset form
    reset()
    // hide
    onCancel()
  }

  async function onSave(data: NewRsdMember) {
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
      onSubmit(member)
    } else {
      showErrorMessage(`Failed to add member. ${resp.message}`)
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
        Add team member
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit((data) => onSave(data))}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('project')}
        />
        <input type="hidden"
          {...register('position')}
        />
        <input type="hidden"
          {...register('avatar_b64')}
        />
        <input type="hidden"
          {...register('avatar_mime_type')}
        />
        <DialogContent sx={{
          width: ['100%', '37rem'],
        }}>
          <AvatarOptionsTeamMember
            watch={watch}
            setValue={setValue}
            avatar_options={member.avatar_options}
          />
          <div className="py-2"></div>
          <section className="py-4 grid grid-cols-[1fr,1fr] gap-8">
            <ControlledTextField
              control={control}
              options={{
                name: 'given_names',
                label: config.given_names.label,
                useNull: true,
                defaultValue: formData?.given_names,
                helperTextMessage: config.given_names.help,
                helperTextCnt: `${formData?.given_names?.length || 0}/${config.given_names.validation.maxLength.value}`,
              }}
              rules={config.given_names.validation}
            />
            <ControlledTextField
              control={control}
              options={{
                name: 'family_names',
                label: config.family_names.label,
                useNull: true,
                defaultValue: formData?.family_names,
                helperTextMessage: config.family_names.help,
                helperTextCnt: `${formData?.family_names?.length || 0}/${config.family_names.validation.maxLength.value}`,
              }}
              rules={config.family_names.validation}
            />
            <ControlledAutocomplete
              name="email_address"
              label={config.email_address.label}
              control={control}
              options={member.email_options}
              helperTextMessage={config.email_address.help}
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
            <ControlledAutocomplete
              name="role"
              label={config.role.label}
              control={control}
              options={member.role_options}
              helperTextMessage={config.role.help}
              rules={config.role.validation}
            />
            <ControlledAutocomplete
              name="affiliation"
              label={config.affiliation.label}
              options={member.affiliation_options}
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
              defaultValue={false}
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
    if (isValid === false) return true
    if (isDirty === false) return true
    return false
  }
}
