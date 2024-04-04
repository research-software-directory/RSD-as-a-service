// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'
import {initialState as softwareState} from '~/components/software/edit/editSoftwareContext'

import EditPackageManager from './index'

import mockManagers from './__mocks__/package_manager.json'

// MOCKS
// default mock of api
jest.mock('~/components/software/edit/package-managers/apiPackageManager')

const mockSoftware = {
  ...softwareState,
  software: {
    id: 'software-test-id',
    slug: 'software-test-slug',
    brand_name:'software-brand-name',
    concept_doi: 'software-concept-doi',
  }
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

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={mockSoftware}>
          <EditPackageManager />
        </WithSoftwareContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // add
    const addBtn = screen.getByRole('button', {name: 'Add'})
    fireEvent.click(addBtn)

    // get edit modal
    const editModal = await screen.findByRole('dialog')
    const urlInput = within(editModal).getByRole('textbox')
    // add url - slightly different from already existing one
    fireEvent.change(urlInput, {target: {value: `${mockManagers[0].url}-test`}})

    await waitFor(async() => {
      // get save
      const saveBtn = within(editModal).getByRole('button', {name: 'Save'})
      // validate is enabled
      expect(saveBtn).toBeEnabled()
      // click on save
      fireEvent.click(saveBtn)
      // wait for edit modal to be removed
      await waitForElementToBeRemoved(editModal)
      // screen.debug()
    })

    // validate package_manager label by text
    const pacman = `${mockManagers[0].package_manager.slice(0,1).toUpperCase()}${mockManagers[0].package_manager.slice(1)}`
    await screen.findByText(pacman)
  })
})
