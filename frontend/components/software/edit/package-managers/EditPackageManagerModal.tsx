// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
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

import {useDebounce} from '~/utils/useDebounce'
import ControlledSelect from '~/components/form/ControlledSelect'
import ControlledTextField from '~/components/form/ControlledTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {
  getPackageManagerServices,
  getPackageManagerTypeFromUrl, NewPackageManager,
  PackageManager, packageManagerSettings, PackageManagerTypes
} from './apiPackageManager'
import PackageManagerInfo from './PackageManagerInfo'
import {config} from './config'

type EditPackageManagerModalProps = Readonly<{
  open: boolean,
  onCancel: () => void,
  onSubmit: (data: PackageManager | NewPackageManager) => void,
  package_manager?: PackageManager | NewPackageManager,
  isAdmin: boolean
}>

const formId='edit-package-manager-modal'

const packageManagerOptions = Object.keys(packageManagerSettings).map(key=>{
  const name = packageManagerSettings[key as PackageManagerTypes].name
  return {
    value: key,
    label: name
  }
})

export default function EditPackageManagerModal({open, onCancel, onSubmit, package_manager, isAdmin}: EditPackageManagerModalProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, reset, control, register, setValue} = useForm<PackageManager|NewPackageManager>({
    mode: 'onChange',
    defaultValues: {
      ...package_manager
    }
  })
  // extract form states and possible errors
  const {isValid, isDirty, errors} = formState
  // watch for value changes in the form
  const [
    url,
    package_manager_form,
    download_disabled,
    reverse_dependency_disabled
  ] = watch([
    'url',
    'package_manager',
    'download_count_scraping_disabled_reason',
    'reverse_dependency_count_scraping_disabled_reason'
  ])
  // take the last url value
  const bouncedUrl = useDebounce(url, 700)
  const packageManagerServices = getPackageManagerServices(package_manager_form)

  useEffect(() => {
    async function fetchPackageManagerType(){
      // extract manager type from url
      const pm_key = await getPackageManagerTypeFromUrl(bouncedUrl)
      // save value
      setValue('package_manager', pm_key as PackageManagerTypes, {
        shouldValidate: true,
        shouldDirty: true
      })
    }
    if (!errors?.url && url?.length > 5 &&
      bouncedUrl === url &&
      // only for new items
      package_manager?.id === null
    ) {
      fetchPackageManagerType()
    }
  },[bouncedUrl,url,setValue,errors?.url,package_manager?.id])

  // console.group('EditPackageManagerModal')
  // console.log('isValid...', isValid)
  // console.log('isDirty...', isDirty)
  // console.log('url...', url)
  // console.log('bouncedUrl...', bouncedUrl)
  // console.log('package_manager...', package_manager)
  // console.log('package_manager_form...', package_manager_form)
  // console.log('packageManagerOptions...', packageManagerOptions)
  // console.log('packageManagerServices...', packageManagerServices)
  // console.groupEnd()

  function handleCancel() {
    // reset form
    reset()
    // hide
    onCancel()
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
        onSubmit={handleSubmit(onSubmit)}
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
              label: config.modal.url.label,
              useNull: true,
              defaultValue: url,
              helperTextMessage: errors['url']?.message ?? config.modal.url.help,
              helperTextCnt: `${url?.length ?? 0}/${config.modal.url.validation.maxLength.value}`,
              // disable url if item is edited (id!=null)
              disabled: package_manager?.id !== null
            }}
            rules={config.modal.url.validation}
          />
          <div className="py-4"></div>
          {isAdmin && package_manager?.id !== null ?
            <>
              <ControlledTextField
                control={control}
                options={{
                  name: 'download_count_scraping_disabled_reason',
                  label: config.modal.download_scraping_disabled.label,
                  useNull: true,
                  defaultValue: download_disabled,
                  helperTextMessage: config.modal.download_scraping_disabled.help(packageManagerServices.includes('downloads')),
                  helperTextCnt: `${download_disabled?.length ?? 0}/${config.modal.download_scraping_disabled.validation.maxLength.value}`,
                  disabled: package_manager?.id === null || !packageManagerServices.includes('downloads')
                }}
                rules={config.modal.download_scraping_disabled.validation}
              />
              <div className="py-4"></div>
              <ControlledTextField
                control={control}
                options={{
                  name: 'reverse_dependency_count_scraping_disabled_reason',
                  label: config.modal.reverse_dependency_scraping_disabled.label,
                  useNull: true,
                  defaultValue: reverse_dependency_disabled,
                  helperTextMessage: config.modal.reverse_dependency_scraping_disabled.help(packageManagerServices.includes('dependents')),
                  helperTextCnt: `${reverse_dependency_disabled?.length ?? 0}/${config.modal.reverse_dependency_scraping_disabled.validation.maxLength.value}`,
                  disabled: package_manager?.id === null || !packageManagerServices.includes('dependents')
                }}
                rules={config.modal.reverse_dependency_scraping_disabled.validation}
              />
              <div className="py-4"></div>
              <ControlledSelect
                name="package_manager"
                label={config.modal.package_manager.label}
                control={control}
                options={packageManagerOptions}
                rules={{}}
                defaultValue={package_manager?.package_manager ?? null}
                disabled={package_manager?.id === null}
                helperTextMessage={config.modal.package_manager.help}
                sx={{
                  'width': '100%'
                }}
              />
            </>
            : <PackageManagerInfo pm_key={package_manager_form} />
          }

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
    if (url !== bouncedUrl) return true
    return false
  }
}
