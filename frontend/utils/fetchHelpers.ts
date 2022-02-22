
export type AuthHeader = {
  'Content-Type': string;
  Authorization?: string;
}

export function createJsonHeaders(token?: string): AuthHeader {
  if (token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
  return {
    'Content-Type': 'application/json'
  }
}

export function extractReturnMessage(resp: Response, dataId?: string) {
  // OK
  if ([200, 201, 204].includes(resp.status)) {
    // just return id
    return {
      status: 200,
      message: dataId ?? 'OK'
    }
  }
  // not authorized, 404 seem to be returned in some cases
  if ([401, 403, 404].includes(resp.status)) {
    return {
      status: resp.status,
      message: `
          ${resp.statusText}.
          You might not have sufficient priveleges to edit this software.
          Please contact site administrators.
        `
    }
  } else {
    return {
      status: resp.status,
      message: `
          Failed to save changes.
          ${resp.statusText}.
          Please contact site administrators.
        `
    }
  }
}

export function extractErrorMessages(responses: { status: number, message: string }[]) {
  let errors: { status: number, message: string }[] = []
  responses.forEach(resp => {
    if (resp.status !== 200) {
      errors.push(resp)
    }
  })
  return errors
}
