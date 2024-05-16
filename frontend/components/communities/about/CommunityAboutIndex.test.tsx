// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {screen, render} from '@testing-library/react'

import AboutPage from './index'
import mockCommunity from '../__mocks__/mockCommunity'

describe('frontend/components/community/about/index.tsx', () => {

  it('renders markdown title # About page', () => {
    render(
      <AboutPage description={mockCommunity?.description ?? undefined} />
    )
    const aboutPage = screen.getByText(/# About page/)
    expect(aboutPage).toBeInTheDocument()
  })

})
