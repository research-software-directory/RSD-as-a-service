// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AutosaveProjectLinks from './AutosaveProjectLinks'
import {projectInformation as config} from './config'


// MOCKS
import mockUrlProject from './__mocks__/urlForProject.json'
const mockProps = {
  project_id: 'test-project-id',
  url_for_project: mockUrlProject
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUpdateProjectLink = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockAddProjectLink = jest.fn(props => Promise.resolve({
  status: 201,
  message: 'project-link-id'
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteProjectLink = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchProjectLinkPositions = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
jest.mock('~/components/projects/edit/apiEditProject', () => ({
  updateProjectLink: jest.fn(props => mockUpdateProjectLink(props)),
  addProjectLink: jest.fn(props => mockAddProjectLink(props)),
  deleteProjectLink: jest.fn(props => mockDeleteProjectLink(props)),
  patchProjectLinkPositions: jest.fn(props => mockPatchProjectLinkPositions(props))
}))


beforeEach(() => {
  jest.clearAllMocks()
})

it('renders project links', () => {
  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveProjectLinks {...mockProps} />
    </WithAppContext>
  )

  const link = screen.getAllByTestId('project-link-item')
  expect(link.length).toEqual(mockUrlProject.length)
})

it('can add new link', async() => {
  // no links
  mockProps.url_for_project = []
  const mockInputs = {
    title: 'Test link title',
    url: 'https://google.com/test-link'
  }

  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveProjectLinks {...mockProps} />
    </WithAppContext>
  )

  // click on add button
  const addBtn = screen.getByRole('button', {
    name: 'Add'
  })
  fireEvent.click(addBtn)

  const modal = screen.getByRole('dialog')

  // title
  const title = within(modal).getByRole('textbox', {
    name: config.url_for_project.title.placeholder
  })
  fireEvent.change(title, {target: {value: mockInputs.title}})

  // url
  const url = within(modal).getByRole('textbox', {
    name: config.url_for_project.url.placeholder
  })
  fireEvent.change(url,{target:{value: mockInputs.url}})

  // save
  const saveBtn = within(modal).getByRole('button', {
    name: 'Save'
  })

  await waitFor(() => {
    // click on add button
    expect(saveBtn).toBeEnabled()
    fireEvent.click(saveBtn)
  })

  // wait for modal to close
  await waitForElementToBeRemoved(modal)

  // validate addProjectLink api called
  expect(mockAddProjectLink).toHaveBeenCalledTimes(1)
  // get added links
  const links = screen.getAllByTestId('project-link-item')
  expect(links.length).toEqual(1)
  expect(links[0]).toHaveTextContent(mockInputs.title)
})

it('can edit link', async() => {
  // no links
  mockProps.url_for_project = mockUrlProject
  const mockInputs = {
    title: 'Updated test link title',
    url: 'https://google.com/updated-test-link'
  }

  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveProjectLinks {...mockProps} />
    </WithAppContext>
  )

  // get added links
  const links = screen.getAllByTestId('project-link-item')
  // edit first link
  const editBtn = within(links[0]).getByRole('button', {
    name: 'edit'
  })
  fireEvent.click(editBtn)
  // get modal refrence
  const modal = screen.getByRole('dialog')

  // title
  const title = within(modal).getByRole('textbox', {
    name: config.url_for_project.title.placeholder
  })
  fireEvent.change(title, {target: {value: mockInputs.title}})

  // url
  const url = within(modal).getByRole('textbox', {
    name: config.url_for_project.url.placeholder
  })
  fireEvent.change(url,{target:{value: mockInputs.url}})

  // save
  const saveBtn = within(modal).getByRole('button', {
    name: 'Save'
  })

  await waitFor(() => {
    // click on add button
    expect(saveBtn).toBeEnabled()
    fireEvent.click(saveBtn)
  })

  // wait for modal to close
  await waitForElementToBeRemoved(modal)
  // validate api call is made
  expect(mockUpdateProjectLink).toHaveBeenCalledTimes(1)
  // validate link title is updated
  expect(links[0]).toHaveTextContent(mockInputs.title)
})

it('can delete link', async() => {
  // no links
  mockProps.url_for_project = mockUrlProject

  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveProjectLinks {...mockProps} />
    </WithAppContext>
  )

  // get added links
  const links = screen.getAllByTestId('project-link-item')
  // edit first link
  const editBtn = within(links[0]).getByRole('button', {
    name: 'delete'
  })
  fireEvent.click(editBtn)

  await waitFor(() => {
    // validate delete api called
    expect(mockDeleteProjectLink).toHaveBeenCalledTimes(1)
    // validate link position patched
    expect(mockPatchProjectLinkPositions).toHaveBeenCalledTimes(1)
    // confirm link removed
    const remainedLinks = screen.getAllByTestId('project-link-item')
    expect(remainedLinks.length).toEqual(mockUrlProject.length-1)
  })
})
