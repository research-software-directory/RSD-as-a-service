// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {
  getRedirectUrl,
  getAuthorisationEndpoint, RedirectToProps,
  claimProjectMaintainerInvite,
  claimSoftwareMaintainerInvite,
  claimOrganisationMaintainerInvite
} from './authHelpers'

// based on return values from test surfconext endpoint
const mockWellKnowResp = {
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


const mockProps: RedirectToProps = {
  authorization_endpoint: 'https://test-endpoint',
  redirect_uri: 'https://redirect-uri',
  client_id: '1234567',
  scope: 'openid',
  response_mode: 'form',
  prompt: 'login'
}

// mock console log
// global.console = {
//   ...global.console,
//   error: jest.fn(),
//   warn: jest.fn(),
//   log: jest.fn()
// }

// const expectedClaims = encodeURIComponent(JSON.stringify(claims))

beforeEach(() => {
  jest.resetAllMocks()
})


it('crates RedirectUrl', () => {
  const {authorization_endpoint, redirect_uri, client_id, scope, response_mode, prompt} = mockProps
  const expectedRedirect = `${authorization_endpoint}?redirect_uri=${redirect_uri}&client_id=${client_id}&scope=${scope}&response_type=code&response_mode=${response_mode}&prompt=${prompt}`
  const redirectUrl = getRedirectUrl(mockProps)
  expect(redirectUrl).toEqual(expectedRedirect)
})

it('does not enforce prompt parameter', () => {
  const {authorization_endpoint, redirect_uri, client_id, scope, response_mode} = mockProps
  const expectedRedirect = `${authorization_endpoint}?redirect_uri=${redirect_uri}&client_id=${client_id}&scope=${scope}&response_type=code&response_mode=${response_mode}`
  const redirectUrl = getRedirectUrl({...mockProps, prompt: undefined})
  expect(redirectUrl).toEqual(expectedRedirect)
})

it('returns authorization_endpoint', async() => {
  mockResolvedValueOnce(mockWellKnowResp)
  const authorization_endpoint = await getAuthorisationEndpoint('mockedWellKnowEndpoint')
  expect(authorization_endpoint).toEqual(mockWellKnowResp.authorization_endpoint)
})

// ------------------------------------
// claimProjectMaintainerInvite
// ------------------------------------

it('claimProjectMaintainerInvite returns success', async() => {
  const expectedInfo = {
    slug: 'test-slug',
    title:'Test project title'
  }
  // mock response
  mockResolvedValueOnce(expectedInfo)
  // claim maintainer invite
  const response = await claimProjectMaintainerInvite({
    id: 'project-test-id',
    token: 'TEST_TOKEN'
  })

  expect(response).toEqual({
    error: null,
    projectInfo: expectedInfo
  })

})

it('claimProjectMaintainerInvite returns error', async () => {
  const expectedError = {
    status: 500,
    message: 'This is custom error message'
  }
  // mock response
  mockResolvedValueOnce({message:expectedError.message}, {
    status: expectedError.status
  })
  // claim maintainer invite
  const response = await claimProjectMaintainerInvite({
    id: 'project-test-id',
    token: 'TEST_TOKEN'
  })
  // validate expected error returned
  expect(response).toEqual({
    error: expectedError,
    projectInfo: null
  })
})

it('claimProjectMaintainerInvite calls expected endpoint', async () => {
  const expectedError = {
    status: 500,
    message: 'This is custom error message'
  }
  const expectedUrl = '/api/v1/rpc/accept_invitation_project'
  const expectedId = 'project-invite-test-id'
  // mock response
  mockResolvedValueOnce({message: expectedError.message}, {
    status: expectedError.status
  })

  // claim maintainer invite
  await claimProjectMaintainerInvite({
    id: expectedId,
    token: 'TEST_TOKEN',
    frontend: true
  })

  // validate api call
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectedUrl,{
    body: `{"invitation":"${expectedId}"}`,
    headers: {
      'Accept': 'application/vnd.pgrst.object + json',
      'Authorization': 'Bearer TEST_TOKEN',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
})


// ------------------------------------
// claimSoftwareMaintainerInvite
// ------------------------------------

it('claimSoftwareMaintainerInvite returns success', async () => {
  const expectedInfo = {
    slug: 'test-slug',
    title: 'Test software title'
  }
  // mock response
  mockResolvedValueOnce(expectedInfo)
  // claim maintainer invite
  const response = await claimSoftwareMaintainerInvite({
    id: 'software-invite-test-id',
    token: 'TEST_TOKEN'
  })

  expect(response).toEqual({
    error: null,
    softwareInfo: expectedInfo
  })

})

it('claimSoftwareMaintainerInvite returns error', async () => {
  const expectedError = {
    status: 500,
    message: 'This is custom error message'
  }
  // mock response
  mockResolvedValueOnce({message: expectedError.message}, {
    status: expectedError.status
  })
  // claim maintainer invite
  const response = await claimSoftwareMaintainerInvite({
    id: 'software-invite-test-id',
    token: 'TEST_TOKEN'
  })
  // validate expected error returned
  expect(response).toEqual({
    error: expectedError,
    softwareInfo: null
  })
})

it('claimSoftwareMaintainerInvite calls expected endpoint', async () => {
  const expectedError = {
    status: 500,
    message: 'This is custom error message'
  }
  const expectedUrl = '/api/v1/rpc/accept_invitation_software'
  const expectedId = 'project-invite-test-id'
  // mock response
  mockResolvedValueOnce({message: expectedError.message}, {
    status: expectedError.status
  })

  // claim maintainer invite
  await claimSoftwareMaintainerInvite({
    id: expectedId,
    token: 'TEST_TOKEN',
    frontend: true
  })

  // validate api call
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectedUrl, {
    body: `{"invitation":"${expectedId}"}`,
    headers: {
      'Accept': 'application/vnd.pgrst.object + json',
      'Authorization': 'Bearer TEST_TOKEN',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
})


// ------------------------------------
// claimOrganisationMaintainerInvite
// ------------------------------------

it('claimOrganisationMaintainerInvite returns success', async () => {
  const expectedInfo = {
    slug: 'test-slug',
    title: 'Test organisation title'
  }
  // mock response
  mockResolvedValueOnce(expectedInfo)
  // claim maintainer invite
  const response = await claimOrganisationMaintainerInvite({
    id: 'organisation-invite-test-id',
    token: 'TEST_TOKEN'
  })

  expect(response).toEqual({
    error: null,
    organisationInfo: expectedInfo
  })

})

it('claimOrganisationMaintainerInvite returns error', async () => {
  const expectedError = {
    status: 500,
    message: 'This is custom error message'
  }
  // mock response
  mockResolvedValueOnce({message: expectedError.message}, {
    status: expectedError.status
  })
  // claim maintainer invite
  const response = await claimOrganisationMaintainerInvite({
    id: 'organisation-invite-test-id',
    token: 'TEST_TOKEN'
  })
  // validate expected error returned
  expect(response).toEqual({
    error: expectedError,
    organisationInfo: null
  })
})

it('claimOrganisationMaintainerInvite calls expected endpoint', async () => {
  const expectedError = {
    status: 500,
    message: 'This is custom error message'
  }
  const expectedUrl = '/api/v1/rpc/accept_invitation_organisation'
  const expectedId = 'project-invite-test-id'
  // mock response
  mockResolvedValueOnce({message: expectedError.message}, {
    status: expectedError.status
  })

  // claim maintainer invite
  await claimOrganisationMaintainerInvite({
    id: expectedId,
    token: 'TEST_TOKEN',
    frontend: true
  })

  // validate api call
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectedUrl, {
    body: `{"invitation":"${expectedId}"}`,
    headers: {
      'Accept': 'application/vnd.pgrst.object + json',
      'Authorization': 'Bearer TEST_TOKEN',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
})
