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

  const [comment, setComment] = useState<string>('')
  const trimmedComment: string = comment.trim().replaceAll(/\s+/g, ' ')
  const trimmedCommentLength: number = trimmedComment.length
  const maxCommentLength = 50
  const isCommentValid: boolean = trimmedCommentLength <= maxCommentLength

  // console.group('CreateRsdInvite')
  // console.log('users...',users)
  // console.log('expires...',expires)
  // console.groupEnd()

  function onCreateInvite(){
    const invite:NewAccountInvite={
      uses_left: users,
      expires_at: expires,
      comment: trimmedComment.length ? trimmedComment : null
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
            }else if (Number.parseInt(target.value)>0) {
              setUsers(Number.parseInt(target.value))
            }
          }}
          sx={{
            flex: 1
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
          sx={{
            flex: 1
          }}
        />
      </div>
      <TextField
        type="text"
        label="Comment"
        value={comment}
        error={!isCommentValid}
        helperText={
          <span className="line-clamp-1" title={`Max comment length is ${maxCommentLength}`}>{`${trimmedCommentLength} / ${maxCommentLength}`}</span>
        }
        onChange={({target})=>{
          setComment(target.value)
        }}
        sx={{
          width: '100%'
        }}
      />
      <Button
        disabled={expires==='' || !isCommentValid}
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
