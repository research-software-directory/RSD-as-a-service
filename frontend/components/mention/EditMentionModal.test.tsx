// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, within} from '@testing-library/react'

import EditMentionModal from './EditMentionModal'
import {mentionType,mentionModal} from './config'
import {MentionItemProps} from '~/types/Mention'

const mockOnCancel = jest.fn()
const mockOnSubmit = jest.fn()

const mockItem:MentionItemProps = {
  id: null,
  doi: null,
  url: null,
  title: null,
  authors: null,
  publisher: null,
  publication_year: null,
  page: null,
  journal: null,
  // url to external image
  image_url: null,
  mention_type: null,
  source: 'manual',
  note: null
}

const mockProps = {
  open: true,
  item: mockItem,
  pos: undefined,
  title: undefined,
  onCancel: mockOnCancel,
  onSubmit: mockOnSubmit
}

beforeEach(() => {
  jest.clearAllMocks()
  // render
  render(<EditMentionModal {...mockProps} />)
})

it('renders component with title, cancel and save buttons', () => {
  // has title input
  const title = screen.getByRole('textbox', {
    name: mentionModal.title.label
  })
  expect(title).toBeInTheDocument()

  // has cancel button
  const cancel = screen.getByRole('button', {
    name: 'Cancel'
  })
  expect(cancel).toBeInTheDocument()

  // has save btn - initally disabled
  const submit = screen.getByRole('button', {
    name: 'Save'
  })
  expect(submit).toBeInTheDocument()
  expect(submit).not.toBeEnabled()
})

it('calls onCancel when cancel button used', () => {
  // has cancel button
  const cancel = screen.getByRole('button', {
    name: 'Cancel'
  })

  expect(cancel).toBeInTheDocument()

  fireEvent.click(cancel)

  expect(mockOnCancel).toHaveBeenCalledTimes(1)
})

it('calls onSave when minimum info provided', async () => {
  const expectedItem = {
    ...mockItem,
    title: 'Test mention title',
    url: 'https://google.com/mention-1',
  }

  // change title
  const title = screen.getByRole('textbox', {
    name: mentionModal.title.label
  })
  fireEvent.change(title, {target: {value: expectedItem.title}})

  // select wrapper/group
  const selectGroup = screen.getByTestId('controlled-select')
  expect(selectGroup).toBeInTheDocument()

  // select button - for expanding
  const select = within(selectGroup).getByRole('combobox')
  fireEvent.mouseDown(select)

  // validate all options present
  const options = screen.getAllByRole('option')
  expect(options.length).toEqual(Object.keys(mentionType).length)
  // select second option
  fireEvent.click(options[1])

  // save selected mention type
  expectedItem.mention_type = options[1].getAttribute('data-value') as any

  // provide url to mention
  const url = screen.getByRole('textbox', {
    name: mentionModal.url.label
  })

  fireEvent.change(url,{target:{value:expectedItem.url}})

  // has Save button
  const save = screen.getByRole('button', {
    name: 'Save'
  })

  // save should be enabled
  await waitFor(() => {
    expect(save).toBeEnabled()
  })
  // click on save
  fireEvent.click(save)
  // we need to wait for events
  await waitFor(() => {
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    expect(mockOnSubmit).toHaveBeenCalledWith({data:expectedItem, pos: undefined})
  })
})
