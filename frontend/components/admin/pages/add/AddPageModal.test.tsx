// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AddPageModal from './AddPageModal'
import {addConfig as config} from './addConfig'

// MOCKS
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockValidPageSlug = jest.fn((props) => Promise.resolve(false))
jest.mock('../useMarkdownPages', () => ({
  validPageSlug: jest.fn(props=>mockValidPageSlug(props))
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

beforeEach(()=>{
  jest.clearAllMocks()
})

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
    expect(mockValidPageSlug).toHaveBeenCalledTimes(1)
    expect(mockValidPageSlug).toHaveBeenCalledWith({
      'slug': 'test-title',
      'token': 'TEST_TOKEN'
    })
  })

  // save button
  const saveBtn = screen.getByRole('button', {
    name: 'Save'
  })
  expect(saveBtn).toBeEnabled()
  fireEvent.click(saveBtn)

  await waitFor(() => {
    // validate call
    expect(mockAddMarkdownPage).toHaveBeenCalledTimes(1)
    expect(mockAddMarkdownPage).toHaveBeenCalledWith({
      'page':{
        'is_published': false,
        'position': 1,
        'slug': 'test-title',
        'title': 'Test title',
      },
      'token': 'TEST_TOKEN',
    })
  })
})
