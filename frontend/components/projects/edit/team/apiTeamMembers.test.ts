// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {
  postTeamMember,
  patchTeamMember,
  deleteTeamMemberById,
  patchTeamMemberPositions
} from './apiTeamMembers'

import teamMembers from './__mocks__/teamMembers.json'

const expectedId = 'new-team-member-id'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockHeaderGet = jest.fn(props => `prefix.${expectedId}`)

beforeEach(() => {
  jest.clearAllMocks()
})

it('postTeamMember calls api and returns id', async () => {
  const token = 'TEST-TOKEN'
  const expectUrl = '/api/v1/team_member'
  const expectPayload = {
    'body': JSON.stringify(teamMembers[0]),
    'headers': {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=headers-only'
    },
    'method': 'POST'
  }

  mockResolvedValueOnce('OK', {
    status: 201,
    headers: {
      get: mockHeaderGet
    }
  })

  const resp = await postTeamMember({
    member: teamMembers[0],
    token
  })

  expect(resp).toEqual({
    status: 201,
    message: expectedId
  })

  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectUrl,expectPayload)
})

it('patchTeamMember calls api', async () => {
  const token = 'TEST-TOKEN'
  const expectUrl = `/api/v1/team_member?id=eq.${teamMembers[0].id}`
  const expectPayload = {
    'body': JSON.stringify(teamMembers[0]),
    'headers': {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    'method': 'PATCH'
  }

  mockResolvedValueOnce('OK')

  const resp = await patchTeamMember({
    member: teamMembers[0],
    token
  })

  expect(resp).toEqual({
    status: 200,
    message: 'OK'
  })

  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectUrl, expectPayload)
})

it('deleteTeamMemberById calls api', async () => {
  const token = 'TEST-TOKEN'
  const expectUrl = `/api/v1/team_member?id=in.("${[teamMembers[0].id].join('","')}")`
  const expectPayload = {
    'headers': {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    'method': 'DELETE'
  }

  mockResolvedValueOnce('OK')

  const resp = await deleteTeamMemberById({
    ids: [teamMembers[0].id],
    token
  })

  expect(resp).toEqual({
    status: 200,
    message: teamMembers[0].id
  })

  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(global.fetch).toHaveBeenCalledWith(expectUrl, expectPayload)
})

it('patchTeamMemberPositions calls api', async () => {
  const token = 'TEST-TOKEN'

  // two team members pached
  mockResolvedValueOnce('OK')
  mockResolvedValueOnce('OK')

  const resp = await patchTeamMemberPositions({
    members: teamMembers,
    token
  })

  expect(resp).toEqual({
    status: 200,
    message: 'OK'
  })

  // cals patch for each member in the array
  expect(global.fetch).toHaveBeenCalledTimes(teamMembers.length)
})
