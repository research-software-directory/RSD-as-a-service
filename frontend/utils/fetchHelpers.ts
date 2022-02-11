
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
