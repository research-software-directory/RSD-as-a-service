// used to support fetch with Jest and next-auth
import 'whatwg-fetch'
// specific
import '@testing-library/jest-dom/extend-expect'

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

// TOKEN
// process.env.PGRST_JWT_SECRET='reallyreallyreallyreallyverysafe'
