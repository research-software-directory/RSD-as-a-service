// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'

import {useForm} from 'react-hook-form'

import logger from '~/utils/logger'
import ControlledTextField from '../../../form/ControlledTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {
  getPackageManagerTypeFromUrl, NewPackageManager,
  PackageManager, PackageManagerTypes
} from './apiPackageManager'
import PackageManagerInfo from './PackageManagerInfo'
import {config} from './config'
import {getBaseUrl} from '~/utils/fetchHelpers'

type EditPackageManagerModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: { data: NewPackageManager|PackageManager, pos?: number }) => void,
  package_manager?: NewPackageManager|PackageManager,
  // item position in the array
  pos?: number
}

const formId='edit-testimonial-modal'

export default function EditPackageManagerModal({open, onCancel, onSubmit, package_manager, pos}: EditPackageManagerModalProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, reset, control, register, setValue} = useForm<NewPackageManager|PackageManager>({
    mode: 'onChange',
    defaultValues: {
      ...package_manager
    }
  })

  // extract
  const {isValid, isDirty, errors} = formState
  const formData = watch()
  const [url] = watch(['url'])

  useEffect(() => {
    const fetchPackageManagerType = async () => {
      // extract manager type from url
      const pm_key = await getPackageManagerTypeFromUrl(url)

      if (pm_key) {
        // const manager = PackageManagerInfo[pm_key as PackageManagerTypes]
        setValue('package_manager', pm_key as PackageManagerTypes, {
          shouldValidate: true,
          shouldDirty: true
        })
      } else {
        setValue('package_manager', 'other' as PackageManagerTypes,{
          shouldValidate: true,
          shouldDirty: true
        })
      }
    }

    try {
      if (typeof errors['url'] === 'undefined' && url.length > 5) {
        fetchPackageManagerType()
      }
    } catch (e: any) {
      logger(`useEffect.getPackageManagerTypeFromUrl...${e.message}`, 'warn')
    }
  },[url,setValue,errors])

  // console.group('EditPackageManagerModal')
  // console.log('isValid...', isValid)
  // console.log('isDirty...', isDirty)
  // console.log('packman...', packman)
  // console.log('url...', url)
  // console.groupEnd()

  function handleCancel() {
    // reset form
    reset()
    // hide
    onCancel()
  }

  function passSubmit(data: NewPackageManager | PackageManager) {
    onSubmit({data,pos})
  }

  return (
    <Dialog
      data-testid="edit-package-manager-modal"
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
        Software download location
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit(passSubmit)}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <input type="hidden"
          {...register('software')}
        />
        <input type="hidden"
          {...register('package_manager')}
        />
        <input type="hidden"
          {...register('position')}
        />
        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem'
        }}>
          <ControlledTextField
            control={control}
            options={{
              name: 'url',
              // variant: 'outlined',
              // multiline: true,
              // rows: 4,
              label: config.modal.url.label,
              useNull: true,
              defaultValue: package_manager?.url,
              helperTextMessage: errors['url']?.message ?? config.modal.url.help,
              helperTextCnt: `${formData?.url?.length || 0}/${config.modal.url.validation.maxLength.value}`,
            }}
            rules={config.modal.url.validation}
          />
          <div className="py-4"></div>
          <PackageManagerInfo pm_key={formData.package_manager} />
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
