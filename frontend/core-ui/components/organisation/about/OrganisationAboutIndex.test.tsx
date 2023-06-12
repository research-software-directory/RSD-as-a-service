// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {screen, render} from '@testing-library/react'

import AboutPage from './index'
import mockOrganisation from '../__mocks__/mockOrganisation'

describe('frontend/components/organisation/about/index.tsx', () => {

  it('renders markdown content', () => {
    // mockOrganisation.description=null
    render(
      <AboutPage organisation={mockOrganisation} isMaintainer={true} />
    )
    const aboutPage = screen.getByTestId('organisation-about-page')
    expect(aboutPage).toBeInTheDocument()
  })

  it('renders placeholder when description=null', () => {
    mockOrganisation.description = null
    render(
      <AboutPage organisation={mockOrganisation} isMaintainer={true} />
    )
    const notDefined = screen.getByText('About section not defined')
    expect(notDefined).toBeInTheDocument()
  })

})
