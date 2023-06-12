// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, within, waitForElementToBeRemoved} from '@testing-library/react'
import {AutocompleteOption} from '~/types/AutocompleteOptions'
import {License} from '~/types/SoftwareTypes'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'

import AutosaveSoftwareLicenses, {SoftwareLicensesProps} from './AutosaveSoftwareLicenses'

// MOCKS
import licenseForSoftware from './__mocks__/licenseForSoftware.json'
import {initialState as softwareState} from '~/components/software/edit/editSoftwareContext'

const licenseOptions:AutocompleteOption<License>[] = licenseForSoftware.map(item => ({
  key: item.license,
  label: item.license,
  data: {
    id: item.id,
    name: item.license,
    license: item.license,
    software: item.software
  }
}))
const mockProps:SoftwareLicensesProps = {
  items: licenseOptions
}

// MOCKS
// use default mock
jest.mock('~/utils/useSpdxLicenses')

// MOCK addLicensesForSoftware, deleteLicense
const mockAddLicensesForSoftware = jest.fn(props => Promise.resolve({
  status: 201,
  message: 'new-license-id'
}))
const mockDeleteLicense = jest.fn(props=>Promise.resolve('OK' as any))
jest.mock('~/utils/editSoftware', () => ({
  addLicensesForSoftware: jest.fn(props => mockAddLicensesForSoftware(props)),
  deleteLicense: jest.fn(props=>mockDeleteLicense(props))
}))

// MOCK getLicensesFromDoi
const mockGetLicensesFromDoi = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/getInfoFromDatacite', () => ({
  getLicensesFromDoi: jest.fn(props=>mockGetLicensesFromDoi(props))
}))


beforeEach(() => {
  jest.clearAllMocks()
})

it('renders mocked licenses', () => {
  // copy software id
  softwareState.software.id = licenseForSoftware[0].software
  // mock items
  mockProps.items = licenseOptions
  // render
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext state={softwareState}>
        <AutosaveSoftwareLicenses {...mockProps} />
      </WithSoftwareContext>
    </WithAppContext>
  )
  // validate chips shown
  const chips = screen.getAllByTestId('license-chip')
  expect(chips.length).toEqual(mockProps.items.length)
})

it('can add NEW license', async() => {
  const newLicense = 'New license to add'
  // copy software id
  softwareState.software.id = licenseForSoftware[0].software
  // mock no items
  mockProps.items = []
  // render
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext state={softwareState}>
        <AutosaveSoftwareLicenses {...mockProps} />
      </WithSoftwareContext>
    </WithAppContext>
  )
  // get license input
  const combo = screen.getByRole('combobox')
  fireEvent.change(combo, {target: {value: newLicense}})

  // find Add option
  const addLicense = await screen.findByRole('option', {
    name: `Add "${newLicense}"`
  })
  // select to add new license
  fireEvent.click(addLicense)

  await waitFor(() => {
    expect(mockAddLicensesForSoftware).toBeCalledTimes(1)
    expect(mockAddLicensesForSoftware).toBeCalledWith({
      'license': newLicense,
      'software': softwareState.software.id,
      'token': mockSession.token,
    })
  })

  // confirm license added as chip
  const chips = await screen.findAllByTestId('license-chip')
  expect(chips[0]).toHaveTextContent(newLicense)
})

it('can import license from DOI', async() => {
  // copy software id
  softwareState.software.id = licenseForSoftware[0].software
  // mock no items
  mockProps.items = []
  mockProps.concept_doi = '10.1017/9781009085809'

  // mock api response
  const importLicense = 'Apache-2.0'
  mockGetLicensesFromDoi.mockResolvedValueOnce([importLicense])

  // render
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext state={softwareState}>
        <AutosaveSoftwareLicenses {...mockProps} />
      </WithSoftwareContext>
    </WithAppContext>
  )

  // click on import license button
  const importBtn = screen.getByRole('button', {
    name: 'Import licenses'
  })
  fireEvent.click(importBtn)

  // wait for loader in import button to be removed
  await waitForElementToBeRemoved(within(importBtn).getByRole('progressbar'))

  await waitFor(() => {
    // validate import api call
    expect(mockGetLicensesFromDoi).toBeCalledTimes(1)
    expect(mockGetLicensesFromDoi).toBeCalledWith(mockProps.concept_doi)

    // validate license save api call
    expect(mockAddLicensesForSoftware).toBeCalledTimes(1)
    expect(mockAddLicensesForSoftware).toBeCalledWith({
      'license': importLicense,
      'software': softwareState.software.id,
      'token': mockSession.token,
    })

    // validate license listed
    const chips = screen.getAllByTestId('license-chip')
    expect(chips[0]).toHaveTextContent(importLicense)
  })
})

it('can add license from list', async() => {
  const newLicense = 'Apache-2.0'
  // copy software id
  softwareState.software.id = licenseForSoftware[0].software
  // mock no items
  mockProps.items = []
  // render
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext state={softwareState}>
        <AutosaveSoftwareLicenses {...mockProps} />
      </WithSoftwareContext>
    </WithAppContext>
  )
  // get license input
  const combo = screen.getByRole('combobox')
  fireEvent.change(combo, {target: {value: newLicense}})

  // find Add option
  const addLicense = await screen.findByRole('option', {
    name: newLicense
  })
  // select to add new license
  fireEvent.click(addLicense)

  await waitFor(() => {
    expect(mockAddLicensesForSoftware).toBeCalledTimes(1)
    expect(mockAddLicensesForSoftware).toBeCalledWith({
      'license': newLicense,
      'software': softwareState.software.id,
      'token': mockSession.token,
    })
  })

  // confirm license added as chip
  const chips = await screen.findAllByTestId('license-chip')
  expect(chips[0]).toHaveTextContent(newLicense)
})

it('can remove license', async () => {
  // copy software id
  softwareState.software.id = licenseForSoftware[0].software
  // mock items
  mockProps.items = licenseOptions
  // mock api response for delete
  mockDeleteLicense.mockResolvedValueOnce({
    status: 200,
    message: 'OK'
  })
  // render
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext state={softwareState}>
        <AutosaveSoftwareLicenses {...mockProps} />
      </WithSoftwareContext>
    </WithAppContext>
  )
  // validate chips shown
  const chips = screen.getAllByTestId('license-chip')

  // delete first license
  const delBtn = within(chips[0]).getByTestId('CancelIcon')
  fireEvent.click(delBtn)

  await waitFor(() => {
    expect(mockDeleteLicense).toBeCalledTimes(1)
    expect(mockDeleteLicense).toBeCalledWith({
      'id': mockProps.items[0].data.id,
      'token': mockSession.token,
    })
    const remained = screen.getAllByTestId('license-chip')
    expect(remained.length).toEqual(chips.length-1)
  })
})
