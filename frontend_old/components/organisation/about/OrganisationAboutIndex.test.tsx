// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {screen, render} from '@testing-library/react'
import {WithOrganisationContext} from '~/utils/jest/WithOrganisationContext'

import AboutPage from './index'
import mockOrganisation from '../__mocks__/mockOrganisation'

const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

describe('frontend/components/organisation/about/index.tsx', () => {

  it('renders markdown title # About page', () => {
    render(
      <WithOrganisationContext {...mockProps}>
        <AboutPage />
      </WithOrganisationContext>
    )
    const aboutPage = screen.getByText(/# About page/)
    expect(aboutPage).toBeInTheDocument()
  })

  it('renders placeholder when description=null', () => {
    mockOrganisation.description = null
    render(
      <WithOrganisationContext {...mockProps}>
        <AboutPage />
      </WithOrganisationContext>
    )
    const notDefined = screen.getByText('About section not defined')
    expect(notDefined).toBeInTheDocument()
  })

})
