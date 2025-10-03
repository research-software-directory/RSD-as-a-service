// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AutosaveResearchDomains from './AutosaveResearchDomains'

// MOCKS
import mockResearchDomain from './__mocks__/researchDomain.json'
import mockResearchDomainByProject from './__mocks__/researchDomainByProject.json'

// MOCK addResearchDomainToProject
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockAdResearchDomainToProject = jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteResearchDomainFromProject=jest.fn(props => Promise.resolve({
  status: 200,
  message: 'OK'
}))
jest.mock('~/components/projects/edit/apiEditProject', () => ({
  addResearchDomainToProject: jest.fn(props => mockAdResearchDomainToProject(props)),
  deleteResearchDomainFromProject: jest.fn(props=> mockDeleteResearchDomainFromProject(props))
}))

// MOCK props
const mockProps = {
  project_id: 'test-project-id',
  research_domains: mockResearchDomainByProject as any
}

beforeEach(() => {
  jest.clearAllMocks()
  // resolve reseach domain list
  mockResolvedValueOnce(mockResearchDomain)
})

it('renders project domains', () => {
  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveResearchDomains {...mockProps} />
    </WithAppContext>
  )
  const domains = screen.getAllByTestId('research-domain-chip')
  // check first title
  expect(domains[0]).toHaveTextContent(mockResearchDomainByProject[0].name)
  // check items count
  expect(domains.length).toEqual(mockResearchDomainByProject.length)
})

it('can add domains', async() => {
  // start clean
  mockProps.research_domains = []

  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveResearchDomains {...mockProps} />
    </WithAppContext>
  )

  // SELECT L1 DOMAIN
  const l1 = screen.getByTestId('l1-domain-select')
  const l1Btn = within(l1).getByRole('combobox')
  // we need to use mouseDown event for MUI select
  fireEvent.mouseDown(l1Btn)
  // and we need to wait for items to apprear
  await waitFor(() => {
    const l1items = screen.getAllByTestId('l1-domain-item')
    // select first item
    fireEvent.click(l1items[0])
  })

  // SELECT L2 DOMAIN
  const l2 = screen.getByTestId('l2-domain-select')
  const l2Btn = within(l2).getByRole('combobox')
  // we need to use mouseDown event for MUI select
  fireEvent.mouseDown(l2Btn)

  await waitFor(() => {
    const l2items = screen.getAllByTestId('l2-domain-item')
    // select first item
    fireEvent.click(l2items[0])
  })

  // SELECT L3 DOMAIN
  const l3 = screen.getByTestId('l3-domain-select')
  const l3Btn = within(l3).getByRole('combobox')
  // we need to use mouseDown event for MUI select
  fireEvent.mouseDown(l3Btn)

  await waitFor(() => {
    const l3items = screen.getAllByTestId('l3-domain-item')
    // select first item
    fireEvent.click(l3items[0])
  })

  // ADD selected research domains
  const addBtn = screen.getByRole('button', {
    name: 'Add'
  })
  fireEvent.click(addBtn)

  // validate API call
  expect(mockAdResearchDomainToProject).toHaveBeenCalledTimes(1)

  await waitFor(() => {
    // validate 3 chips added
    const domains = screen.getAllByTestId('research-domain-chip')
    expect(domains.length).toEqual(3)
  })
})

it('can delete research domain', async() => {
  // start clean
  mockProps.research_domains = mockResearchDomainByProject

  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveResearchDomains {...mockProps} />
    </WithAppContext>
  )

  const domains = screen.getAllByTestId('research-domain-chip')
  // remove first domain
  const cancelIcon = within(domains[0]).getByTestId('CancelIcon')
  fireEvent.click(cancelIcon)

  expect(mockDeleteResearchDomainFromProject).toHaveBeenCalledTimes(1)

  await waitFor(() => {
    const remainedDomains = screen.getAllByTestId('research-domain-chip')
    expect(remainedDomains.length).toEqual(domains.length-1)
  })
})
