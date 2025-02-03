// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'

import SoftwareOrganisations from './index'
import {organisationInformation as config} from '../editSoftwareConfig'
import {initialState as softwareState} from '~/components/software/edit/editSoftwareContext'

// MOCKS
import organisationsOfSoftware from './__mocks__/organisationsOfSoftware.json'

// MOCK getOrganisationsForSoftware, searchForOrganisation, mockCreateOrganisation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGetOrganisationsForSoftware = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSearchForOrganisation = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockCreateOrganisation = jest.fn(props => Promise.resolve({
  status: 201,
  message: 'new-organisation-id'
}))
jest.mock('~/utils/editOrganisation', () => ({
  ...jest.requireActual('~/utils/editOrganisation'),
  getOrganisationsForSoftware: jest.fn(props=>mockGetOrganisationsForSoftware(props)),
  searchForOrganisation: jest.fn(props => mockSearchForOrganisation(props)),
  createOrganisation: jest.fn(props=>mockCreateOrganisation(props))
}))

// MOCK isMaintainerOfOrganisation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockIsMaintainerOfOrganisation = jest.fn(props => Promise.resolve(false))
jest.mock('~/auth/permissions/isMaintainerOfOrganisation', () => ({
  __esModule: true,
  default: jest.fn(props=>mockIsMaintainerOfOrganisation(props)),
  isMaintainerOfOrganisation: jest.fn(props=>mockIsMaintainerOfOrganisation(props)),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canEditOrganisations: jest.fn(({organisations,...other})=>organisations)
}))

// MOCK organisationForSoftware methods
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockCreateOrganisationAndAddToSoftware = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockAddOrganisationToSoftware = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteOrganisationFromSoftware = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchOrganisationPositions = jest.fn(props=>Promise.resolve([]as any))
jest.mock('./organisationForSoftware', () => ({
  createOrganisationAndAddToSoftware: jest.fn(props=>mockCreateOrganisationAndAddToSoftware(props)),
  addOrganisationToSoftware: jest.fn(props => mockAddOrganisationToSoftware(props)),
  deleteOrganisationFromSoftware: jest.fn(props => mockDeleteOrganisationFromSoftware(props)),
  patchOrganisationPositions: jest.fn(props=>mockPatchOrganisationPositions(props))
}))

// MOCK software category calls
// by default we return no categories
jest.mock('~/components/category/apiCategories')
jest.mock('~/utils/getSoftware')
// MOCK removeOrganisationCategoriesFromSoftware
jest.mock('./apiSoftwareOrganisations')

