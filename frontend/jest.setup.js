// used to support fetch with Jest and next-auth
import "whatwg-fetch";
// specific
import "@testing-library/jest-dom/extend-expect"

// TODO! this lib does not work out-of-the-box with next-auth if activated here
// for now we use whatwg-fetch module globaly and mock fetch manually when needed -> further investigation needed
// https://www.npmjs.com/package/jest-fetch-mock
// import jestFetchMock from "jest-fetch-mock"
// enable fetch mocks globaly in Jest
// then you can call it in your tests with fetch.mockResponse()
// jestFetchMock.dontMock();
