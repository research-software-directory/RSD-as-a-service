
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


// export function clearMockFetch() {
//   // console.log("clearMockFetch...called")
//   if (global.fetch) delete global.fetch
// }
