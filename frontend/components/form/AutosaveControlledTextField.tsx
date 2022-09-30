import {useController} from 'react-hook-form'
import ControlledTextField, {ControlledTextFieldOptions} from '~/components/form/ControlledTextField'

export type OnSaveProps = {
  name: string,
  value: string
}

export type AutosaveControlledTextField = {
  control: any
  options: ControlledTextFieldOptions
  rules?: any
  onSaveField: ({name,value}: OnSaveProps) => void
}

export default function AutosaveControlledTextField({control,options,rules,onSaveField}:AutosaveControlledTextField) {
  const {fieldState:{isDirty,error}} = useController({
    control,
    name: options.name
  })

  // add onBlur fn to muiProps
  if (options.muiProps) {
    options.muiProps['onBlur'] = onSaveInfo
  } else {
    // create muiProps
    options['muiProps'] = {
      onBlur: onSaveInfo
    }
  }

  function onSaveInfo({target}:any) {
    if (isDirty === false) return
    if (error) return
    console.group('AutosaveControlledTextField')
    console.log('onSaveInfo...', options.name)
    console.log('value...', target.value)
    // console.log('isDirty...', isDirty)
    console.groupEnd()
    // call provided save fn
    onSaveField({
      name: options.name,
      value: target.value
    })
  }

  return (
    <ControlledTextField
      options={options}
      control={control}
      rules={rules}
    />
  )
}
