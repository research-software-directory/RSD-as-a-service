import {render, screen} from '@testing-library/react'
import SoftwareItemPage, {getServerSideProps} from '../pages/software/[slug]/index'
import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

import {getSoftwareItem} from '../utils/getSoftware'

// mock fetch response
import softwareItem from './__mocks__/softwareItem.json'
// const mockedResponse=[softwareItem]
// global.fetch=jest.fn(()=>({
//   status:206,
//   headers:{
//     // mock getting Content-Range from the header
//     get:()=>'0-11/200'
//   },
//   statusText:'OK',
//   json: jest.fn(()=>Promise.resolve(mockedResponse))
// }))

describe('pages/software/[slug]/index.tsx', () => {

  // TODO
  it.skip('getServerSideProps returns mocked values in the props', async() => {
    const resp = await getServerSideProps({params:{slug:'test-slug'}})
    expect(resp).toEqual({
      props:{
        // count is extracted from response header
        count:200,
        // default query param values
        page:0,
        rows:12,
        // mocked data
        software: softwareItem,
        tags: undefined,
      }
    })
  })

  it.skip('renders heading with software title', async() => {
    render(WrappedComponentWithProps(
      SoftwareItemPage,{
        slug:'test-slug',
        software: softwareItem,
        // citationInfo:
      }
    ))
    const title = await screen.findByText(softwareItem.brand_name)
    expect(title).toBeInTheDocument()
    screen.debug()
  })
})
