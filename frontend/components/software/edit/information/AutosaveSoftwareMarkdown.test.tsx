// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved,act} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'

import AutosaveSoftwareMarkdown from './AutosaveSoftwareMarkdown'
import {softwareInformation as config} from '../editSoftwareConfig'

// MOCK patchSoftwareTable
const mockPatchSoftwareTable = jest.fn(props => Promise.resolve('OK'))
jest.mock('./patchSoftwareTable', () => ({
  patchSoftwareTable: jest.fn(props=>mockPatchSoftwareTable(props))
}))

const mockGetRemoteMarkdown = jest.fn(props => Promise.resolve('Remote markdown'))
jest.mock('~/utils/getSoftware', () => ({
  getRemoteMarkdown: jest.fn(props=>mockGetRemoteMarkdown(props))
}))

beforeEach(() => {
  jest.clearAllMocks()
})

it('shows loaded description', () => {
  const formValues = {
    id: 'software-test-id',
    brand_name: 'Test software title',
    description_type: 'markdown',
    description: 'Test description',
    description_url: null
  }

  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext>
        <WithFormContext defaultValues={formValues}>
          <AutosaveSoftwareMarkdown />
        </WithFormContext>
      </WithSoftwareContext>
    </WithAppContext>
  )

  // expect markdown type
  const markdown = screen.getByRole('radio', {
    name: 'Custom markdown'
  })
  expect(markdown).toBeChecked()
  // select makdown input tab
  const markdownTab = screen.getByRole('tab', {
    name: 'Markdown'
  })
  fireEvent.click(markdownTab)
  // validate description value
  const description = screen.getByRole('textbox')
  expect(description).toHaveValue(formValues.description)

  // select preview tab
  const previewTab = screen.getByRole('tab', {
    name: 'Preview'
  })
  fireEvent.click(previewTab)
  // validate preview text
  screen.getByText(formValues.description)
})

it('shows loaded description_url', async() => {
  const formValues = {
    id: 'software-test-id',
    brand_name: 'Test software title',
    description_type: 'link',
    description: null,
    description_url: 'https://github.com/project/README.md'
  }
  // mock remote api response
  const expectedMarkdown = 'Remote markdown for testing'
  mockGetRemoteMarkdown.mockResolvedValueOnce(expectedMarkdown)

  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext>
        <WithFormContext defaultValues={formValues}>
          <AutosaveSoftwareMarkdown />
        </WithFormContext>
      </WithSoftwareContext>
    </WithAppContext>
  )

  // expect document URL
  const documentUrl = screen.getByRole('radio', {
    name: 'Document URL'
  })
  expect(documentUrl).toBeChecked()
  // select document_url
  const document_url = screen.getByRole('textbox')
  expect(document_url).toHaveValue(formValues.description_url)
  // wait loader to be removed
  await waitForElementToBeRemoved(screen.getByRole('progressbar'))
  // validate remote markdown response
  screen.getByText(expectedMarkdown)
})

it('saves custom markdown', async() => {
  const formValues = {
    id: 'software-test-id',
    brand_name: 'Test software title',
    // markdown is default value
    description_type: 'markdown',
    description: null,
    description_url: null
  }

  const expectedMarkdown = '## Test custom markdown title'

  mockPatchSoftwareTable.mockResolvedValueOnce('OK')

  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext>
        <WithFormContext defaultValues={formValues}>
          <AutosaveSoftwareMarkdown />
        </WithFormContext>
      </WithSoftwareContext>
    </WithAppContext>
  )

  // check markdown type
  const markdown = screen.getByRole('radio', {
    name: 'Custom markdown'
  })
  // validate markdown checked by default
  expect(markdown).toBeChecked()

  // select makdown input tab
  const markdownTab = screen.getByRole('tab', {
    name: 'Markdown'
  })
  fireEvent.click(markdownTab)

  // write custom markdown
  const description = screen.getByRole('textbox')
  fireEvent.change(description, {target: {value: expectedMarkdown}})
  await waitFor(() => {
    expect(description).toHaveValue(expectedMarkdown)
  })
  // trigger save
  await waitFor(() => {
    fireEvent.blur(description)
  })

  await waitFor(() => {
    expect(mockPatchSoftwareTable).toBeCalledTimes(1)
    expect(mockPatchSoftwareTable).toBeCalledWith({
      'data': {
        'description': expectedMarkdown,
        'description_type': 'markdown',
        'description_url': null,
      },
      'id': formValues.id,
      'token': mockSession.token,
    })
  })
})

it('saves remote markdown', async() => {
  const formValues = {
    id: 'software-test-id',
    brand_name: 'Test software title',
    // markdown is default value
    description_type: 'markdown',
    description: null,
    description_url: null
  }

  const expectedMarkdownUrl = 'https://github.com/project/README.md'

  mockPatchSoftwareTable.mockResolvedValueOnce('OK')

  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext>
        <WithFormContext defaultValues={formValues}>
          <AutosaveSoftwareMarkdown />
        </WithFormContext>
      </WithSoftwareContext>
    </WithAppContext>
  )

  // check remote markdown
  const remoteUrl = screen.getByRole('radio', {
    name: 'Document URL'
  })
  fireEvent.click(remoteUrl)
  expect(remoteUrl).toBeChecked()

  // validate markdown type NOT checked
  const markdown = screen.getByRole('radio', {
    name: 'Custom markdown'
  })
  // validate markdown checked by default
  expect(markdown).not.toBeChecked()

  await waitFor(() => {
    expect(mockPatchSoftwareTable).toBeCalledTimes(1)
  })

  // write url
  const url = screen.getByRole('textbox')
  fireEvent.change(url, {target: {value: expectedMarkdownUrl}})
  // trigger save
  fireEvent.blur(url)

  await waitFor(() => {
    // called twice - first at change to link
    expect(mockPatchSoftwareTable).toBeCalledTimes(2)
    expect(mockPatchSoftwareTable).toBeCalledWith({
      'data': {
        'description': null,
        'description_type': 'link',
        'description_url': expectedMarkdownUrl,
      },
      'id': formValues.id,
      'token': mockSession.token,
    })
  })
})
