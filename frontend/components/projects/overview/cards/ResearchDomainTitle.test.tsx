// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import ResearchDomainTitle from './ResearchDomainTitle'

const mockData = {
  ls: {
    key: 'LS',
    label: 'Life Sciences'
  },
  pe: {
    key: 'PE',
    label: 'Physical Sciences and Engineering'
  },
  sh: {
    key: 'SH',
    label: 'Social Sciences and Humanities'
  }
}

it('renders LS domain label', () => {
  render(
    <ResearchDomainTitle domains={[mockData.ls.key]} />
  )
  screen.getByText(mockData.ls.label)
})

it('renders PE domain label', () => {
  render(
    <ResearchDomainTitle domains={[mockData.pe.key]} />
  )
  screen.getByText(mockData.pe.label)
})

it('renders SH domain label', () => {
  render(
    <ResearchDomainTitle domains={[mockData.sh.key]} />
  )
  screen.getByText(mockData.sh.label)
})
