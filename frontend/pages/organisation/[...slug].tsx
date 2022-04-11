import {useState} from 'react'
import Head from 'next/head'
import {GetServerSidePropsContext} from 'next/types'

import {Session, useAuth} from '../../auth'
import useOrganisationMaintainer from '../../auth/permissions/useOrganisationMaintainer'
import DefaultLayout from '../../components/layout/DefaultLayout'
import {getOrganisationBySlug} from '../../utils/getOrganisations'
import OrganisationLogo from '../../components/organisation/settings/OrganisationLogo'
import ContentLoader from '../../components/layout/ContentLoader'
import OrganisationNav from '../../components/organisation/OrganisationNav'
import {organisationMenu, OrganisationMenuProps} from '../../components/organisation/OrganisationNavItems'
import OrganisationTitle from '../../components/organisation/OrganisationTitle'
import {OrganisationForOverview} from '../../types/Organisation'

import {SearchProvider} from '../../components/search/SearchContext'


type OrganisationPageProps = {
  organisation: OrganisationForOverview,
  slug: string[],
  session: Session,
  isMaintainer: boolean
}

export default function OrganisationPage({organisation,slug}:OrganisationPageProps) {
  const {session} = useAuth()
  const [pageState, setPageState] = useState<OrganisationMenuProps>(organisationMenu[0])
  const {loading, isMaintainer} = useOrganisationMaintainer({
    organisation: organisation.id,
    session
  })


  function onChangeStep({nextStep}: { nextStep: OrganisationMenuProps }) {
    setPageState(nextStep)
  }

  function renderStepComponent() {
    if (loading) return <ContentLoader />
    if (pageState.component) {
      return pageState.component({organisation,slug,session,isMaintainer})
    }
  }

  return (
    <DefaultLayout>
      <Head>
        <title>{organisation.name} | RSD</title>
      </Head>
      <SearchProvider>
        <OrganisationTitle
          title={organisation.name}
          slug={slug}
        />
        <section className="flex-1 grid md:grid-cols-[1fr,2fr] xl:grid-cols-[1fr,4fr] gap-[3rem]">
          <div>
            <OrganisationNav
              onChangeStep={onChangeStep}
              selected={pageState.id}
              organisation={organisation}
              isMaintainer={isMaintainer}
            />
            <OrganisationLogo
              isMaintainer={isMaintainer}
              token={session.token}
              {...organisation}
            />
          </div>
          {renderStepComponent()}
        </section>
      </SearchProvider>
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {params,req,res} = context
    // console.log('getServerSideProps...params...', params)
    const organisation = await getOrganisationBySlug({
      slug: params?.slug as string[],
      token: req?.cookies['rsd_token']
    })
    if (typeof organisation == 'undefined'){
      // returning notFound triggers 404 page
      return {
        notFound: true,
      }
    }

    return {
      // passed to the page component as props
      props: {
        organisation,
        slug: params?.slug,
        // session,
        // isMaintainer
      },
    }
  }catch(e){
    return {
      notFound: true,
    }
  }
}
