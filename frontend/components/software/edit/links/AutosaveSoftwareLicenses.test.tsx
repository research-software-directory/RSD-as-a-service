// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, within, waitForElementToBeRemoved} from '@testing-library/react'
import {AutocompleteOption} from '~/types/AutocompleteOptions'
import {License} from '~/types/SoftwareTypes'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'

import AutosaveSoftwareLicenses from './AutosaveSoftwareLicenses'
import {config} from './config'

// MOCKS
import licenseForSoftware from './__mocks__/licenseForSoftware.json'
import {initialState as softwareState} from '~/components/software/edit/context/editSoftwareContext'


const licenseOptions:AutocompleteOption<License>[] = licenseForSoftware.map(item => ({
  key: item.license,
  label: item.name ?? item.license,
  data: item
}))

const defaultValues:{
  id:string
  licenses: AutocompleteOption<License>[],
  concept_doi: string | null
}={
  id: licenseForSoftware[0].software,
  licenses: licenseOptions,
  concept_doi: null
}

// MOCKS
// use default mock
jest.mock('~/utils/useSpdxLicenses')

// MOCK addLicensesForSoftware, deleteLicense
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockAddLicensesForSoftware = jest.fn(props => Promise.resolve({
  status: 201,
  message: 'new-license-id'
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteLicense = jest.fn(props=>Promise.resolve('OK' as any))
jest.mock('~/components/software/edit/apiEditSoftware', () => ({
  addLicensesForSoftware: jest.fn(props => mockAddLicensesForSoftware(props)),
  deleteLicense: jest.fn(props=>mockDeleteLicense(props))
}))

// MOCK getLicensesFromDoi
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGetLicensesFromDoi = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/utils/getInfoFromDatacite', () => ({
  getLicensesFromDoi: jest.fn(props=>mockGetLicensesFromDoi(props))
}))


beforeEach(() => {
  jest.clearAllMocks()
})

it('renders mocked licenses', () => {
  // copy software id
  softwareState.id = licenseForSoftware[0].software
  // mock values
  defaultValues.id = licenseForSoftware[0].software
  defaultValues.licenses = licenseOptions
  defaultValues.concept_doi = null
  // render
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext state={softwareState}>
        <WithFormContext defaultValues={defaultValues}>
          <AutosaveSoftwareLicenses />
        </WithFormContext>
      </WithSoftwareContext>
    </WithAppContext>
  )
  // validate chips shown
  const chips = screen.getAllByTestId('license-chip')
  expect(chips.length).toEqual(defaultValues.licenses.length)
})

it('can add NEW license', async() => {
  const newLicense = {
    license:'New-license-to-add',
    name: 'New license to add',
    reference: 'https://test-url-license.com',
    open_source: true
  }
  // mock software id value
  defaultValues.id = licenseForSoftware[0].software
  softwareState.id = licenseForSoftware[0].software
  // mock no licenses
  defaultValues.licenses = []
  defaultValues.concept_doi = null

  // render
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext state={softwareState}>
        <WithFormContext defaultValues={defaultValues}>
          <AutosaveSoftwareLicenses />
        </WithFormContext>
      </WithSoftwareContext>
    </WithAppContext>
  )
  // get license input
  const combo = screen.getByRole('combobox')
  fireEvent.change(combo, {target: {value: newLicense.name}})

  // find Add option by testId
  const addLicense = await screen.findByTestId('add-license-option')
  // const addLicense = await screen.findByRole('option', {
  //   name: `Add "${newLicense.name}"`
  // })
  // select to add new license
  fireEvent.click(addLicense)

  await waitFor(()=>{
    screen.getByRole('dialog',{name: 'Add custom license'})
  })

  const urlInput = screen.getByRole('textbox',{name: config.licenses.modal.reference.label})

  // type license url
  fireEvent.change(urlInput,{target:{value:newLicense.reference}})
  expect(urlInput).toHaveValue(newLicense.reference)

  // get Save button
  const saveBtn = screen.getByRole('button',{name:'Save'})
  await waitFor(()=>{
    expect(saveBtn).toBeEnabled()
  })
  // click save
  fireEvent.click(saveBtn)

  await waitFor(() => {
    expect(mockAddLicensesForSoftware).toHaveBeenCalledTimes(1)
    expect(mockAddLicensesForSoftware).toHaveBeenCalledWith({
      'license': {
        ...newLicense,
        software: softwareState.id
      },
      'token': mockSession.token,
    })
  })

  // confirm license added as chip
  const chips = await screen.findAllByTestId('license-chip')
  expect(chips[0]).toHaveTextContent(newLicense.license)
})

