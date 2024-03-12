// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import OrcidLink from './OrcidLink'

it('renders ORCID link',()=>{

  const orcid = 'ORCID-1234'

  render(<OrcidLink orcid={orcid} />)

  const link = screen.getByRole('link')
  expect(link).toHaveAttribute('href',`https://orcid.org/${orcid}`)

})
