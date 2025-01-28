// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {Session} from '~/auth'
import {WithAppContext} from '~/utils/jest/WithAppContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'

import AutosaveProjectTextField from './AutosaveProjectTextField'


// MOCK patchProjectTable fn
const mockPatchFn = jest.fn()
jest.mock('./patchProjectInfo', () => {
  // console.log('patchProjectInfo...MOCKED')
  return {
    patchProjectTable: (props: any) => {
      // console.log('patchProjectTable...', props)
      return mockPatchFn(props)
    }
  }
})

// MOCK props and input
const mockProps = {
  project_id: 'test-project-id',
  options: {
    name: 'title',
    label: 'label',
    useNull: true,
    defaultValue: 'defaultValue',
    helperTextMessage: 'help message',
    helperTextCnt: '0/100',
  },
  rules: {
    required: 'Title is required',
    minLength: {value: 3, message: 'Minimum length is 3'},
    maxLength: {value: 200, message: 'Maximum length is 200'},
  }
}

// MOCK session, token is tested
const session:Session = {
  user: null,
  token: 'TEST_TOKEN_HERE',
  status: 'authenticated'
}

// wrap component in all required contexts
function WithAllContexts(props: any) {
  return (
    <WithAppContext options={{session}}>
      <WithFormContext>
        <AutosaveProjectTextField {...props}/>
      </WithFormContext>
    </WithAppContext>
  )
}

beforeEach(() => {
  jest.resetAllMocks()
})

it('render component with input and label', () => {
  render(<WithAllContexts {...mockProps} />)
  screen.getByRole('textbox', {
    name: mockProps.options.label
  })
})

it('renders input with defaultValue', () => {
  render(<WithAllContexts {...mockProps} />)

  const input = screen.getByRole('textbox', {
    name: mockProps.options.label
  })
  expect(input).toHaveValue(mockProps.options.defaultValue)
})

it('renders input with helperTextMessage', () => {
  render(<WithAllContexts {...mockProps} />)

  const help = screen.getByText(mockProps.options.helperTextMessage)

  expect(help).toBeInTheDocument()
})

it('renders input with helperTextCnt', () => {
  render(<WithAllContexts {...mockProps} />)

  const help = screen.getByText(mockProps.options.helperTextCnt)

  expect(help).toBeInTheDocument()
})

it('updates value onBlur', async () => {
  const mockInput = 'This is test input'
  const expectPatch={
    id: mockProps.project_id,
    data: {
      [mockProps.options.name]: mockInput
    },
    token: session.token
  }

  // mock 200-OK response
  mockPatchFn.mockResolvedValueOnce('OK')

  render(<WithAllContexts {...mockProps} />)

  const input = screen.getByRole('textbox', {
    name: mockProps.options.label
  })

  // change input value
  fireEvent.change(input, {target: {value: mockInput}})
  expect(input).toHaveValue(mockInput)

  // update onBlur
  fireEvent.blur(input)
  // async call to api
  await waitFor(() => {
    expect(mockPatchFn).toHaveBeenCalledTimes(1)
    expect(mockPatchFn).toHaveBeenCalledWith(expectPatch)
  })

})
