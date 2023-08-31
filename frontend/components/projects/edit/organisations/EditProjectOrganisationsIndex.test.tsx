// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'
import {mockResolvedValue} from '~/utils/jest/mockFetch'

import ProjectOrganisations from './index'
import {cfgOrganisations as config} from './config'
// import {organisationInformation as config} from '~/components/software/edit/editSoftwareConfig'
import editProjectState from '../__mocks__/editProjectState'
import mockOrganisationsOfProject from './__mocks__/organisationsOfProject.json'

// MOCK isMaintainerOfOrganisation
const mockIsMainatainerOfOrganisation = jest.fn(props => Promise.resolve(false))
jest.mock('~/auth/permissions/isMaintainerOfOrganisation', () => ({
  __esModule: true,
  default: jest.fn(props=>mockIsMainatainerOfOrganisation(props)),
  isMaintainerOfOrganisation: jest.fn(props=>mockIsMainatainerOfOrganisation(props))
}))

// MOCK getOrganisationsOfProject
const mockGetOrganisationsOfProject = jest.fn(props => Promise.resolve([]))
jest.mock('~/utils/getProjects', () => ({
  getOrganisationsOfProject: jest.fn(props=>mockGetOrganisationsOfProject(props))
}))

// MOCK deleteOrganisationFromProject
const mockDeleteOrganisationFromProject = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
const mockPatchOrganisationPositions = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
const mockAddOrganisationToProject = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'approved'
}))
jest.mock('~/utils/editProject', () => ({
  ...jest.requireActual('~/utils/editProject'),
  deleteOrganisationFromProject: jest.fn(props => mockDeleteOrganisationFromProject(props)),
  patchOrganisationPositions: jest.fn(props => mockPatchOrganisationPositions(props)),
  addOrganisationToProject: jest.fn(props=>mockAddOrganisationToProject(props))
}))

// MOCK searchForOrganisation
const mockSearchForOrganisation = jest.fn(props => Promise.resolve([] as any))
const mockCreateOrganisation = jest.fn(props => Promise.resolve({
  status: 201,
  message: 'new-organisation-id'
}))
jest.mock('~/utils/editOrganisation', () => ({
  ...jest.requireActual('~/utils/editOrganisation'),
  searchForOrganisation: jest.fn(props => mockSearchForOrganisation(props)),
  createOrganisation: jest.fn(props=>mockCreateOrganisation(props))
}))

