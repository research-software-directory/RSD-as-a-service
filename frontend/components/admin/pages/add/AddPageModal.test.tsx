// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AddPageModal from './AddPageModal'
import {addConfig as config} from './addConfig'

// MOCKS
const mockValidPageSlug = jest.fn((props) => Promise.resolve(false))
jest.mock('../useMarkdownPages', () => ({
  validPageSlug: jest.fn(props=>mockValidPageSlug(props))
}))

const mockAddMarkdownPage = jest.fn((props) => Promise.resolve({status:200,message:'test-message'}))
jest.mock('../saveMarkdownPage', () => ({
  addMarkdownPage: jest.fn(props=>mockAddMarkdownPage(props))
}))

const mockProps = {
  pos:1,
  open: true,
  onCancel: jest.fn(),
  onSuccess: jest.fn()
}

it('add custom page', async() => {
  render(
    <WithAppContext options={{session:mockSession}}>
      <AddPageModal {...mockProps} />
    </WithAppContext>
  )

  // add page title
  const title = screen.getByRole('textbox', {
    name: config.title.label
  })
  expect(title).toBeInTheDocument()
  fireEvent.change(title, {target: {value: 'Test title'}})

  await waitFor(() => {
    // validate call
    expect(mockValidPageSlug).toBeCalledTimes(1)
    expect(mockValidPageSlug).toBeCalledWith({
      'slug': 'test-title',
      'token': 'TEST_TOKEN'
    })
  })

  // save button
  const saveBtn = screen.getByRole('button', {
    name: 'Save'
  })
  await waitFor(() => {
    expect(saveBtn).toBeEnabled()
    // click to save
    fireEvent.click(saveBtn)
    // validate call
    expect(mockAddMarkdownPage).toBeCalledTimes(1)
  })
})
