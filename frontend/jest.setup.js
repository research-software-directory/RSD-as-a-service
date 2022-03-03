// used to support fetch with Jest and next-auth
import 'whatwg-fetch'
// specific
import '@testing-library/jest-dom/extend-expect'

// TODO! this lib does not work out-of-the-box with next-auth if activated here
// for now we use whatwg-fetch module globaly and mock fetch manually when needed -> further investigation needed
// https://www.npmjs.com/package/jest-fetch-mock
// import jestFetchMock from "jest-fetch-mock"
// enable fetch mocks globaly in Jest
// then you can call it in your tests with fetch.mockResponse()
// jestFetchMock.dontMock();

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

// TOKEN
// process.env.PGRST_JWT_SECRET='reallyreallyreallyreallyverysafe'
