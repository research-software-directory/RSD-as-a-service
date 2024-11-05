// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// Mock fetch: default return of values passed
global.fetch = jest.fn((...props: any) => (Promise.resolve({
  status: 200,
  headers: {
    // mock getting Content-Range from the header
    get: () => '0-11/200',
  },
  statusText:'OK',
  json: jest.fn(()=>Promise.resolve(props))
}))) as jest.Mock


export function mockResolvedValue(data:any, options?:any) {
  if (options) {
    if (options?.hasOwnProperty('status') === false) {
      options['status'] = 200
    }
    if (options?.hasOwnProperty('statusText') === false) {
      options['statusText'] = 'OK'
    }
  } else {
    options = {
      status: 200,
      statusText:'OK'
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  global.fetch = jest.fn((...props:any) => {
    return Promise.resolve({
      ...options,
      json:()=>Promise.resolve(data)
    })
  })
}

export function mockResolvedValueOnce(data: any, options?: any) {
  if (options) {
    if (options?.hasOwnProperty('status') === false) {
      options['status'] = 200
    }
    if (options?.hasOwnProperty('statusText') === false) {
      options['statusText'] = 'OK'
    }
  } else {
    options = {
      status: 200,
      statusText: 'OK'
    }
  }

  (global.fetch as any).mockImplementationOnce(() => {
    return Promise.resolve({
      ...options,
      json: () => Promise.resolve(data)
    })
  })
}

export function mockRejectedValueOnce(reason?: any) {
  (global.fetch as any).mockImplementationOnce(() => {
    return Promise.reject(reason)
  })
}


// export function clearMockFetch() {
//   // console.log("clearMockFetch...called")
//   if (global.fetch) delete global.fetch
// }