describe('frontend/components/software/edit/organisations/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders no organisations message', async () => {
    // required software id
    softwareState.software.id = 'test-software-id'
    // no organisations listed
    mockGetOrganisationsForSoftware.mockResolvedValueOnce([])

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareOrganisations />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // shows no maintainers message
    screen.getByText('No participating organisations')
  })

  it('renders software organisations', async() => {
    // required software id
    softwareState.software.id = 'test-software-id'
    // return list of organisations
    mockGetOrganisationsForSoftware.mockResolvedValueOnce(organisationsOfSoftware)

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareOrganisations />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // renders project organisations
    const organisations = screen.getAllByTestId('organisation-list-item')
    expect(organisations.length).toEqual(organisationsOfSoftware.length)
  })

  it('can add NEW organisation to software', async() => {
    // required software id
    softwareState.software.id = 'test-software-id'
    const newOrganisation = {
      id: 'new-organisation-id',
      parent: null,
      name: 'Non existing organisation',
      is_tenant: false,
      slug: 'non-existing-organisation',
      ror_id: null,
      position: 1,
      logo_b64: null,
      logo_mime_type: null,
      logo_id: null,
      website: 'https://website.com',
      source: 'MANUAL',
      primary_maintainer: null,
      role: 'participating',
      canEdit: false,
      description: null
    }
    // mock empty list of organisations
    mockGetOrganisationsForSoftware.mockResolvedValueOnce([])
    // mock no organisation found by search
    mockSearchForOrganisation.mockResolvedValueOnce([])
    // mock createOrganisation response
    mockCreateOrganisation.mockResolvedValueOnce({
      status: 201,
      message: newOrganisation.id
    })
    // mock createOrganisationAndAddToSoftware response
    mockCreateOrganisationAndAddToSoftware.mockResolvedValueOnce({
      status: 200,
      message: newOrganisation
    })

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareOrganisations />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // search for organisation
    const search = screen.getByRole('combobox', {
      name: config.findOrganisation.label
    })
    fireEvent.change(search, {target: {value: newOrganisation.name}})

    await waitFor(() => {
      // validate search organisation called
      expect(mockSearchForOrganisation).toHaveBeenCalledTimes(1)
      expect(mockSearchForOrganisation).toHaveBeenCalledWith({
        'searchFor': newOrganisation.name,
      })
    })

    // validate add option present
    const addNew = await screen.findByTestId('add-organisation-option')
    expect(addNew).toHaveTextContent(`Add "${newOrganisation.name}"`)
    // select add new organisation
    fireEvent.click(addNew)

    // expect add organisation modal
    const modal = await screen.findByRole('dialog')
    // validate name has value we used
    const title = within(modal).getByRole('textbox', {
      name: config.name.label
    })
    expect(title).toHaveValue(newOrganisation.name)

    // enter (valid) website
    const website = within(modal).getByRole('textbox', {
      name: config.website.label
    })
    // fill in website
    fireEvent.change(website, {target: {value: newOrganisation.website}})
    // save
    const saveBtn = within(modal).getByRole('button', {
      name: 'Save'
    })
    // wait for Save to be enabled
    await waitFor(() => {
      expect(saveBtn).toBeEnabled()
      fireEvent.click(saveBtn)
    })

    await waitFor(() => {
      // call createOrganisation api
      expect(mockCreateOrganisationAndAddToSoftware).toHaveBeenCalledTimes(1)
      expect(mockCreateOrganisationAndAddToSoftware).toHaveBeenCalledWith({
        item:{
          id: null,
          parent: null,
          name: newOrganisation.name,
          is_tenant: false,
          slug: newOrganisation.slug,
          ror_id: null,
          position: 1,
          logo_b64: null,
          logo_mime_type: null,
          logo_id: null,
          website: newOrganisation.website,
          source: newOrganisation.source,
          primary_maintainer: null,
          role: newOrganisation.role,
          canEdit: false,
          description: null
        },
        software: softwareState.software.id,
        token: mockSession.token,
      })
    })

    // validate 1 item added to organisation list
    const organisations = await screen.findAllByTestId('organisation-list-item')
    expect(organisations).toHaveLength(1)
  })

  it('can add RSD organisation to software', async () => {
    // required software id
    softwareState.software.id = 'test-software-id'
    const searchFor = 'Netherlands eScience Center'
    // return VU from mock data
    const firstOrg = organisationsOfSoftware[0]
    const rsdOption:any = {
      key: firstOrg.ror_id,
      label: firstOrg.name,
      data: {
        ...firstOrg,
        source: 'RSD'
      }
    }

    // mock empty list of organisations
    mockGetOrganisationsForSoftware.mockResolvedValueOnce([])
    // mock organisation found by search
    mockSearchForOrganisation.mockResolvedValueOnce([rsdOption])
    // mock added
    mockAddOrganisationToSoftware.mockResolvedValueOnce({
      status: 200,
      message: 'approved'
    })
    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareOrganisations />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // search for organisation
    const search = screen.getByRole('combobox', {
      name: config.findOrganisation.label
    })
    fireEvent.change(search, {target: {value: searchFor}})

    // search for options returned (mocked) - we return only 1 value
    const options = await screen.findAllByTestId('find-organisation-option')
    expect(options.length).toEqual(1)

    // add RSD option
    fireEvent.click(options[0])

    // validate select option is added to list
    const organisations = await screen.findAllByTestId('organisation-list-item')
    expect(organisations).toHaveLength(1)

    // validate api called to save
    expect(mockAddOrganisationToSoftware).toHaveBeenCalledTimes(1)
    expect(mockAddOrganisationToSoftware).toHaveBeenCalledWith({
      'position': 1,
      'organisation': firstOrg.id,
      'software': softwareState.software.id,
      'token': mockSession.token,
    })

  })

  it('can remove organisation from software', async () => {
    // required software id
    softwareState.software.id = 'test-software-id'
    // return list of organisations
    mockGetOrganisationsForSoftware.mockResolvedValueOnce(organisationsOfSoftware)
    // return OK
    mockDeleteOrganisationFromSoftware.mockResolvedValueOnce({
      status: 200,
      message: 'OK'
    })
    mockPatchOrganisationPositions.mockResolvedValueOnce({
      status: 200,
      message: 'OK'
    })
    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareOrganisations />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // renders project organisations
    const organisations = screen.getAllByTestId('organisation-list-item')
    expect(organisations.length).toEqual(organisationsOfSoftware.length)

    // get delete button from first organisation
    const deleteBtn = within(organisations[0]).getByRole('button', {
      name: 'delete'
    })
    // click delete
    fireEvent.click(deleteBtn)

    // get confirmation modal
    const modal = screen.getByRole('dialog')
    // confirm remove
    const removeBtn = within(modal).getByRole('button', {
      name: 'Remove'
    })
    fireEvent.click(removeBtn)

    // validate api calls
    await waitFor(() => {
      // deleteOrganisation
      expect(mockDeleteOrganisationFromSoftware).toHaveBeenCalledTimes(1)
      expect(mockDeleteOrganisationFromSoftware).toHaveBeenCalledWith({
        'organisation': organisationsOfSoftware[0].id,
        'software': softwareState.software.id,
        'token': mockSession.token,
      })
      // patch organisation positions
      expect(mockPatchOrganisationPositions).toHaveBeenCalledTimes(1)
      // confirm number of organisations remaining
      const remained = screen.getAllByTestId('organisation-list-item')
      expect(remained.length).toEqual(organisationsOfSoftware.length-1)
    })
  })

  it('shows organisation categories modal',async()=>{
    // required software id
    softwareState.software.id = 'test-software-id'
    // return list of organisations
    mockGetOrganisationsForSoftware.mockResolvedValueOnce(organisationsOfSoftware)

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareOrganisations />
        </WithSoftwareContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // renders project organisations
    const organisations = screen.getAllByTestId('organisation-list-item')
    expect(organisations.length).toEqual(organisationsOfSoftware.length)

    // get edit categories button from first organisation
    const categoriesBtn = within(organisations[0]).getByRole('button', {
      name: 'edit categories'
    })
    // click edit categories
    fireEvent.click(categoriesBtn)

    // get organisation categories modal
    const modal = await screen.findByRole('dialog')

    // close modal
    const cancelBtn = within(modal).getByRole('button', {
      name: 'Cancel'
    })
    fireEvent.click(cancelBtn)
    // confirm modal closed
    expect(modal).not.toBeInTheDocument()
  })
})
