// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import ReactMarkdownWithSettings from './ReactMarkdownWithSettings'

it('renders makrdown component', () => {
  const markdown = '# Test page one'
  render(<ReactMarkdownWithSettings
    markdown={markdown}
  />)
  const content = screen.getByText(markdown)
  expect(content).toBeInTheDocument()
})
