// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext,mockSession} from '~/utils/jest/WithAppContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'
import {MarkdownPage} from '../useMarkdownPages'
import EditMarkdownPage from './EditMarkdownPage'

const mockOnDelete = jest.fn()
const mockOnSubmit = jest.fn()
const mockProps = {
  slug: 'test-slug',
  onDelete: mockOnDelete,
  onSubmit: mockOnSubmit
}
const mockPage:MarkdownPage = {
  id: 'test-id',
  slug: 'test-slug',
  title: 'Test title',
  description: 'This is test description',
  is_published: true,
  position: 1
}
// MOCK useMarkdownPage request
const mockMarkdownPage = jest.fn()
jest.mock('~/components/admin/pages/useMarkdownPages', () => {
  return {
    ...jest.requireActual('~/components/admin/pages/useMarkdownPages'),
    getMarkdownPage: jest.fn((props)=>mockMarkdownPage(props))
  }
})

it('renders component with form', async() => {

  mockMarkdownPage.mockResolvedValueOnce({page: mockPage})

  render(
    <WithAppContext options={{session:mockSession}}>
      <WithFormContext>
        <EditMarkdownPage {...mockProps} />
      </WithFormContext>
    </WithAppContext>
  )

  await waitForElementToBeRemoved(screen.getByRole('progressbar'))

  expect(mockMarkdownPage).toHaveBeenCalledTimes(1)
  expect(mockMarkdownPage).toHaveBeenCalledWith({
    slug: mockProps.slug,
    token: mockSession.token,
    is_published: false
  })

  const form = screen.getByTestId('edit-markdown-form')
  expect(form).toBeInTheDocument()
})

