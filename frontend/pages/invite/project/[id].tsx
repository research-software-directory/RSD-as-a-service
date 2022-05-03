import {GetServerSidePropsContext} from 'next'
import Head from 'next/head'
import {getProjectInvite} from '~/auth/api/authHelpers'
import {getAccountFromToken} from '~/auth/jwtUtils'
import {addMaintainerToProject} from '~/auth/permissions/addMaintainerToProject'
import DefaultLayout from '~/components/layout/DefaultLayout'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import PageTitle from '~/components/layout/PageTitle'

type InviteProjectMaintainerProps = {
  isMaintainer: boolean,
  projectInfo: {
    slug: string,
    title: string,
  },
  error: {
    status: number,
    message: string
  }|null
}

export default function InviteProjectMaintainer({isMaintainer, projectInfo, error}:InviteProjectMaintainerProps) {
  function renderContent() {
    if (error!==null) {
      return (
        <PageErrorMessage {...error}/>
      )
    }
    return (
        <section>
          <h2>isMaintainer: {isMaintainer}</h2>
          <pre>
            {JSON.stringify(projectInfo)}
          </pre>
        </section>
      )

  }

  return (
     <DefaultLayout>
      <Head>
        <title>Maintainer invite | RSD</title>
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
  // request project uuid for maintainer
  let project
  if (id) {
    project = await getProjectInvite({id: id.toString(),token,frontend: false})
  }
  // console.log('project...', project)
  if (typeof project == 'undefined') {
    return {
      props: {
        id,
        account: null,
        error: {
          status: 400,
          message: 'Bad request. This invite is invalid. Please validate the link used.'
        }
      }
    }
  }
  const data = await addMaintainerToProject({
    project,
    account,
    token,
    frontend:false
  })
  // console.log('data...', data)
  return {
    // pass this to page component as props
    props: {
      ...data
    },
  }
}