it('can import license from DOI', async() => {
  // copy software id
  softwareState.id = licenseForSoftware[0].software
  // mock values
  defaultValues.id = licenseForSoftware[0].software
  defaultValues.licenses = []
  defaultValues.concept_doi = '10.1017/9781009085809'

  // mock api response
  mockGetLicensesFromDoi.mockResolvedValueOnce([{
    key: licenseForSoftware[0].license,
    name: licenseForSoftware[0].name,
    reference: licenseForSoftware[0].reference
  }])

  // render
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext state={softwareState}>
        <WithFormContext defaultValues={defaultValues}>
          <AutosaveSoftwareLicenses />
        </WithFormContext>
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
    expect(mockGetLicensesFromDoi).toHaveBeenCalledTimes(1)
    expect(mockGetLicensesFromDoi).toHaveBeenCalledWith(defaultValues.concept_doi)

    // validate license save api call
    expect(mockAddLicensesForSoftware).toHaveBeenCalledTimes(1)
    expect(mockAddLicensesForSoftware).toHaveBeenCalledWith({
      'license': {
        license: licenseForSoftware[0].license,
        name: licenseForSoftware[0].name,
        reference: licenseForSoftware[0].reference,
        open_source: licenseForSoftware[0].open_source,
        software: softwareState.id
      },
      'token': mockSession.token,
    })

    // validate license listed
    const chips = screen.getAllByTestId('license-chip')
    expect(chips[0]).toHaveTextContent(licenseForSoftware[0].license)
  })
})

it('can add license from list', async() => {
  const newLicense = {
    license: licenseForSoftware[0].license,
    name: licenseForSoftware[0].name,
    reference: licenseForSoftware[0].reference,
    open_source: licenseForSoftware[0].open_source
  }
  // copy software id
  softwareState.id = licenseForSoftware[0].software
  // mock no items
  defaultValues.id = licenseForSoftware[0].software
  defaultValues.licenses = []
  defaultValues.concept_doi = null
  // render
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext state={softwareState}>
        <WithFormContext defaultValues={defaultValues}>
          <AutosaveSoftwareLicenses />
        </WithFormContext>
      </WithSoftwareContext>
    </WithAppContext>
  )
  // get license input
  const combo = screen.getByRole('combobox')
  fireEvent.change(combo, {target: {value: newLicense.name}})

  // only option should be newLicense
  const addLicense = await screen.findByRole('option')
  // select to add new license
  fireEvent.click(addLicense)

  await waitFor(() => {
    expect(mockAddLicensesForSoftware).toHaveBeenCalledTimes(1)
    expect(mockAddLicensesForSoftware).toHaveBeenCalledWith({
      'license': {
        ...newLicense,
        'software': softwareState.id
      },
      'token': mockSession.token,
    })
  })

  // confirm license added as chip
  const chips = await screen.findAllByTestId('license-chip')
  expect(chips[0]).toHaveTextContent(newLicense.license)
})

it('can remove license', async () => {
  // copy software id
  softwareState.id = licenseForSoftware[0].software
  // mock items
  defaultValues.id = licenseForSoftware[0].software
  defaultValues.licenses = licenseOptions
  defaultValues.concept_doi = null
  // mock api response for delete
  mockDeleteLicense.mockResolvedValueOnce({
    status: 200,
    message: 'OK'
  })
  // render
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithSoftwareContext state={softwareState}>
        <WithFormContext defaultValues={defaultValues}>
          <AutosaveSoftwareLicenses />
        </WithFormContext>
      </WithSoftwareContext>
    </WithAppContext>
  )
  // validate chips shown
  const chips = screen.getAllByTestId('license-chip')

  // delete first license
  const delBtn = within(chips[0]).getByTestId('CancelIcon')
  fireEvent.click(delBtn)

  await waitFor(() => {
    expect(mockDeleteLicense).toHaveBeenCalledTimes(1)
    expect(mockDeleteLicense).toHaveBeenCalledWith({
      'id': defaultValues.licenses[0].data.id,
      'token': mockSession.token,
    })
    const remained = screen.getAllByTestId('license-chip')
    expect(remained.length).toEqual(chips.length-1)
  })
})
