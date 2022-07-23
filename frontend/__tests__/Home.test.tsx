// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import Home from '../pages/index'

import {defaultRsdSettings} from '~/config/rsdSettingsReducer'
import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'

describe('pages/index.tsx', () => {
  const props = {
    host: {
      name: 'rsd'
    },
    counts: {
      software: 1,
      projects: 2,
      organisations: 3
    }
  }
  it('renders default RSD Home page when host=rsd', () => {
    render(WrappedComponentWithProps(Home, {
      props
    }))
    const page = screen.getByTestId('rsd-home-page')
    expect(page).toBeInTheDocument()
  })

  it('renders default RSD Home page when host=""', () => {
    defaultRsdSettings.host.name=''
    render(WrappedComponentWithProps(Home, {
      props,
      settings: defaultRsdSettings
    }))
    const page = screen.getByTestId('rsd-home-page')
    expect(page).toBeInTheDocument()
  })

  it('renders default RSD Home page when no host prop', () => {
    render(WrappedComponentWithProps(Home))
    const page = screen.getByTestId('rsd-home-page')
    expect(page).toBeInTheDocument()
  })

  it('renders Helmholtz Home page when host=helmholtz', () => {
    defaultRsdSettings.host.name='helmholtz'
    render(WrappedComponentWithProps(Home, {
      props,
      settings: defaultRsdSettings
    }))
    const page = screen.getByTestId('rsd-helmholtz-home')
    expect(page).toBeInTheDocument()
  })

  it('renders Helmholtz Home page when host=HELMHoltz', () => {
    defaultRsdSettings.host.name='HELMholtz'
    render(WrappedComponentWithProps(Home, {
      props,
      settings: defaultRsdSettings
    }))
    const page = screen.getByTestId('rsd-helmholtz-home')
    expect(page).toBeInTheDocument()
  })
})
