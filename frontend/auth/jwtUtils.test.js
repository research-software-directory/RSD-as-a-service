import verifyJwt, {getAccountFromToken, decodeJwt} from './jwtUtils'
const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoicnNkX3VzZXIiLCJpc3MiOiJyc2RfYXV0aCIsImV4cCI6MTY0NDM0MDY3OSwiYWNjb3VudCI6ImY0ZjMwNWE0LWIxZDUtNGE2MC1hYTI4LWIzMDgwNTQxOWYyYSJ9.zurie5a18eXgjY41oKbizj_e8XQWWMIrIAd3Y---SS0'

it('returns account from token', () => {
  const account = getAccountFromToken(testToken)
  expect(account).toEqual('f4f305a4-b1d5-4a60-aa28-b30805419f2a')
})

it('decodes token', () => {
  const user = decodeJwt(testToken)
  expect(user).toEqual({
    'account': 'f4f305a4-b1d5-4a60-aa28-b30805419f2a',
    'exp': 1644340679,
    'iss': 'rsd_auth',
    'role': 'rsd_user',
  })
})

it('return jwtkey on verifyJwt when PGRST_JWT_SECRET not loaded', () => {
  const resp = verifyJwt(testToken)
  expect(resp).toEqual('jwtkey')
})
