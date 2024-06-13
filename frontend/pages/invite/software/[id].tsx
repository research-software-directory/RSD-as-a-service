// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'
import Head from 'next/head'
import LinkIcon from '@mui/icons-material/Link'
import Button from '@mui/material/Button'

import {claimSoftwareMaintainerInvite} from '~/auth/api/authHelpers'
import {getAccountFromToken} from '~/auth/jwtUtils'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
import DefaultLayout from '~/components/layout/DefaultLayout'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import PageTitle from '~/components/layout/PageTitle'

type InviteSoftwareMaintainerProps = {
  softwareInfo: {
    slug: string,
    brand_name: string,
  }|null,
  error: {
    status: number,
    message: string
  }|null
}

export default function InviteSoftwareMaintainer({softwareInfo, error}: InviteSoftwareMaintainerProps) {
  // console.group('InviteSoftwareMaintainer')
  // console.log('softwareInfo..', softwareInfo)
  // console.log('error..', error)
  // console.groupEnd()
  function renderContent() {
    if (error!==null) {
      return (
        <PageErrorMessage {...error}/>
      )
    }
    return (
      <ContentInTheMiddle>
        <div className="flex flex-col gap-4 items-center">
          <h2>
            {
              softwareInfo?.brand_name ?
                <span>You are now a maintainer of {softwareInfo?.brand_name}</span>
                : <span>You are now a maintainer</span>
            }
          </h2>
          <Button
            href={`/software/${softwareInfo?.slug ?? 'missing'}`}
            variant="contained"
            sx={{
              // we need to overwrite global link styling from tailwind
              // because the type of button is a link (we use href param)
              ':hover':{
                color:'primary.contrastText'
              }
            }}
            startIcon={<LinkIcon />}
          >
            Open software page
          </Button>
        </div>
      </ContentInTheMiddle>
    )
  }

  return (
    <DefaultLayout>
      <Head>
        <title>Software Maintainer Invite | RSD</title>
      </Head>
      <PageTitle title="Software Maintainer Invite" />
      {renderContent()}
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // extract from page-query
  const {params,req} = context
  // extract rsd_token
  const token = req?.cookies['rsd_token']
  // extract id
  const id = params?.id

  // extract account id from token
  const account = getAccountFromToken(token)
  // console.log('account...', account)
  if (typeof account == 'undefined') {
    return {
      props: {
        projectInfo: null,
        error: {
          status: 401,
          message: 'You need to sign in to RSD first!'
        }
      }
    }
  }

  if (id) {
    // claim the software maintainer invite
    const resp:InviteSoftwareMaintainerProps = await claimSoftwareMaintainerInvite({
      id: id.toString(),
      token,
      frontend: false
    })
    // pass software info to page component as props
    return {
      props: resp
    }
  } else {
    return {
      props: {
        softwareInfo:null,
        error: {
          status: 404,
          message: 'This invite is invalid. It\'s missing invite id. Please ask the software maintainer to provide you a new link.'
        }
      }
    }
  }
}
