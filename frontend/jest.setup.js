// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// used to support fetch with Jest
import 'whatwg-fetch'
// custom matchers for jest
import '@testing-library/jest-dom'

// retry 2 times
// jest.retryTimes(1, {
//   logErrorsBeforeRetry: false
// })

// TODO! investigate other options beside mocking
// MOCK REACT-MARKDOWN library as it fails to load in current setup
// there seem to be problem with ESM modules and Jest loading these
jest.mock('react-markdown', () => {
  // return mock function (functional react component)
  return jest.fn((props) => {
    // console.log("Mock react markdown...props...", props)
    if (props.hasOwnProperty('children')===true) {
      return props['children']
    } else {
      return 'No children'
    }
  })
})
// MOCK REACT-MARKDOWN plugin as it fails to load in current setup
// there seem to be problem with ESM modules and Jest loading these
jest.mock('remark-gfm', () => {
  // return mock function (functional react component)
  return jest.fn((props) => {
    // console.log("Mock react markdown...props...", props)
    if (props.hasOwnProperty('children')===true) {
      return props['children']
    } else {
      return 'No children'
    }
  })
})

// MOCK REMARK-BREAKS plugin as it fails to load in current setup
// there seem to be problem with ESM modules and Jest loading these
jest.mock('remark-breaks', jest.fn((...props) => {
  // console.log('remark-breaks...', props)
  return props
}))

// MOCK REHYPE-EXTERNAL-LINKS plugin as it fails to load in current setup
// there seem to be problem with ESM modules and Jest loading these
jest.mock('rehype-external-links', jest.fn((...props) => {
  // console.log('remark-breaks...', props)
  return props
}))

// MOCK app router (next/navigation)
// NOTE! You can overwrite/validate this mock by simply importing the method you need to test.
// For example:
// import {notFound} from 'next/navigation'
// expect(notFound).toBeCalledTimes(1)
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(()=>{
    return {
      // pathname: 'testPaths',
      asPath: 'test-path',
      // ... whatever else you call on `router`
      query: {
        test: 'query',
        slug: 'test-slug'
      }
    }
  }),
  usePathname: jest.fn(()=>'/'),
  useParams: jest.fn(()=>[]),
  useSearchParams: jest.fn(()=>({
    get: jest.fn(),
    getAll: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    has: jest.fn()
  })),
  notFound: jest.fn()
}))

// mock console log
global.console = {
  ...global.console,
  error: jest.fn(),
  warn: jest.fn(),
  // do not mock log -> we can debug using console.log
  // log: jest.fn()
}

// MOCK scrollTo used in markdown component (not present in jsdom)
window.scrollTo = jest.fn()

// global search
jest.mock('~/components/GlobalSearchAutocomplete/apiGlobalSearch')
jest.mock('~/components/GlobalSearchAutocomplete/useHasRemotes')

// categories api
jest.mock('~/components/category/apiCategories')

// TOKEN
// process.env.PGRST_JWT_SECRET='reallyreallyreallyreallyverysafe'

afterEach(() => {
  // call node garbage collection after each test is performed.
  // In node v18/v16 there seem to be a change in memory management that causes memory leaks
  // when running tests in Jest. We manually call garbage collection after each test to reduce memory use.
  if (global.gc) global.gc()
})
