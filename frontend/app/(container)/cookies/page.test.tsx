// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'

import CookiesPage from '~/app/(container)/cookies/page'
import {WithAppContext} from '~/utils/jest/WithAppContext'

// use DEFAULT MOCK for login providers list
// required when AppHeader component is used
jest.mock('~/auth/api/useLoginProviders')

// MOCK global search
jest.mock('~/components/GlobalSearchAutocomplete/apiGlobalSearch')
jest.mock('~/components/GlobalSearchAutocomplete/useHasRemotes')

// MOCK next/cookies requests
const mockGetCookies = jest.fn((prop:string)=>{
  // console.log('mockGetCookies...',prop)
  return {key: prop, value: prop}
})
jest.mock('next/headers',()=>{
  return {
    cookies: jest.fn(()=>Promise.resolve({
      get: mockGetCookies
    }))
  }
})

describe('~/app/(container)/cookies/page',()=>{

  it('renders cookies page with title Cookies', async() => {
    const ResolvedPage = await CookiesPage()
    render(
      <WithAppContext>
        {ResolvedPage}
      </WithAppContext>
    )

    const heading = await screen.findByRole('heading',{
      name: 'Cookies'
    })

    expect(heading).toBeInTheDocument()
    expect(heading.innerHTML).toEqual('Cookies')
  })


  it('renders cookies page with anonymous statistics checkbox ON', async() => {
    // MOCK MATOMO_ID
    global.process.env.MATOMO_ID=9 //NOSONAR
    // resolve async component
    const ResolvedPage = await CookiesPage()

    render(
      <WithAppContext>
        {ResolvedPage}
      </WithAppContext>
    )

    const heading = await screen.findByRole('heading',{
      name: 'Tracking cookies'
    })
    expect(heading).toBeInTheDocument()


    const checkbox = await screen.findByRole('switch', {
      checked:true
    })
    expect(checkbox).toBeInTheDocument()
  })

  it('renders cookies page with anonymous statistics checkbox OFF', async() => {
    // mock first response (mtm_consent)
    mockGetCookies.mockReturnValueOnce({key:'mtm_consent',value:false})
    // MOCK MATOMO_ID
    global.process.env.MATOMO_ID=9 //NOSONAR
    // resolve async component
    const ResolvedPage = await CookiesPage()

    render(
      <WithAppContext>
        {ResolvedPage}
      </WithAppContext>
    )

    const checkbox = await screen.findByRole('switch', {
      checked:false
    })
    expect(checkbox).toBeInTheDocument()
  })

})

