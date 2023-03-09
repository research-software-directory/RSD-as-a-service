// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {GetServerSidePropsContext} from 'next'
import {useRouter} from 'next/router'
import ContentInTheMiddle from '../components/layout/ContentInTheMiddle'
import {getRsdTokenNode, removeRsdTokenNode} from '../auth'
import Button from '@mui/material/Button'

type RedirectProps = {
  destination: string,
  statusCode?: number,
  permanent: boolean
}

export default function Logout({redirect}: { redirect: RedirectProps }) {
  const router = useRouter()
  // in case we did reach frontend page somehow?!?
  // we will redirect you (again)
  useEffect(() => {
    router.replace(redirect.destination)
  },[redirect.destination,router])

  // this content should not be visible
  return (
    <ContentInTheMiddle>
      <div className="border p-12">
        <h1>You are logged out!</h1>
        <p className="py-8">
          You can now do something else :-)
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Home
        </Button>
      </div>
    </ContentInTheMiddle>
  )
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const {req,res} = context
  // get token
  const token = getRsdTokenNode(req)
  // get last visited path
  // const redirect = req.cookies['rsd_pathname']
  // console.log('redirect to...', redirect)
  // remove old cookie
  if (token) {
    // console.log('removeRsdTokenNode...')
    removeRsdTokenNode(res)
  }
  // redirect to home
  return {
    redirect: {
      destination: '/',
      permanent: false
    },
  }
}
