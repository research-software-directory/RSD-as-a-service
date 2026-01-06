// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'

import {useSession} from '~/auth/AuthProvider'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import ContentLoader from '~/components/layout/ContentLoader'
import RsdAccountItem from './RsdAccountItem'
import useRsdAccounts, {RsdAccountInfo} from './useRsdAccounts'
import LockUserModal from './LockUserModal'

export type AccountModal = {
  delete:{
    open: boolean,
    account?: RsdAccountInfo
  },
  lock:{
    open: boolean,
    account?: RsdAccountInfo
  }
}

export default function RsdUsersList({
  adminsOnly, lockedOnly, inactiveDays
}: Readonly<{
  adminsOnly: boolean, lockedOnly: boolean, inactiveDays: number
}>) {
  const {token} = useSession()
  const {loading, accounts, lockAccount,deleteAccount} = useRsdAccounts(token, adminsOnly, lockedOnly, inactiveDays)
  const [modal, setModal] = useState<AccountModal>({
    delete:{
      open: false
    },
    lock:{
      open: false
    }
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
        delete:{
          open: true,
          account
        },
        lock:{
          open:false
        }
      })
    }
  }

  function onLockAccount(account:RsdAccountInfo) {
    if (account) {
      setModal({
        delete:{
          open: false,
        },
        lock:{
          open:true,
          account
        }
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
                onLock={onLockAccount}
              />
            )
          })
        }
      </List>
      {modal.delete.open ?
        <ConfirmDeleteModal
          open={modal.delete.open}
          title="Remove account"
          body={
            <>
              <p>
                Are you sure you want to delete the account <strong>{modal.delete?.account?.id}</strong>?
              </p>
              <p className="mt-4">
                The user will lose all maintainer rights and all unused maintainer invites created by this user will be deleted.
              </p>
            </>
          }
          onCancel={() => {
            setModal({
              delete:{open: false},
              lock:{open: false},
            })
          }}
          onDelete={() => {
            deleteAccount(modal?.delete.account?.id ?? '')
            setModal({
              delete:{open: false},
              lock:{open: false},
            })
          }}
        />
        :null
      }
      {modal.lock.open && modal.lock.account ?
        <LockUserModal
          account={{
            id: modal.lock?.account.id,
            lock_account: modal?.lock?.account.locked_account ? true : false,
            admin_facing_reason: modal?.lock?.account.locked_account?.admin_facing_reason ?? null,
            user_facing_reason: modal?.lock?.account.locked_account?.user_facing_reason ?? null,
          }}
          onCancel={()=>
            setModal({
              delete:{open: false},
              lock:{open: false},
            })
          }
          onSubmit={(account)=>{
            lockAccount(account)
            setModal({
              delete:{open: false},
              lock:{open: false},
            })
          }}
        />
        : null
      }
    </>
  )
}
