// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {
  createJsonHeaders,
  extractReturnMessage,
  extractErrorMessages,
  extractRespFromGraphQL,
  getBaseUrl,
  promiseWithTimeout
} from './fetchHelpers'


it('creates fetch header without token', () => {
  const header = createJsonHeaders()

  expect(header).toEqual({
    'Content-Type': 'application/json'
  })
})

it('creates fetch header WITH token', () => {
  const token = 'TEST-TOKEN'
  const header = createJsonHeaders(token)

  expect(header).toEqual({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
})

it('extracts OK response message and returns id for [200, 201, 204, 206]', async() => {
  // all these are OK and simplyfied to 200
  const statuses = [200, 201, 204, 206]

  for (const status of statuses) {
    const resp: any = {
      status,
      statusText: 'OK'
    }
    const response = await extractReturnMessage(resp,'data-id')

    expect(response).toEqual({
      // always returns 200
      status: 200,
      message: 'data-id'
    })
  }
})

it('extracts 4xx response message', async () => {
  // not authorized, 404 seem to be returned in some cases
  const statuses = [401, 403, 404, 409]
  for (const status of statuses) {
    const resp: any = {
      status,
      statusText: `Original status text for ${status}`,
      json: () => Promise.resolve({message: `Custom message for ${status}`})
    }
    const response = await extractReturnMessage(resp)

    expect(response.status).toEqual(status)
    expect(response.message).toContain(resp.statusText)
    // only 409 has custom PostgREST message
    if (status === 409) {
      expect(response.message).toContain(`Custom message for ${status}`)
    }
  }

})

it('extracts other response statuses with custom PostgREST message', async () => {
  //
  const statuses = [300, 500, 600, 700]
  for (const status of statuses) {
    const resp: any = {
      status,
      statusText: `Original status text for ${status}`,
      json: () => Promise.resolve({message: `Custom message for ${status}`})
    }
    const response = await extractReturnMessage(resp)

    expect(response.status).toEqual(status)
    expect(response.message).toContain(`Custom message for ${status}`)
    // expect(response.message).toContain()
  }
})

it('extracts other response statuses with default statusText', async () => {
  //
  const statuses = [300, 500, 600, 700]
  for (const status of statuses) {
    const resp: any = {
      status,
      statusText: `Original status text for ${status}`
    }
    const response = await extractReturnMessage(resp)

    expect(response.status).toEqual(status)
    expect(response.message).toContain(resp.statusText)
  }
})

it('extracts error messages from response array', async () => {
  //
  const statuses = [200, 300, 500, 600, 700]
  const responses = []
  for (const status of statuses) {
    const resp: any = {
      status,
      message: `Original status text for ${status}`
    }
    responses.push(resp)
  }

  const errors = extractErrorMessages(responses)

  // we have one 200 resp in the array
  expect(errors.length).toEqual(statuses.length-1)
})

it('extractRespFromGraphQL OK response', async () => {
  const data = 'GraphQL data returned'
  const resp: any = {
    status:200,
    statusText: 'OK',
    json: () => Promise.resolve({data})
  }

  const result = await extractRespFromGraphQL(resp)
  expect(result.status).toEqual(resp.status)
  expect(result.data).toEqual(data)
})

it('extractRespFromGraphQL error response', async () => {
  const message = 'First GraphQL error message'
  const resp: any = {
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve({errors: [{message}]})
  }

  const result = await extractRespFromGraphQL(resp)
  // always returns 500
  expect(result.status).toEqual(500)
  // extracts first error message
  expect(result.message).toEqual(message)
})

it('getBaseUrl', () => {
  let baseUrl = getBaseUrl()
  expect(baseUrl).toEqual('/api/v1')

  process.env.POSTGREST_URL = 'http://localhost:3000/api/v1'
  baseUrl = getBaseUrl()
  expect(baseUrl).toEqual('http://localhost:3000/api/v1')
})

it('promiseWithTimeout resolves promise', async () => {
  function mockPromise(timeoutInSec:number){
    return new Promise((res, rej) => {
      setTimeout(() => {
        res({message:'OK'})
      },timeoutInSec*1000)
    })
  }
  // should resolve timeout
  const resp = await promiseWithTimeout(
    mockPromise(1),
    2
  )
  expect(resp).toEqual({message:'OK'})
})

it('promiseWithTimeout resoves request timeout', async() => {
  function mockPromise(timeoutInSec: number) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res({message: 'OK'})
      }, timeoutInSec * 1000)
    })
  }
  // should resolve timeout
  try {
    const resp = await promiseWithTimeout(
      mockPromise(2),
      1
    )
    expect(resp).toBeFalsy()
  } catch (e) {
    expect(e).toEqual({
      status: 408,
      statusText: 'Request timeout'
    })
  }
})
