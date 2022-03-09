
import {mockResolvedValueOnce} from './jest/mockFetch'
import {getRedirectUrl} from './surfConext'

// based on return values from test surfconext endpoint
const mockResp = {
	'issuer': 'https://connect.test.surfconext.nl',
	'authorization_endpoint': 'https://connect.test.surfconext.nl/oidc/authorize',
	'token_endpoint': 'https://connect.test.surfconext.nl/oidc/token',
	'userinfo_endpoint': 'https://connect.test.surfconext.nl/oidc/userinfo',
	'introspect_endpoint': 'https://connect.test.surfconext.nl/oidc/introspect',
	'jwks_uri': 'https://connect.test.surfconext.nl/oidc/certs',
	'response_types_supported': ['code', 'token', 'id_token', 'code token', 'code id_token', 'token id_token', 'code token id_token'],
	'response_modes_supported': ['fragment', 'query', 'form_post'],
	'grant_types_supported': ['authorization_code', 'implicit', 'refresh_token', 'client_credentials'],
	'subject_types_supported': ['public', 'pairwise'],
	'id_token_signing_alg_values_supported': ['RS256'],
	'scopes_supported': ['openid', 'groups', 'profile', 'email', 'address', 'phone'],
	'token_endpoint_auth_methods_supported': ['client_secret_basic', 'client_secret_post', 'client_secret_jwt', 'private_key_jwt'],
	'claims_supported': ['aud', 'nbf', 'iss', 'exp', 'iat', 'jti', 'nonce', 'at_hash', 'c_hash', 's_hash', 'at_hash', 'auth_time', 'sub', 'eduid', 'edumember_is_member_of', 'eduperson_affiliation', 'eduperson_entitlement', 'eduperson_principal_name', 'eduperson_scoped_affiliation', 'email', 'email_verified', 'family_name', 'given_name', 'name', 'nickname', 'preferred_username', 'schac_home_organization', 'schac_home_organization_type', 'schac_personal_unique_code', 'eduperson_orcid', 'eckid', 'surf-crm-id', 'uids'],
	'claims_parameter_supported': true,
	'request_parameter_supported': true,
	'request_uri_parameter_supported': true,
	'acr_values_supported': ['http://test.surfconext.nl/assurance/loa1', 'http://test.surfconext.nl/assurance/loa2', 'http://test.surfconext.nl/assurance/loa3', 'https://eduid.nl/trust/linked-institution', 'https://eduid.nl/trust/validate-names', 'https://eduid.nl/trust/affiliation-student'],
	'code_challenge_methods_supported': ['plain', 'S256'],
	'request_object_signing_alg_values_supported': ['RS256']
}

process.env.NEXT_PUBLIC_SURFCONEXT_REDIRECT = 'https://dummy.redirect.com'

it('returns authorization_endpoint from wellknown', async () => {
	// mock provider api call
	mockResolvedValueOnce({
		provider: 'surfconext',
    env: {
      NEXT_PUBLIC_SURFCONEXT_CLIENT_ID: process.env.NEXT_PUBLIC_SURFCONEXT_CLIENT_ID,
      NEXT_PUBLIC_SURFCONEXT_REDIRECT: process.env.NEXT_PUBLIC_SURFCONEXT_REDIRECT,
      NEXT_PUBLIC_SURFCONEXT_WELL_KNOWN_URL: process.env.NEXT_PUBLIC_SURFCONEXT_WELL_KNOWN_URL
    }
	})
  // then mock return value from fetch
  mockResolvedValueOnce(mockResp)
	const redirectUrl = await getRedirectUrl('surfconext')
  const expected = `${mockResp['authorization_endpoint']}?redirect_uri=${process.env.NEXT_PUBLIC_SURFCONEXT_REDIRECT}&client_id=${process.env.NEXT_PUBLIC_SURFCONEXT_CLIENT_ID}&scope=openid&response_type=code&response_mode=form_post&prompt=login+consent`
  expect(redirectUrl).toEqual(expected)
})
