// SPDX-FileCopyrightText: 2021 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../utils/jest/WrappedComponents'
import AppFooter from './AppFooter'

it('should render footer with role contentinfo',()=>{
  render(WrappedComponentWithProps(AppFooter))
  const footer = screen.getByRole('contentinfo')
  expect(footer).toBeInTheDocument()
})
