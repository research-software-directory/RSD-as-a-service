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

import AutosaveRepositoryUrl from './AutosaveRepositoryUrl'
import {config} from './config'

// MOCK patchSoftwareTable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockAddToRepositoryTable = jest.fn(props => Promise.resolve('OK'))
jest.mock('~/utils/editSoftware', () => ({
  addToRepositoryTable: jest.fn(props=>mockAddToRepositoryTable(props))
}))

beforeEach(() => {
  jest.clearAllMocks()
})

it('shows loaded info', () => {

  const formValues = {
    id: 'software-test-id',
    repository_url: 'https://github.com/reponame',
    repository_platform: 'github'
  }

  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext>
        <WithFormContext defaultValues={formValues}>
          <AutosaveRepositoryUrl />
        </WithFormContext>
      </WithSoftwareContext>
    </WithAppContext>
  )

  const repoUrl = screen.getByRole('textbox', {
    name: config.repository_url.label
  })

  expect(repoUrl).toHaveValue(formValues.repository_url)
})

it('save repository url and platform', async() => {

  const newRepo = 'https://github.com/test-repo'

  const formValues = {
    id: 'software-test-id'
  }

  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext>
        <WithFormContext defaultValues={formValues}>
          <AutosaveRepositoryUrl />
        </WithFormContext>
      </WithSoftwareContext>
    </WithAppContext>
  )

  // write repo url
  const repoUrl = screen.getByRole('textbox', {
    name: config.repository_url.label
  })
  fireEvent.change(repoUrl, {target: {value: newRepo}})
  expect(repoUrl).toHaveValue(newRepo)

  fireEvent.blur(repoUrl)

  await waitFor(() => {
    expect(mockAddToRepositoryTable).toHaveBeenCalledTimes(1)
  })

})
