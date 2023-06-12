// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useForm, FormProvider} from 'react-hook-form'

type WithFormContextProps = {
  children: any
  mode?: any,
  defaultValues?: any
}

/**
 * Wraps the component with FormProvider.
 * Required to test input components using autosave on blur.
 * Default mode is onChange (required for autosave feature).
 * Pass defaultValues if you need form to have some values present.
 * @param children, mode
 * @returns JSX.Element
 */
export function WithFormContext({children,mode='onChange',defaultValues}:WithFormContextProps) {
  const methods = useForm({
    mode,
    defaultValues
  })
  return (
    <FormProvider { ...methods }>
      {children}
    </FormProvider>
  )
}
