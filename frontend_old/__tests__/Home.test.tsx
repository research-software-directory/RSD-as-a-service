// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import Home from '../pages/index'

import {defaultRsdSettings} from '~/config/rsdSettingsReducer'
import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'

// use DEFAULT MOCK for login providers list
// required when AppHeader component is used
jest.mock('~/auth/api/useLoginProviders')
// use DEFAULT MOCK for organisation list used by Helmholtz homepage
jest.mock('~/components/home/helmholtz/useOrganisations')

const props = {
    host: {
      name: 'rsd'
    },
    counts: {
      software_cnt: 1111,
      project_cnt: 2222,
      organisation_cnt: 3333
    }
  }

describe('pages/index.tsx', () => {
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

  it('renders counts on RSD Home page', () => {
    render(WrappedComponentWithProps(Home,{props}))
    // software_cnt
    const software = screen.getByText(`${props.counts.software_cnt} Software`)
    expect(software).toBeInTheDocument()
    // project_cnt
    const project = screen.getByText(`${props.counts.project_cnt} Projects`)
    expect(project).toBeInTheDocument()
    // organisation_cnt
    const organisation = screen.getByText(`${props.counts.organisation_cnt} Organisations`)
    expect(organisation).toBeInTheDocument()
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
