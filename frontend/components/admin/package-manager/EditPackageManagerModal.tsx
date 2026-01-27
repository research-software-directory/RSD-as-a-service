// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {useForm} from 'react-hook-form'

import useSmallScreen from '~/config/useSmallScreen'
import {useDebounce} from '~/utils/useDebounce'
import ControlledSelect from '~/components/form/ControlledSelect'
import ControlledTextField from '~/components/form/ControlledTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {
  getPackageManagerServices,
  getPackageManagerTypeFromUrl,
  PackageManager
} from '~/components/software/edit/package-managers/apiPackageManager'
import {cfg,packageManagerSettings, PackageManagerTypes} from '~/components/software/edit/package-managers/config'

type EditPackageManagerModalProps = Readonly<{
  onCancel: () => void,
  onSubmit: (data: PackageManager) => void,
  package_manager: PackageManager
}>

const formId='edit-package-manager-modal'

const packageManagerOptions = Object.keys(packageManagerSettings).map(key=>{
  const name = packageManagerSettings[key as PackageManagerTypes].name
  return {
    value: key,
    label: name
  }
})

export default function EditPackageManagerModal({onCancel, onSubmit, package_manager}: EditPackageManagerModalProps) {
  const smallScreen = useSmallScreen()
  const {handleSubmit, watch, formState, reset, control, register, setValue} = useForm<PackageManager>({
    mode: 'onChange',
    defaultValues: package_manager
  })
  // extract form states and possible errors
  const {isValid, isDirty, errors} = formState
  // watch for value changes in the form
  const [
    url,
    package_manager_form,
    download_disabled,
    reverse_dependency_disabled,
    download_count_last_error,
    reverse_dependency_count_last_error
  ] = watch([
    'url',
    'package_manager',
    'download_count_scraping_disabled_reason',
    'reverse_dependency_count_scraping_disabled_reason',
    'download_count_last_error',
    'reverse_dependency_count_last_error'
  ])
  // take the last url value
  const bouncedUrl = useDebounce(url, 700)
  const packageManagerServices = getPackageManagerServices(package_manager_form)

  useEffect(() => {
    async function fetchPackageManagerType(){
      // extract manager type from url
      const pm_key = await getPackageManagerTypeFromUrl(bouncedUrl)
      // save value
      setValue('package_manager', pm_key, {
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
          padding: '2rem 1.5rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          <ControlledTextField
            control={control}
            options={{
              name: 'url',
              label: cfg.modal.url.label,
              useNull: true,
              defaultValue: url,
              helperTextMessage: errors['url']?.message ?? cfg.modal.url.help,
              helperTextCnt: `${url?.length ?? 0}/${cfg.modal.url.validation.maxLength.value}`,
              // disable url if item is edited (id!=null)
              disabled: package_manager?.id !== null
            }}
            rules={cfg.modal.url.validation}
          />
          <ControlledSelect
            name="package_manager"
            label={cfg.modal.package_manager.label}
            control={control}
            options={packageManagerOptions}
            rules={{}}
            defaultValue={package_manager?.package_manager ?? null}
            disabled={package_manager?.id === null}
            helperTextMessage={cfg.modal.package_manager.help}
            sx={{
              'width': '100%'
            }}
          />
          {
            packageManagerServices.includes('download_count') ?
              <>
                <ControlledTextField
                  control={control}
                  options={{
                    name: 'download_count_scraping_disabled_reason',
                    label: cfg.modal.download_scraping_disabled.label,
                    useNull: true,
                    defaultValue: download_disabled,
                    helperTextMessage: cfg.modal.download_scraping_disabled.help(packageManagerServices.includes('download_count')),
                    helperTextCnt: `${download_disabled?.length ?? 0}/${cfg.modal.download_scraping_disabled.validation.maxLength.value}`,
                    disabled: package_manager?.id === null
                  }}
                  rules={cfg.modal.download_scraping_disabled.validation}
                />
                <ControlledTextField
                  control={control}
                  options={{
                    name: 'download_count_last_error',
                    label: cfg.modal.download_count_last_error.label,
                    useNull: true,
                    defaultValue: download_count_last_error,
                    helperTextMessage: cfg.modal.download_count_last_error.help(packageManagerServices.includes('download_count')),
                    helperTextCnt: `${download_count_last_error?.length ?? 0}/${cfg.modal.download_count_last_error.validation.maxLength.value}`,
                    disabled: package_manager?.id === null
                  }}
                  rules={cfg.modal.download_count_last_error.validation}
                />
              </>
              : null
          }{
            packageManagerServices.includes('reverse_dependency_count') ?
              <>
                <ControlledTextField
                  control={control}
                  options={{
                    name: 'reverse_dependency_count_scraping_disabled_reason',
                    label: cfg.modal.reverse_dependency_scraping_disabled.label,
                    useNull: true,
                    defaultValue: reverse_dependency_disabled,
                    helperTextMessage: cfg.modal.reverse_dependency_scraping_disabled.help(packageManagerServices.includes('reverse_dependency_count')),
                    helperTextCnt: `${reverse_dependency_disabled?.length ?? 0}/${cfg.modal.reverse_dependency_scraping_disabled.validation.maxLength.value}`,
                    disabled: package_manager?.id === null
                  }}
                  rules={cfg.modal.reverse_dependency_scraping_disabled.validation}
                />
                <ControlledTextField
                  control={control}
                  options={{
                    name: 'reverse_dependency_count_last_error',
                    label: cfg.modal.reverse_dependency_count_last_error.label,
                    useNull: true,
                    defaultValue: reverse_dependency_count_last_error,
                    helperTextMessage: cfg.modal.reverse_dependency_count_last_error.help(packageManagerServices.includes('reverse_dependency_count')),
                    helperTextCnt: `${reverse_dependency_count_last_error?.length ?? 0}/${cfg.modal.reverse_dependency_count_last_error.validation.maxLength.value}`,
                    disabled: package_manager?.id === null
                  }}
                  rules={cfg.modal.reverse_dependency_count_last_error.validation}
                />
              </>
              : null
          }
          <div className="pt-4 px-1 text-base-content-disabled text-sm">
            RSD background services: {packageManagerServices.length}
          </div>
        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            tabIndex={1} //NOSONAR
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
