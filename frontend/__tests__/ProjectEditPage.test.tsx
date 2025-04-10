// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'

import ProjectEditPage from '../pages/projects/[slug]/edit/[page]'
import {editProjectPage} from '~/components/projects/edit/editProjectPages'
import editProjectState from '~/components/projects/edit/__mocks__/editProjectState'
import {projectInformation as config} from '~/components/projects/edit/information/config'
import mockProjectToEdit from '~/components/projects/edit/information/__mocks__/useProjectToEditData.json'

// MOCKS
// we mock default providers used in page header
jest.mock('~/auth/api/useLoginProviders')
// mock user agreement call
jest.mock('~/components/user/settings/agreements/useUserAgreements')
// global search
jest.mock('~/components/GlobalSearchAutocomplete/apiGlobalSearch')
jest.mock('~/components/GlobalSearchAutocomplete/useHasRemotes')

// MOCK isMaintainerOf
const mockIsMaintainer = jest.fn(props => Promise.resolve(false))
jest.mock('~/auth/permissions/isMaintainerOf', () => ({
  isMaintainerOf: jest.fn(props=>mockIsMaintainer(props))
}))

// MOCK useProjectToEdit (default mock)
jest.mock('~/components/projects/edit/information/useProjectToEdit')
// mock default keywords list (autocomplete)
jest.mock('~/components/projects/edit/information/searchForKeyword')

// MOCK IntersectionObserver
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
// you can also pass the mock implementation
// to jest.fn as an argument
window.IntersectionObserver = jest.fn(() => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
} as any))

const mockProps = {
  // information page
  pageIndex: 0,
  project: {
    id:'ca6dbe55-ef59-4f4b-b8bc-eb465e130b87',
    slug: 'test-software-1',
    title: 'Test project 1'
  }
}

describe('pages/projects/[slug]/edit/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders 401 page when no session', () => {

    render(
      <WithAppContext>
        <WithFormContext>
          <WithProjectContext>
            <ProjectEditPage {...mockProps} />
          </WithProjectContext>
        </WithFormContext>
      </WithAppContext>
    )

    const p401 = screen.getByRole('heading', {
      name: '401'
    })

    expect(p401).toBeInTheDocument()

  })

  it('renders 403 page when isMaintainer=false', async() => {

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithFormContext>
          <WithProjectContext>
            <ProjectEditPage {...mockProps} />
          </WithProjectContext>
        </WithFormContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const p403 = screen.getByRole('heading', {
      name: '403'
    })
    expect(p403).toBeInTheDocument()
  })

  it('renders info content when isMaintainer=true', async () => {
    // return isMaintainer
    mockIsMaintainer.mockResolvedValueOnce(true)
    // render components
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithFormContext>
          <WithProjectContext state={editProjectState}>
            <ProjectEditPage {...mockProps} />
          </WithProjectContext>
        </WithFormContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    //validate all nav items shown
    const navItems = screen.getAllByTestId('edit-project-nav-item')
    expect(navItems.length).toEqual(editProjectPage.length)

    // wait for info loader to be removed
    // await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // validate info section is loaded
    const editInfoForm = await screen.findByTestId('project-information-form')
    expect(editInfoForm).toBeInTheDocument()

    // validate project title
    const title = screen.getByRole('textbox', {
      name: config.title.label
    })
    expect(title).toHaveValue(mockProjectToEdit.title)
  })
})
