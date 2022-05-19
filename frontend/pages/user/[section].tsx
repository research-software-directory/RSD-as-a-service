import {useEffect, useState} from 'react'
import Head from 'next/head'
import {GetServerSidePropsContext} from 'next/types'

import {useAuth} from '~/auth'
import ProtectedContent from '~/auth/ProtectedContent'
import DefaultLayout from '~/components/layout/DefaultLayout'
import {userMenu, UserMenuProps} from '~/components/user/UserNavItems'
import {PaginationProvider} from '~/components/pagination/PaginationContext'
import {SearchProvider} from '~/components/search/SearchContext'
import UserTitle from '~/components/user/UserTitle'
import UserNav from '../../components/user/UserNav'

export default function UserPages({section}:{section:string}) {
  const {session} = useAuth()
  const [pageSection, setPageSection] = useState<UserMenuProps>(userMenu[section])

  // console.log('section...', section)

  useEffect(() => {
    let abort:boolean=false
    const newSection = userMenu[section]
    if (newSection && abort===false) {
      setPageSection(userMenu[section])
    }
    ()=>{abort=true}
  },[section])

  function renderStepComponent() {
    if (pageSection.component) {
      return pageSection.component({session})
    }
  }
  return (
    <DefaultLayout>
      <Head>
        <title>{session.user?.name} | RSD</title>
      </Head>
      <ProtectedContent>
      <SearchProvider>
      <PaginationProvider>
        <UserTitle
          title={session.user?.name ?? 'John Doe'}
          showSearch={pageSection?.showSearch ?? false}
        />
        <section className="flex-1 grid md:grid-cols-[1fr,2fr] xl:grid-cols-[1fr,4fr] gap-[3rem]">
          <div>
            <UserNav
              selected={section}
              isMaintainer={true}
            />
          </div>
          {renderStepComponent()}
          </section>
      </PaginationProvider>
      </SearchProvider>
      </ProtectedContent>
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {params} = context
    // console.log('getServerSideProps...params...', params)

    const section = params?.section
    if (typeof section == 'undefined') {
      // 404 if no section parameter
      return {
        notFound: true,
      }
    }
    // try to load menu item
    const sectionItem = userMenu[section.toString()]
    if (typeof sectionItem == 'undefined') {
      // 404 is section key does not exists
      return {
        notFound: true,
      }
    }
    return {
      // passed to the page component as props
      props: {
        section
      },
    }
  }catch(e){
    return {
      notFound: true,
    }
  }
}
