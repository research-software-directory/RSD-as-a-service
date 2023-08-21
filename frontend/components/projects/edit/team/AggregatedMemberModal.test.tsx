// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'

import AggregatedMemberModal, {NewRsdMember} from './AggregatedMemberModal'

// MOCKS
import editProjectState from '~/components/projects/edit/__mocks__/editProjectState'

const mockOnCancel = jest.fn()
const mockOnSubmit = jest.fn()

const mockMember = {
  orcid: 'orcid-id',
  display_name: 'Dusan Mijatovic',
  given_names: 'Dusan',
  family_names: 'Mijatovic',
  email_options: ['dm1@email.com','dm2@email.com','dm3@email.com'],
  role_options: ['role 1','role 2','role 3'],
  affiliation_options: ['affiliation 1','affiliation 2','affiliation 3'],
  avatar_options: ['avatar-id-1','avatar-id-2'],
  sources: ['RSD','ORCID'],
  project: editProjectState.project.id,
  selected_avatar: null,
  avatar_id: null,
  avatar_b64: null,
  avatar_mime_type: null,
  role: null,
  is_contact_person: false,
  position: 1
} as NewRsdMember

const mockProps = {
  open: false,
  onCancel: mockOnCancel,
  onSubmit: mockOnSubmit,
  member: mockMember
}


beforeEach(() => {
  jest.resetAllMocks()
})

it('shows modal with heading', () => {
  mockProps.open = true
  // render component
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithProjectContext state={editProjectState}>
        <AggregatedMemberModal {...mockProps} />
      </WithProjectContext>
    </WithAppContext>
  )

  screen.getByRole('heading',{name: 'Add team member'})
  // screen.debug()
})


it('shows modal with Cancel and Save buttons', () => {
  mockProps.open = true

  // render component
  render(
    <WithAppContext options={{session: mockSession}}>
      <WithProjectContext state={editProjectState}>
        <AggregatedMemberModal {...mockProps} />
      </WithProjectContext>
    </WithAppContext>
  )

  const cancelBtn = screen.getByRole('button', {name: 'Cancel'})
  const saveBtn = screen.getByRole('button', {name: 'Save'})

  expect(cancelBtn).toBeEnabled()
  expect(saveBtn).not.toBeEnabled()

  // add role
  const inputRole = screen.getByRole('combobox',{name:'Role'})
  fireEvent.change(inputRole, {target: {value: 'Testing role'}})

  // select no image button
  const noImg = screen.getByRole('button', {name: 'DM'})
  fireEvent.click(noImg)

  // cancel
  fireEvent.click(cancelBtn)
  // validate onCancel called
  expect(mockProps.onCancel).toBeCalledTimes(1)
})
