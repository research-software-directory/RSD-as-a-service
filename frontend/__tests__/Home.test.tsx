// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import Home from '../pages/index'

import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

describe('pages/index.tsx', () => {
  beforeEach(()=>{
    // fetch.mockResponse(JSON.stringify([]))
    render(WrappedComponentWithProps(Home))
  })
  it('renders Home page with the title', () => {
    const heading = screen.getByRole('heading', {
      name: 'Improving the impact of research software'
    })
    expect(heading).toBeInTheDocument()
  })
})
