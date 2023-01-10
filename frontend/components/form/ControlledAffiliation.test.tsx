// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {useForm} from 'react-hook-form'
import ControlledAffiliation from './ControlledAffiliation'


const mockProps = {
  name: 'control name',
  label: 'control label',
  affiliation: 'test affiliation',
  institution: ['test institution'],
  rules: {
    minLength: {value: 2, message: 'Minimum length is 2'},
    maxLength: {value: 200, message: 'Maximum length is 200'},
  },
  helperTextMessage: 'test help message'
}

function WithHookForm(props:any) {
  const {control} = useForm({
    mode: 'onChange'
  })

  return (
    <ControlledAffiliation
      control={control}
      {...props}
    />
  )
}

it('should render text field with affiliation', () => {
  // render component with hook form
  render(<WithHookForm {...mockProps} />)

  // get input
  const input = screen.getByRole('textbox', {
    name: mockProps.label
  })
  // expect input
  expect(input).toBeInTheDocument()
  // expect to have affiliation value
  expect(input).toHaveValue(mockProps.affiliation)
  // screen.debug()
})

it('should render autocomplete with options', async () => {
  // provide array of institutions
  mockProps.institution=['test institution','test affiliation']
  // render component with hook form
  render(<WithHookForm {...mockProps} />)

  // get input
  const input = screen.getByRole('combobox', {
    name: mockProps.label
  })

  // focus to load options
  fireEvent.click(input)
  // get options
  const options = await screen.findAllByRole('option')
  expect(options.length).toEqual(mockProps.institution.length)
})

it('can select second option', async () => {
  // provide array of institutions
  mockProps.institution=['test affiliation','test institution']
  // render component with hook form
  render(<WithHookForm {...mockProps} />)

  // get input
  const input = screen.getByRole('combobox', {
    name: mockProps.label
  })

  // focus to load options
  fireEvent.click(input)

  // get options
  const options = await screen.findAllByRole('option')
  expect(options.length).toEqual(mockProps.institution.length)

  // select second option
  fireEvent.click(options[1])
  // validate
  expect(input).toHaveValue(mockProps.institution[1])
})
