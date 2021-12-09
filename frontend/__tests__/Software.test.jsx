import {render, screen} from '@testing-library/react'
import SoftwareIndexPage, {getServerSideProps} from '../pages/software/index'
import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

// mock fetch response
// import {enableFetchMocks} from 'jest-fetch-mock'
import softwareItem from './__mocks__/softwareItem.json'
const mockedResponse=[softwareItem]
// enableFetchMocks()
// fetch.mockResponse(JSON.stringify(mockedResponse))
global.fetch=jest.fn(()=>({
  status:200,
  statusText:"OK",
  json: jest.fn(()=>Promise.resolve(mockedResponse))
}))


describe('pages/software/index.tsx', () => {

  it('getServerSideProps returns mocked values in the props', async() => {
    const resp = await getServerSideProps({})
    expect(resp).toEqual({
      props:{
        software: mockedResponse
      }
    })
  })

  it('renders heading with the title Software', async() => {
    render(WrappedComponentWithProps(
      SoftwareIndexPage,{
        software:mockedResponse,
        session:{
          expires: "test",
          user: {name:"Test user"}
        }
      }
    ))
    const heading = await screen.findByRole("heading",{
      name: "Software"
    })
    expect(heading).toBeInTheDocument()
    expect(heading.innerHTML).toEqual("Software")
  })
})
