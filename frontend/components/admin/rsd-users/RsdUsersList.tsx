// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'

import {useSession} from '~/auth'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import ContentLoader from '~/components/layout/ContentLoader'
import RsdAccountItem from './RsdAccountItem'
import useRsdAccounts, {RsdAccountInfo} from './useRsdAccounts'

export type DeleteAccountModal = {
  open: boolean,
  account?: RsdAccountInfo
}

export default function RsdUsersList({adminsOnly, inactiveDays}: {adminsOnly: boolean, inactiveDays: number}) {
  const {token} = useSession()
  const {loading, accounts, deleteAccount} = useRsdAccounts(token, adminsOnly, inactiveDays)
  const [modal, setModal] = useState<DeleteAccountModal>({
    open: false
  })

  // console.group('RsdUsersList')
  // console.log('loading...', loading)
  // console.log('accounts...', accounts)
  // console.groupEnd()

  if(loading) return <ContentLoader/>

  if (accounts.length === 0) {
    return (
      <section className="flex-1">
        <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
          <AlertTitle sx={{fontWeight:500}}>No users</AlertTitle>
          A user is <strong>automatically added after first login</strong>.
        </Alert>
      </section>
    )
  }

  function onDeleteAccount(account:RsdAccountInfo) {
    if (account) {
      setModal({
        open: true,
        account
      })
    }
  }

  return (
    <>
      <List sx={{
        width: '100%',
      }}>
        {
          accounts.map(item => {
            return (
              <RsdAccountItem
                key={item.id}
                account={item}
                onDelete={()=>onDeleteAccount(item)}
              />
            )
          })
        }
      </List>
      <ConfirmDeleteModal
        open={modal.open}
        title="Remove account"
        body={
          <>
            <p>
              Are you sure you want to delete the account <strong>{modal?.account?.id}</strong>?
            </p>
            <p className="mt-4">
              The user will lose all maintainer rights and all unused maintainer invites created by this user will be deleted.
            </p>
          </>
        }
        onCancel={() => {
          setModal({
            open: false
          })
        }}
        onDelete={() => {
          deleteAccount(modal?.account?.id ?? '')
          setModal({
            open: false
          })
        }}
      />
    </>
  )
}
