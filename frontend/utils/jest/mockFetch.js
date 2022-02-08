
// Mock fetch
global.fetch=jest.fn(()=>({
  status:200,
  headers:{
    // mock getting Content-Range from the header
    get:()=>'0-11/200'
  },
  statusText:'OK',
  json: jest.fn(()=>Promise.resolve(mockedResponse))
}))


export function mockResolvedValueOnce(data, options) {
  if (options) {
    if (options?.hasOwnProperty(status) === false) {
      options['status'] = 200
    }
    if (options?.hasOwnProperty(statusText) === false) {
      options['statusText'] = 'OK'
    }
  } else {
    options = {
      status: 200,
      statusText:'OK'
    }
  }

  global.fetch.mockImplementationOnce(() => {
    return Promise.resolve({
      ...options,
      json:()=>Promise.resolve(data)
    })
  })
}


export function clearMockFetch() {
  // console.log("clearMockFetch...called")
  delete global.fetch
}
