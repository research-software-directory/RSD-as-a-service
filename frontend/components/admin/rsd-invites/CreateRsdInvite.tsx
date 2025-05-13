// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import TextField from '@mui/material/TextField'

import {getDateFromNow, getYearMonthDay} from '~/utils/dateFn'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {NewAccountInvite} from './apiRsdInvite'

type CreateRsdInviteProps=Readonly<{
  createInvite:(invite:NewAccountInvite)=>void
}>

const usersHelperText = 'Leave empty for unlimited number of users'
const usersShortText = 'Empty = unlimited'

export default function CreateRsdInvite({createInvite}:CreateRsdInviteProps) {
  // default is single user invite
  const [users,setUsers] = useState<number|null>(1)
  const [expires,setExpires] = useState<string>(
    // default is 7 days
    getYearMonthDay(getDateFromNow(7)) ?? ''
  )

  // console.group('CreateRsdInvite')
  // console.log('users...',users)
  // console.log('expires...',expires)
  // console.groupEnd()

  function onCreateInvite(){
    const invite:NewAccountInvite={
      uses_left: users,
      expires_at: expires
    }
    createInvite(invite)
  }

  return (
    <>
      <EditSectionTitle
        title={'Create new invitation'}
        subtitle={'Please use active invites first, if available'}
      />
      <div className="flex gap-4 py-4">
        <TextField
          type="number"
          label="How many users?"
          value={users ?? ''}
          helperText={
            <span className="line-clamp-1" title={usersHelperText}>{usersShortText}</span>
          }
          onChange={({target})=>{
            if (target.value===''){
              setUsers(null)
            }else if (parseInt(target.value)>0) {
              setUsers(parseInt(target.value))
            }
          }}
        />
        <TextField
          type="date"
          label="Expiration date"
          value={expires}
          helperText="Month / Day / Year"
          onChange={({target})=>{
            setExpires(target.value)
          }}
        />
      </div>
      <Button
        disabled={expires===''}
        variant='contained'
        sx={{
          margin: '1rem 0rem',
          display: 'flex',
          alignItems: 'center'
        }}
        startIcon={<AutoFixHighIcon />}
        onClick={onCreateInvite}
      >
        Generate invite link
      </Button>
    </>
  )
}
