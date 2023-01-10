// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import MarkdownPage from '../pages/page/[slug]'

describe('pages/page/[slug].tsx', () => {

  it('renders markdown page', () => {
    const mockMarkdown='test-markdown-content-to-be-showed-on-page'
    const props = {
      title: 'Test page title',
      markdown: mockMarkdown
    }
    // render page
    render(<MarkdownPage {...props} />)

    const markdown = screen.getByText(mockMarkdown)
    expect(markdown).toBeInTheDocument()
  })

})
