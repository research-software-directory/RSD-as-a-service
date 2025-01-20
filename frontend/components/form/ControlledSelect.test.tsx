// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, within} from '@testing-library/react'
import {useForm} from 'react-hook-form'

import ControlledSelect, {ControlledSelectProps} from './ControlledSelect'

const mockOptions = [
  {label:'option 1', value:'option-1'},
  {label:'option 2', value:'option-2'},
]

const mockProps:ControlledSelectProps = {
  name: 'Test name',
  label: 'test label',
  options: mockOptions,
  disabled: false,
  defaultValue: undefined,
  control: undefined,
  rules: undefined,
  helperTextMessage:'Test help message'
}


function WithFormControl() {
  const {control} = useForm()
  mockProps.control = control
  return (
    <ControlledSelect {...mockProps} />
  )
}

it('renders component with options', () => {
  render(<WithFormControl />)

  const select = screen.getByRole('combobox')
  fireEvent.mouseDown(select)

  const options = screen.getAllByRole('option')
  expect(options.length).toEqual(mockOptions.length)
})

it('select second option', () => {
  render(<WithFormControl />)

  // select wrapper/group
  const selectGroup = screen.getByTestId('controlled-select')
  expect(selectGroup).toBeInTheDocument()

  // select button - for expanding
  const select = within(selectGroup).getByRole('combobox')
  fireEvent.mouseDown(select)

  const options = screen.getAllByRole('option')
  // expect(options.length).toEqual(mockOptions.length)
  fireEvent.click(options[1])
  // select hidden input
  const input = screen.getByRole('textbox', {
    hidden:true
  })
  expect(input).toHaveValue(mockOptions[1].value)
})