describe('frontend/components/projects/edit/organisations/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders no organisations message', async() => {

    mockResolvedValue([])

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOrganisations />
        </WithProjectContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // shows no maintainers message
    const noOrganisations = screen.getByText('No participating organisations')
    expect(noOrganisations).toBeInTheDocument()

  })

  it('renders project organisations', async() => {
    // mock organisations response
    mockGetOrganisationsOfProject.mockResolvedValueOnce(mockOrganisationsOfProject as any)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOrganisations />
        </WithProjectContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // renders project organisations
    const organisations = screen.getAllByTestId('organisation-list-item')
    expect(organisations.length).toEqual(mockOrganisationsOfProject.length)
  })

  it('can add NEW organisation to project', async () => {
    const searchFor = 'Non existing organisation'
    const expectSlug = 'non-existing-organisation'
    const expectWebsite = 'https://website.com'
    // mock organisations response
    mockGetOrganisationsOfProject.mockResolvedValueOnce([])
    // mock no organisation found by search
    mockSearchForOrganisation.mockResolvedValueOnce([])
    // mock createOrganisation reponse
    mockCreateOrganisation.mockResolvedValueOnce({
      status: 201,
      message: 'new-organisation-id'
    })
    // mock addOrganisationToProject response
    mockAddOrganisationToProject.mockResolvedValueOnce({
      status: 200,
      message: 'approved'
    })

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOrganisations />
        </WithProjectContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // search for organisation
    const search = screen.getByRole('combobox', {
      name: config.findOrganisation.label
    })
    fireEvent.change(search, {target: {value: searchFor}})

    await waitFor(() => {
      // validate search organisation called
      expect(mockSearchForOrganisation).toBeCalledTimes(1)
      expect(mockSearchForOrganisation).toBeCalledWith({
        'searchFor': searchFor,
      })
    })

    // validate add option present
    const addNew = await screen.findByTestId('add-organisation-option')
    expect(addNew).toHaveTextContent(`Add "${searchFor}"`)
    // select add new organisation
    fireEvent.click(addNew)

    // expect add organisation modal
    const modal = await screen.findByRole('dialog')
    // validate name is searchFor value we used
    const title = within(modal).getByRole('textbox', {
      name: config.name.label
    })
    expect(title).toHaveValue(searchFor)

    // enter (valid) website
    const website = within(modal).getByRole('textbox', {
      name: config.website.label
    })
    // fill in website
    fireEvent.change(website, {target: {value: expectWebsite}})
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
      expect(mockCreateOrganisation).toBeCalledTimes(1)
      expect(mockCreateOrganisation).toBeCalledWith({
        'organisation': {
          'is_tenant': false,
          'logo_id': null,
          'name': searchFor,
          'parent': null,
          'primary_maintainer': null,
          'ror_id': null,
          'slug': expectSlug,
          'website': expectWebsite,
        },
        'token': mockSession.token,
      })
    })

    // validate 1 item added to organisation list
    const organisations = await screen.findAllByTestId('organisation-list-item')
    expect(organisations).toHaveLength(1)
  })

  it('can add RSD organisation to project', async() => {
    const searchFor = 'Vrije Universiteit Amsterdam'
    // return VU from mock data
    const firstOrg = mockOrganisationsOfProject[0]
    const rsdOption:any = {
      key: firstOrg.ror_id,
      label: firstOrg.name,
      data: {
        ...firstOrg,
        source: 'RSD'
      }
    }
    // mock organisations response
    mockGetOrganisationsOfProject.mockResolvedValueOnce([])
    // mock organisation found by search
    mockSearchForOrganisation.mockResolvedValueOnce([rsdOption])

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOrganisations />
        </WithProjectContext>
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
    expect(mockAddOrganisationToProject).toBeCalledTimes(1)
    expect(mockAddOrganisationToProject).toBeCalledWith({
      'position': 1,
      'organisation': firstOrg.id,
      'project': editProjectState.project.id,
      'role': 'participating',
      'token': mockSession.token,
    })
  })


  it('maintainer of organisation can edit organisation', async() => {
    // mock organisations response
    mockGetOrganisationsOfProject.mockResolvedValueOnce(mockOrganisationsOfProject as any)
    mockIsMainatainerOfOrganisation.mockResolvedValueOnce(true)
    mockIsMainatainerOfOrganisation.mockResolvedValueOnce(false)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOrganisations />
        </WithProjectContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // render first project organisation with edit button
    const editBtns = screen.getAllByTestId('EditIcon')
    expect(editBtns.length).toEqual(1)

    // click on edit button
    fireEvent.click(editBtns[0])

    const modal = await screen.findByRole('dialog')

    // validate organisation name
    const name = within(modal).getByRole('textbox', {
      name: config.name.label
    })
    expect(name).toHaveValue(mockOrganisationsOfProject[0].name)

    // cancel
    const cancelBtn = within(modal).getByRole('button', {
      name: 'Cancel'
    })
    fireEvent.click(cancelBtn)
    // modal should not be visible
    expect(modal).not.toBeVisible()
  })

  it('can remove organisation from project', async() => {
    // mock organisations response
    mockGetOrganisationsOfProject.mockResolvedValueOnce(mockOrganisationsOfProject as any)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={editProjectState}>
          <ProjectOrganisations />
        </WithProjectContext>
      </WithAppContext>
    )

    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // renders project organisations
    const organisations = screen.getAllByTestId('organisation-list-item')
    expect(organisations.length).toEqual(mockOrganisationsOfProject.length)

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
      expect(mockDeleteOrganisationFromProject).toBeCalledTimes(1)
      expect(mockDeleteOrganisationFromProject).toBeCalledWith({
        'organisation': mockOrganisationsOfProject[0].id,
        'project': editProjectState.project.id,
        'role': 'participating',
        'token': mockSession.token,
      })
      // patch organisation positions
      expect(mockPatchOrganisationPositions).toBeCalledTimes(1)
      // confirm number of organisations remaining
      const remained = screen.getAllByTestId('organisation-list-item')
      expect(remained.length).toEqual(mockOrganisationsOfProject.length-1)
    })
  })
})

