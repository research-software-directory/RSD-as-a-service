// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useController} from 'react-hook-form'
import ControlledTextField, {ControlledTextFieldOptions} from '~/components/form/ControlledTextField'

export type OnSaveProps<T> = {
  name: keyof T,
  value: string
}

export type AutosaveControlledTextField<T> = {
  control: any
  options: ControlledTextFieldOptions<T>
  rules?: any
  onSaveField: ({name,value}: OnSaveProps<T>) => void
}

export default function AutosaveControlledTextField<T>({control,options,rules,onSaveField}:AutosaveControlledTextField<T>) {
  const {field:{value},fieldState:{isDirty,error}} = useController({
    control,
    name: options.name.toString()
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

  /**
   * This function is passed to onBlur event of ControlledTextField component.
   * We use value from react-hook-form controller because the Controlled component
   * will pass a null value rather than an empty string when isNull prop is provided.
   */
  function onSaveInfo() {
    if (isDirty === false) return
    if (error) return
    // console.group('AutosaveControlledTextField')
    // console.log('onSaveInfo...', options.name)
    // console.log('value...', value)
    // console.log('isDirty...', isDirty)
    // console.groupEnd()
    // call provided save fn
    onSaveField({
      name: options.name,
      value
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
