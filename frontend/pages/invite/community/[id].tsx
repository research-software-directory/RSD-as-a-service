// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'
import Head from 'next/head'
import LinkIcon from '@mui/icons-material/Link'
import Button from '@mui/material/Button'

import {claimCommunityMaintainerInvite} from '~/auth/api/authHelpers'
import {getAccountFromToken} from '~/auth/jwtUtils'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
import DefaultLayout from '~/components/layout/DefaultLayout'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import PageTitle from '~/components/layout/PageTitle'

type InviteCommunityMaintainerProps = {
  communityInfo: {
    id: string,
    name: string,
    slug: string
  }|null,
  error: {
    status: number,
    message: string
  }|null
}

export default function InviteCommunityMaintainer({communityInfo, error}: InviteCommunityMaintainerProps) {

  // console.group('InviteCommunityMaintainer')
  // console.log('communityInfo..', communityInfo)
  // console.log('error..', error)
  // console.groupEnd()

  function renderContent() {
    if (typeof error == 'undefined' || error === null) {
      return (
        <ContentInTheMiddle>
          <div className="flex flex-col gap-4 items-center">
            <h2>
              {
                communityInfo?.name ?
                  <span>You are now a maintainer of {communityInfo?.name}</span>
                  : <span>You are now a maintainer</span>
              }

            </h2>
            <Button
              href={`/communities/${communityInfo?.slug ?? 'missing'}`}
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
              Open community page
            </Button>
          </div>
        </ContentInTheMiddle>
      )
    }
    return (
      <PageErrorMessage {...error}/>
    )
  }

  return (
    <DefaultLayout>
      <Head>
        <title>Community Maintainer Invite | RSD</title>
      </Head>
      <PageTitle title="Community Maintainer Invite" />
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
    const resp:InviteCommunityMaintainerProps = await claimCommunityMaintainerInvite({
      id: id.toString(),
      token
    })
    // returns id of community
    if (resp?.communityInfo?.id) {
      // pass software info to page component as props
      return {
        props: {
          communityInfo: resp.communityInfo
        }
      }
    }
    // error from first request
    return {
      props: resp
    }
  }

  return {
    props: {
      communityInfo:null,
      error: {
        status: 404,
        message: 'This invite is invalid. It\'s missing invite id. Please ask the community maintainer to provide you a new link.'
      }
    }
  }
}
