// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../utils/jest/WrappedComponents'
import AppFooter from './'

it('should render footer with role contentinfo',()=>{
  render(WrappedComponentWithProps(AppFooter))
  const footer = screen.getByRole('contentinfo')
  expect(footer).toBeInTheDocument()
})
