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

import {claimOrganisationMaintainerInvite} from '~/auth/api/authHelpers'
import {getAccountFromToken} from '~/auth/jwtUtils'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
import DefaultLayout from '~/components/layout/DefaultLayout'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import PageTitle from '~/components/layout/PageTitle'
import {getRsdPathForOrganisation} from '~/utils/editOrganisation'

type InviteOrganisationMaintainerProps = {
  organisationInfo: {
    id: string,
    name: string,
    slug: string
  }|null,
  error: {
    status: number,
    message: string
  }|null
}

export default function InviteOrganisationMaintainer({organisationInfo, error}:
  InviteOrganisationMaintainerProps) {
  // console.group('InviteOrganisationMaintainer')
  // console.log('organisationInfo..', organisationInfo)
  // console.log('error..', error)
  // console.groupEnd()
  function renderContent() {
    if (typeof error == 'undefined' || error === null) {
      return (
        <ContentInTheMiddle>
          <div className="flex flex-col gap-4 items-center">
            <h2>
              {
                organisationInfo?.name ?
                  <span>You are now a maintainer of {organisationInfo?.name}</span>
                  : <span>You are now a maintainer</span>
              }
            </h2>
            <Button
              href={`/organisations/${organisationInfo?.slug ?? 'missing'}`}
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
              Open organisation page
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
        <title>Organisation Maintainer Invite | RSD</title>
      </Head>
      <PageTitle title="Organisation Maintainer Invite" />
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
    const resp:InviteOrganisationMaintainerProps = await claimOrganisationMaintainerInvite({
      id: id.toString(),
      token,
      frontend: false
    })
    // returns id of organisation
    if (resp.organisationInfo?.id) {
      // get organisation path to link to in the message
      const slug = await getRsdPathForOrganisation({
        uuid: resp.organisationInfo.id,
        token
      })

      if (slug.status === 200) {
        // pass software info to page component as props
        return {
          props: {
            organisationInfo: {
              ...resp.organisationInfo,
              slug: slug.message
            }
          }
        }
      }
      // error from second request
      return {
        props: {
          error: slug.message
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
      organisationInfo:null,
      error: {
        status: 404,
        message: 'This invite is invalid. It\'s missing invite id. Please ask the organisation maintainer to provide you a new link.'
      }
    }
  }
}
