// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,JSX} from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'

import {UseFormSetValue, UseFormWatch, useForm} from 'react-hook-form'

import {Person} from '~/types/Contributor'
import ControlledTextField from '~/components/form/ControlledTextField'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ControlledAutocomplete from '~/components/form/ControlledAutocomplete'
import AvatarOptionsPerson, {RequiredAvatarProps} from '~/components/person/AvatarOptionsPerson'
import useAggregatedPerson from './useAggregatedPerson'
import {modalConfig} from './config'

type InputProps={
  label:string
  help?: string | JSX.Element
  validation?: any
}

type AggregatedPersonModalConfig={
  is_contact_person: Omit<InputProps,'validation'>,
  given_names: InputProps,
  family_names: InputProps,
  email_address: InputProps,
  orcid: InputProps,
  role: InputProps,
  affiliation: InputProps
}

type AggregatedPersonModalProps = Readonly<{
  onCancel: () => void,
  onSubmit: (person: FormPerson) => void,
  person: Person
  // default title is Profile, provide other value
  title?: string
  // default labels and validation are defined in ./config
  // optionally provide custom config
  config?: AggregatedPersonModalConfig
}>

export type FormPerson = Person & {
  initial_avatar_id: string|null
}

const formId = 'aggregated-person-modal'

export default function AggregatedPersonModal({
  person,onCancel,onSubmit,
  title='Profile',config=modalConfig
}: AggregatedPersonModalProps) {
  const {loading, options} = useAggregatedPerson(person?.orcid)
  const smallScreen = useMediaQuery('(max-width:640px)')
  const {handleSubmit, watch, formState, control, register, setValue, trigger} = useForm<FormPerson>({
    mode: 'onChange',
    defaultValues: {
      ...person,
      // copy avatar id
      initial_avatar_id: person.avatar_id
    }
  })

  // extract
  const {isValid, isDirty} = formState
  const formData = watch()

  useEffect(()=>{
    // when is_contact_person OR email_address changes
    // we trigger additional validation on email because
    // email is required for the contact person
    trigger('email_address')
  },[formData.email_address,formData.is_contact_person,trigger])

  // console.group('AggregatedPersonModal')
  // console.log('errors...', errors)
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('formData...', formData)
  // console.log('loading...', loading)
  // console.log('options...', options)
  // console.groupEnd()

  function handleCancel(e?:any, reason?:'backdropClick' | 'escapeKeyDown') {
    if (reason && reason==='backdropClick') return
    onCancel()
  }

  return (
    <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={true}
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
        onSubmit={handleSubmit((data) => onSubmit(data))}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <input type="hidden"
          {...register('account')}
        />
        <input type="hidden"
          {...register('position')}
        />
        <input type="hidden"
          {...register('avatar_id')}
        />
        <input type="hidden"
          {...register('initial_avatar_id')}
        />
        <DialogContent sx={{
          width: ['100%', '40rem'],
        }}>
          <AvatarOptionsPerson
            watch={watch as unknown as UseFormWatch<RequiredAvatarProps>}
            setValue={setValue as unknown as UseFormSetValue<RequiredAvatarProps>}
            avatar_options={options?.avatars ?? []}
            loading={loading}
          />
          <div className="py-2"/>
          <section className="py-4 grid grid-cols-[1fr_1fr] gap-4">
            <ControlledTextField
              control={control}
              options={{
                // user cannot edit specific public profile information (account!==null)
                disabled: formData.account!==null,
                name: 'given_names',
                label: config.given_names.label,
                useNull: true,
                defaultValue: formData?.given_names,
                helperTextMessage: config.given_names.help,
                helperTextCnt: `${formData?.given_names?.length ?? 0}/${config.given_names.validation.maxLength.value}`,
              }}
              rules={config.given_names.validation}
            />
            <ControlledTextField
              control={control}
              options={{
                // user cannot edit specific public profile information (account!==null)
                disabled: formData.account!==null,
                name: 'family_names',
                label: config.family_names.label,
                useNull: true,
                defaultValue: formData?.family_names,
                helperTextMessage: config.family_names.help,
                helperTextCnt: `${formData?.family_names?.length ?? 0}/${config.family_names.validation.maxLength.value}`,
              }}
              rules={config.family_names.validation}
            />
            <ControlledTextField
              options={{
                type: 'email',
                name: 'email_address',
                label: config.email_address.label,
                useNull: true,
                defaultValue: person?.email_address,
                helperTextMessage: config.email_address.help,
                helperTextCnt: `${formData?.email_address?.length ?? 0}/${config.email_address.validation().maxLength.value}`,
              }}
              control={control}
              rules={config.email_address.validation(formData.is_contact_person)}
            />
            <ControlledTextField
              options={{
                // user cannot edit specific public profile information (account!==null)
                disabled: formData.account!==null,
                name: 'orcid',
                label: config.orcid.label,
                useNull: true,
                defaultValue: person?.orcid,
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
              options={options?.roles ?? []}
              helperTextMessage={config.role.help}
              rules={config.role.validation}
            />
            <ControlledAutocomplete
              name="affiliation"
              label={config.affiliation.label}
              options={options?.affiliations ?? []}
              control={control}
              helperTextMessage={config.affiliation.help}
              rules={config.affiliation.validation}
            />
          </section>
          <section>
            <ControlledSwitch
              name="is_contact_person"
              label={config.is_contact_person.label}
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
    // if not valid -> save disabled
    if (isValid === false) return true
    // if valid and new entry (id===null) -> save enabled
    if (formData.id === null) return false
    // if valid and edit (id!=null) but not dirty/touched -> save disabled
    if (isDirty === false) return true
    // else -> save enabled
    return false
  }
}
