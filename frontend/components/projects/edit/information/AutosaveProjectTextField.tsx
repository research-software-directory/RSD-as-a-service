import {useController, useFormContext} from 'react-hook-form'
import {useSession} from '~/auth'
import ControlledTextField, {ControlledTextFieldOptions} from '~/components/form/ControlledTextField'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useProjectContext from '../useProjectContext'
import {patchProjectInfo} from './patchProjectInfo'

export type AutosaveProjectInfoProps = {
  project_id: string
  options: ControlledTextFieldOptions
  rules?: any
}

export default function AutosaveProjectTextField({project_id,options,rules}:AutosaveProjectInfoProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {setProjectTitle, setProjectSlug} = useProjectContext()
  const {control, resetField} = useFormContext()
  const {field:{value},fieldState:{isDirty,error}} = useController({
    control,
    name: options.name
  })

  // add onBlur fn to muiProps to save changes onBlur
  if (options.muiProps) {
    options.muiProps['onBlur'] = saveProjectInfo
  } else {
    // create muiProps
    options['muiProps'] = {
      onBlur: saveProjectInfo
    }
  }

  async function saveProjectInfo() {
    if (isDirty === false) return
    if (error) return
    // patch project table
    const resp = await patchProjectInfo({
      id:project_id,
      variable: options.name,
      // we use null instead ""
      // value: value === '' ? null : value,
      value,
      token
    })

    console.group('AutosaveProjectTextField')
    console.log('saved...', options.name)
    console.log('value...', value)
    console.log('status...', resp?.status)
    console.groupEnd()

    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save ${options.name}. ${resp?.message}`)
    } else {
      // debugger
      resetField(options.name, {
        defaultValue:value
      })
      // update shared state
      updateSharedProjectInfo()
    }
  }

  function updateSharedProjectInfo() {
    if (options.name === 'slug') {
      setProjectSlug(value)
    }
    if (options.name === 'title') {
      setProjectTitle(value)
    }
  }

  return (
    <ControlledTextField
      options={options}
      control={control}
      rules={rules}
    />
  )
}
