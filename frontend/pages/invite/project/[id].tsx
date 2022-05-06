import {GetServerSidePropsContext} from 'next'
import Head from 'next/head'
import Link from 'next/link'

import {claimProjectMaintainerInvite} from '~/auth/api/authHelpers'
import {getAccountFromToken} from '~/auth/jwtUtils'
import DefaultLayout from '~/components/layout/DefaultLayout'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import PageTitle from '~/components/layout/PageTitle'

type InviteProjectMaintainerProps = {
  projectInfo: {
    slug: string,
    title: string,
  },
  error: {
    status: number,
    message: string
  }|null
}

export default function InviteProjectMaintainer({projectInfo, error}:InviteProjectMaintainerProps) {
  function renderContent() {
    if (error!==null) {
      return (
        <PageErrorMessage {...error}/>
      )
    }
    return (
      <section>
        <h2>You are now maintainer of {projectInfo.title}</h2>
        <pre>
          {JSON.stringify(projectInfo)}
        </pre>
        <Link href={`/project/${projectInfo.slug}`}>
          <a>
            Open project
          </a>
        </Link>
      </section>
    )

  }

  return (
     <DefaultLayout>
      <Head>
        <title>Project Maintainer Invite | RSD</title>
      </Head>
      <PageTitle title="Maintainer invite">
      </PageTitle>
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
        id,
        project: null,
        error: {
          status: 401,
          message: 'You need to sign in to RSD first!'
        }
      }
    }
  }

  if (id) {
    // claim the project maintainer invite
    const projectInfo = await claimProjectMaintainerInvite({id: id.toString(), token, frontend: false})
    if (typeof projectInfo == 'undefined') {
      // request failed
      // multiple reasons possible: id is mailformed, invite already claimed etc
      return {
        props: {
          id,
          account: null,
          error: {
            status: 400,
            message: 'This invite is invalid, expired or already claimed. Please ask the project mantainer to provide you a new link.'
          }
        }
      }
    }
    // pass project info to page component as props
    return {
      props: {
        id,
        projectInfo
      }
    }
  } else {
    return {
      props: {
        id,
        account: null,
        error: {
          status: 404,
          message: 'This invite is invalid. It is missing invite id. Please ask the project mantainer to provide you a new link.'
        }
      }
    }
  }
}
