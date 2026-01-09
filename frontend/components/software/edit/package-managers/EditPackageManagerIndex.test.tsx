// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// DEFAULT mocks first in order to be able to perform custom mocks
// default mock of api
jest.mock('~/components/software/edit/package-managers/apiPackageManager')

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'
import {initialState as softwareState} from '~/components/software/edit/context/editSoftwareContext'
import {getPackageManagersForSoftware} from '~/components//software/edit/package-managers/apiPackageManager'
const mockGetPackageManager = getPackageManagersForSoftware as jest.Mock

import EditPackageManager from '~/components/software/edit/package-managers/index'
import mockManagers from '~/components/software/edit/package-managers/__mocks__/package_manager.json'

const mockSoftware = {
  id: 'software-test-id',
  slug: 'software-test-slug',
  brand_name:'software-brand-name',
  concept_doi: 'software-concept-doi',
}


describe('frontend/components/software/edit/package-managers/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading', () => {
    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <EditPackageManager />
        </WithSoftwareContext>
      </WithAppContext>
    )
    screen.getByRole('progressbar')
    // screen.debug()
  })

  it('shows list of package managers', async() => {

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={mockSoftware}>
          <EditPackageManager />
        </WithSoftwareContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // validate package managers are loaded
    const managers = screen.getAllByTestId('sortable-list-item')
    expect(managers.length).toEqual(mockManagers.length)
  })

  it('can delete package manager', async() => {

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={mockSoftware}>
          <EditPackageManager />
        </WithSoftwareContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // validate package managers are loaded
    const managers = screen.getAllByTestId('sortable-list-item')
    expect(managers.length).toEqual(mockManagers.length)

    // delete first item
    const deleteBtn = within(managers[0]).getByRole('button', {name: 'delete'})
    fireEvent.click(deleteBtn)
    const confirmModal = await screen.findByRole('dialog')
    // confirm the right item for delete
    within(confirmModal).getByText(mockManagers[0].url)
    // find delete button
    const removeBtn = within(confirmModal).getByRole('button', {name: 'Remove'})
    expect(removeBtn).toBeEnabled()
    // click remove button
    fireEvent.click(removeBtn)
  })

  it('can add package manager', async() => {

    // first request we do not have data
    mockGetPackageManager.mockResolvedValueOnce([])

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={mockSoftware}>
          <EditPackageManager />
        </WithSoftwareContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // manipulate entry (just to be sure is unique for this test)
    mockManagers[1].url +='-test'
    // we need to fake api response with one item that we are adding
    mockGetPackageManager.mockResolvedValueOnce([mockManagers[1]])
    // add
    const addBtn = screen.getByRole('button', {name: 'Add'})
    fireEvent.click(addBtn)

    // get edit modal
    const editModal = await screen.findByRole('dialog')
    const urlInput = within(editModal).getByRole('textbox')

    // add url
    fireEvent.change(urlInput, {target: {value: mockManagers[1].url}})

    // get save
    const saveBtn = within(editModal).getByRole('button', {name: 'Save'})
    // validate is enabled
    await waitFor(async() => {
      expect(saveBtn).toBeEnabled()
      // click on save
      fireEvent.click(saveBtn)
      // wait for edit modal to be removed
      await waitForElementToBeRemoved(editModal)
    })

    await screen.findByText(mockManagers[1].url)
  })
})
