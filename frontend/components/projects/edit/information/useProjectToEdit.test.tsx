// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'

import useProjectToEdit from './useProjectToEdit'

import projectItem from '../../../../utils/jest/__mocks__/projectItem.json'
import urlForProject from './__mocks__/urlForProject.json'
import fundingOrganisations from './__mocks__/fundingOrganisations.json'
import researchDomainByProject from './__mocks__/researchDomainByProject.json'
import projectKeywords from './__mocks__/projectKeywords.json'


beforeEach(() => {
  jest.clearAllMocks()
})

function WithUseProjectToEdit() {
  const {loading,project} = useProjectToEdit({
    slug:'test-slug',
    token:'TEST-TOKEN'
  })

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>
      {JSON.stringify(project,null,2)}
    </div>
  )
}

it('useProjectToEdit returns at least project title', async () => {
  // resolve project item
  mockResolvedValueOnce([projectItem])
  // resolve links
  mockResolvedValueOnce(urlForProject)
  // resolve getOrganisationsOfProject
  mockResolvedValueOnce(fundingOrganisations)
  // resolve getResearchDomainsForProject
  mockResolvedValueOnce(researchDomainByProject)
  // resolve getKeywordsForProject
  mockResolvedValueOnce(projectKeywords)

  render(
    <WithUseProjectToEdit />
  )

  waitForElementToBeRemoved(screen.getByText(/Loading.../))

  await waitFor(() => {
    // check project title is in document
    screen.getByText(new RegExp(projectItem.title))
  })
})
