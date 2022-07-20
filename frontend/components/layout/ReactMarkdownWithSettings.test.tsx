// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import ReactMarkdownWithSettings from './ReactMarkdownWithSettings'

/**
 * We need to mock remark-breaks for now as it is breaking Jest setup

  Jest encountered an unexpected token
  Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

  Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

  By default "node_modules" folder is ignored by transformers.

  Here's what you can do:
    • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
    • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
    • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
    • If you need a custom transformation specify a "transform" option in your config.
    • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

  You'll find more details and examples of these config options in the docs:
  https://jestjs.io/docs/configuration
  For information about custom transformations, see:
  https://jestjs.io/docs/code-transformation

  Details:

  /home/dusan/dev/eScience/RSD-as-a-service/frontend/node_modules/remark-breaks/index.js:6
  import {visit} from 'unist-util-visit'
  ^^^^^^
  SyntaxError: Cannot use import statement outside a module
*/
jest.mock('remark-breaks', jest.fn((...props) => {
  // console.log('remark-breaks...', props)
  return props
}))

it('renders makrdown component', () => {
  const markdown = '# Test page one'
  render(<ReactMarkdownWithSettings
    markdown={markdown}
  />)
  const content = screen.getByText(markdown)
  expect(content).toBeInTheDocument()
})
