// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'

import AutosaveSoftwareTextField from './AutosaveSoftwareTextField'
import {softwareInformation as config} from '../editSoftwareConfig'
import {NewSoftwareItem} from '~/types/SoftwareTypes'

// MOCK patchSoftwareTable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchSoftwareTable = jest.fn(props => Promise.resolve('OK'))
jest.mock('./patchSoftwareTable', () => ({
  patchSoftwareTable: jest.fn(props=>mockPatchSoftwareTable(props))
}))

const defaultValue = 'default value'
const mockProps = {
  software_id: 'test-software-id',
  options: {
    name: 'brand_name' as keyof NewSoftwareItem,
    label: config.brand_name.label,
    useNull: true,
    defaultValue,
    helperTextMessage: config.brand_name.help,
    helperTextCnt: `${defaultValue.length || 0}/${config.brand_name.validation.maxLength.value}`,
  },
  rules:config.brand_name.validation
}

beforeEach(() => {
  jest.clearAllMocks()
})

it('shows loaded info', () => {

  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext>
        <WithFormContext>
          <AutosaveSoftwareTextField {...mockProps} />
        </WithFormContext>
      </WithSoftwareContext>
    </WithAppContext>
  )

  const textbox = screen.getByRole('textbox', {
    name: config.brand_name.label
  })

  expect(textbox).toHaveValue(defaultValue)
})

it('save changes onBlur', async() => {

  const changeInput = 'New test value'

  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext>
        <WithFormContext>
          <AutosaveSoftwareTextField {...mockProps} />
        </WithFormContext>
      </WithSoftwareContext>
    </WithAppContext>
  )

  const textbox = screen.getByRole('textbox', {
    name: config.brand_name.label
  })
  // change input value
  fireEvent.change(textbox,{target:{value: changeInput}})
  expect(textbox).toHaveValue(changeInput)
  // fire onBlur to trigger save
  fireEvent.blur(textbox)

  await waitFor(() => {
    expect(mockPatchSoftwareTable).toHaveBeenCalledTimes(1)
    expect(mockPatchSoftwareTable).toHaveBeenCalledWith({
      'data': {
        'brand_name': changeInput,
      },
      'id': mockProps.software_id,
      'token': mockSession.token
    })
  })
})
