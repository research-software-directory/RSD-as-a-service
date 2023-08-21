// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitFor} from '@testing-library/react'
import {AuthProvider, useAuth, REFRESH_MARGIN, getSessionSeverSide, Session} from './index'

const session:Session = {
  user: null,
  token: 'TEST_TOKEN',
  status: 'loading'
}

const mockRefreshSession = jest.fn(()=>Promise.resolve(session))
jest.mock('./refreshSession', () => {
  return {
    refreshSession: jest.fn(()=> mockRefreshSession())
  }
})

function ChildComponent() {
  // const {useAuth} = auth
  const {session} = useAuth()
  return (
    <div>
      <h1>Child component</h1>
      <pre>{JSON.stringify(session,null,2)}</pre>
    </div>
  )
}

function WrappedComponent(session:Session) {
  // const {AuthProvider} = auth
  return (
    <AuthProvider session={session}>
      <ChildComponent />
    </AuthProvider>
  )
}

it('provides info to children', () => {
  // spread session to pass props properly
  render(<WrappedComponent {...session} />)
  // validate child component present
  const child = screen.getByRole('heading', {name: 'Child component'})
  expect(child).toBeInTheDocument()
  // validate values from dummy session
  const token = screen.getByText(new RegExp(session.token))
  expect(token).toBeInTheDocument()
})

it('schedules token refresh and calls refreshSession after timeout', async () => {
  // const {REFRESH_MARGIN} = auth
  // calculate token refresh time from now
  const expires = Math.round((Date.now() + REFRESH_MARGIN + 1000) / 1000)
  const session:Session = {
    'user': {
      'role': 'rsd_user',
      'iss': 'rsd_auth',
      'name': 'Test user',
      'exp': expires,
      'account': '4521514d-733a-472b-a34f-ace43bc308c0'
    },
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoicnNkX3VzZXIiLCJpc3MiOiJyc2RfYXV0aCIsImV4cCI6MTY0NjMwNDk2NywiYWNjb3VudCI6IjQ1MjE1MTRkLTczM2EtNDcyYi1hMzRmLWFjZTQzYmMzMDhjMCJ9.LFXaALl8xxjoc24H-eDpZfm-0VL9MAfieuAIw8teSvs',
    'status': 'authenticated'
  }

  jest.useFakeTimers()
  const setTimeout = jest.spyOn(global, 'setTimeout')
  setTimeout.mockClear()

  // spread session to pass props properly
  render(<WrappedComponent {...session} />)

  // validate timeout is called
  expect(setTimeout).toHaveBeenCalled()
  // take last call
  const lastCall = setTimeout.mock.calls[setTimeout.mock.calls.length-1]
  // last call time should be more than 0 as we added 1000 ms
  expect(lastCall[1]).toBeGreaterThan(0)
  // advance time
  jest.runOnlyPendingTimers()
  await waitFor(() => {
    expect(mockRefreshSession).toHaveBeenCalledTimes(1)
  })
})

it('getSessionSeverSide extracts token from headers', () => {
  const dummyToken ='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoicnNkX3VzZXIiLCJpc3MiOiJyc2RfYXV0aCIsImV4cCI6MTY0NjMwNDk2NywiYWNjb3VudCI6IjQ1MjE1MTRkLTczM2EtNDcyYi1hMzRmLWFjZTQzYmMzMDhjMCJ9.LFXaALl8xxjoc24H-eDpZfm-0VL9MAfieuAIw8teSvs'
  const req:any = {
    headers: {
      cookie:`rsd_token=${dummyToken}; Secure; HttpOnly; Path=/; SameSite=Lax;`
    }
  }
  const res:any = {
    setHeader: jest.fn()
  }
  const session:any = getSessionSeverSide(req, res)
  expect(session.token).toEqual(dummyToken)
  // it fails as we do not have jwt key provided
  expect(session.status).toEqual('jwtkey')
})
