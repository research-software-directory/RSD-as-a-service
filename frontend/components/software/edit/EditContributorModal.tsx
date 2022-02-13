import {useEffect, useState} from 'react'
import {
  Alert, Button, CircularProgress,
  Dialog, DialogActions, DialogContent,
  DialogTitle, useMediaQuery
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'

import {useForm} from 'react-hook-form'

import {Contributor} from '../../../types/Contributor'
import ControlledTextField from '../../form/ControlledTextField'
import ControlledSwitch from '../../form/ControlledSwitch'
import ContributorAvatar from '../ContributorAvatar'
import {contributorInformation as config} from './editSoftwareConfig'
import {getDisplayInitials, getDisplayName} from '../../../utils/getDisplayName'

export default function EditContributorModal({open,contributor,onClose}:
  {open:boolean, contributor: Contributor | undefined, onClose:(state:boolean)=>void}) {
  const [loading, setLoading] = useState(false)
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, reset, control} = useForm<Contributor>({
    mode: 'onChange',
    defaultValues: {
      ...contributor
    }
  })

  if (!contributor) return null

  // extract
  const {errors, isValid, isDirty} = formState
  const formData = watch()

  // console.group('EditContributorModal')
  // console.log('open...', open)
  // console.log('errors...', errors)
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('smallScreen...', smallScreen)
  // console.log('contributor...', contributor)
  // console.log('formData...', formData)
  // console.groupEnd()

  function handleCancel() {
    // reset form
    reset()
    // hide
    onClose(false)
  }

  function onSubmit(data: Contributor) {
    console.log('onSubmit...data', data)
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
        Contributor {contributor?.given_names}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{
          width: ['100%', '37rem'],
          marginBottom:'2rem'
        }}>
          <section className="grid grid-cols-[1fr,2fr] gap-8">
            <div>
              <ContributorAvatar
                size={8}
                avatarUrl={contributor?.avatar_url ?? ''}
                displayName={getDisplayName(contributor ?? {}) ?? ''}
                displayInitials={getDisplayInitials(contributor) ?? ''}
              />
            </div>
            <div>
              <ControlledSwitch
                name="is_contact_person"
                label="Contact person"
                control={control}
                defaultValue={contributor?.is_contact_person}
              />
              <div className="py-2"></div>
              <ControlledTextField
                options={{
                  name: 'orcid',
                  label: config.orcid.label,
                  useNull: true,
                  defaultValue: contributor?.orcid,
                  helperTextMessage: config.orcid.help,
                  // helperTextCnt: `${formData?.orcid?.length || 0}/${config.orcid.validation.maxLength.value}`,
                }}
                control={control}
                rules={config.orcid.validation}
              />
            </div>
          </section>
          <div className="py-8"></div>
          <section className="py-4 grid grid-cols-[1fr,2fr] gap-8">
            <ControlledTextField
              control={control}
              options={{
                name: 'given_names',
                label: config.given_names.label,
                useNull: true,
                defaultValue: contributor?.given_names,
                helperTextMessage: config.given_names.help,
                // helperTextCnt: `${formData?.given_names?.length || 0}/${config.given_names.validation.maxLength.value}`,
              }}
              rules={config.given_names.validation}
            />
            <ControlledTextField
              control={control}
              options={{
                name: 'family_names',
                label: config.family_names.label,
                useNull: true,
                defaultValue: contributor?.family_names,
                helperTextMessage: config.family_names.help,
                // helperTextCnt: `${formData?.family_names?.length || 0}/${config.family_names.validation.maxLength.value}`,
              }}
              rules={config.family_names.validation}
            />

            <ControlledTextField
              control={control}
              options={{
                name: 'role',
                label: config.role.label,
                useNull: true,
                defaultValue: contributor?.role,
                helperTextMessage: config.role.help,
                // helperTextCnt: `${formData?.role?.length || 0}/${config.role.validation.maxLength.value}`,
              }}
              rules={config.role.validation}
            />

            <ControlledTextField
              control={control}
              options={{
                name: 'email_address',
                label: config.email_address.label,
                useNull: true,
                defaultValue: contributor?.email_address,
                helperTextMessage: config.email_address.help,
                // helperTextCnt: `${formData?.email_address?.length || 0}/${config.email_address.validation.maxLength.value}`,
              }}
              rules={config.email_address.validation}
            />
          </section>
          <section>
            <ControlledTextField
              control={control}
              options={{
                name: 'affiliation',
                label: config.affiliation.label,
                useNull: true,
                defaultValue: contributor?.affiliation,
                helperTextMessage: config.affiliation.help,
                // helperTextCnt: `${formData?.affiliation?.length || 0}/${config.affiliation.validation.maxLength.value}`,
              }}
              rules={config.affiliation.validation}
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
          <Button
            tabIndex={0}
            type="submit"
            variant="contained"
            sx={{
              // overwrite tailwind preflight.css for submit type
              '&[type="submit"]:not(.Mui-disabled)': {
                backgroundColor:'primary.main'
              }
            }}
            endIcon={
              <SaveIcon />
            }
            disabled={isSaveDisabled()}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )

  function isSaveDisabled() {
    if (loading == true) return true
    if (isValid === false) return true
    if (isDirty === false) return true
    return false
  }
}
