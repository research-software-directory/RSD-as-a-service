// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render} from '@testing-library/react'
import {WithAppContext} from '~/utils/jest/WithAppContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'

import AutosaveControlledMarkdown from './AutosaveControlledMarkdown'
const mockPatchFn = jest.fn()

const mockProps = {
  id: 'test-id',
  name: 'test-name',
  maxLength: 100,
  patchFn: mockPatchFn
}

// wrap component in all required contexts
function WithAllContexts(props: any) {
  return (
    <WithAppContext>
      <WithFormContext>
        <AutosaveControlledMarkdown {...props} />
      </WithFormContext>
    </WithAppContext>
  )
}

it('renders component with text input', () => {
  // render component with all contexts
  const {container} = render(<WithAllContexts {...mockProps}/>)
  // get textarea
  const textarea = container.querySelector('#markdown-textarea')
  // expect to be present
  expect(textarea).toBeInTheDocument()
})

it('renders component with text input', () => {
  const testInput = 'This is test input'
  const expectedSave = {
    data: {
      [mockProps.name]:testInput
    },
    id: mockProps.id,
    token: ''
  }
  // mock save on blur response to 200 - OK
  mockPatchFn.mockResolvedValueOnce('OK')
  // render component
  const {container} = render(<WithAllContexts {...mockProps} />)
  // get reference to input
  const textArea = container.querySelector('#markdown-textarea')
  expect(textArea).not.toBeNull()
  // check exists
  expect(textArea).toBeInTheDocument()
  // fill in text input
  fireEvent.change(textArea!, {target: {value: testInput}})
  // fire on blur action to trigger save
  fireEvent.blur(textArea!)
  // assert save action took place
  expect(mockPatchFn).toHaveBeenCalledTimes(1)
  expect(mockPatchFn).toHaveBeenCalledWith(expectedSave)
})
