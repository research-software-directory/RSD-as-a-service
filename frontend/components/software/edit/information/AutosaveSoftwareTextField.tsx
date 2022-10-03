import {useFormContext} from 'react-hook-form'
import {useSession} from '~/auth'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import {ControlledTextFieldOptions} from '~/components/form/ControlledTextField'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useSoftwareContext from '../useSoftwareContext'
import {patchSoftwareTable} from './patchSoftwareTable'

export type AutosaveProjectInfoProps = {
  software_id: string
  options: ControlledTextFieldOptions
  rules?: any
}

export default function AutosaveSoftwareTextField({software_id,options,rules}:AutosaveProjectInfoProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {setSoftwareTitle, setSoftwareSlug} = useSoftwareContext()
  const {control, resetField} = useFormContext()

  async function saveSoftwareInfo({name, value}: OnSaveProps) {
    // patch project table
    const resp = await patchSoftwareTable({
      id: software_id,
      data: {
        [name]:value
      },
      token
    })

    // console.group('AutosaveSoftwareTextField')
    // console.log('saved...', options.name)
    // console.log('value...', value)
    // console.log('status...', resp?.status)
    // console.groupEnd()

    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save ${options.name}. ${resp?.message}`)
    } else {
      // debugger
      resetField(options.name, {
        defaultValue:value
      })
      // update shared state
      updateSharedProjectInfo(value)
    }
  }

  function updateSharedProjectInfo(value:string) {
    if (options.name === 'slug') {
      setSoftwareSlug(value)
    }
    if (options.name === 'brand_name') {
      setSoftwareTitle(value)
    }
  }

  return (
    <AutosaveControlledTextField
      options={options}
      control={control}
      rules={rules}
      onSaveField={saveSoftwareInfo}
    />
  )
}
