// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Head from 'next/head'
import {GetServerSidePropsContext} from 'next/types'

import {app} from '../../config/app'
import {useAuth} from '~/auth'
import ProtectedContent from '~/auth/ProtectedContent'
import DefaultLayout from '~/components/layout/DefaultLayout'
import {userMenu, UserMenuProps} from '~/components/user/UserNavItems'
import {PaginationProvider} from '~/components/pagination/PaginationContext'
import {SearchProvider} from '~/components/search/SearchContext'
import UserTitle from '~/components/user/UserTitle'
import UserNav, {UserCounts} from '../../components/user/UserNav'
import {getUserCounts} from '~/components/user/getUserCounts'

type UserPagesProps = {
  section: string,
  counts: UserCounts
}

export default function UserPages({section,counts}:UserPagesProps) {
  const {session} = useAuth()
  const [pageSection, setPageSection] = useState<UserMenuProps>(userMenu[section])
  const pageTitle = `${session.user?.name} | ${app.title}`

  // console.group("UserPages")
  // console.log('pageSection...', pageSection)
  // console.log('pageTitle...', pageTitle)
  // console.groupEnd()

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
        <title>{pageTitle}</title>
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
                  counts={counts}
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
    const {params, req} = context

    const section = params?.section
    const token = req?.cookies['rsd_token']

    // console.log('getServerSideProps...params...', params)
    // console.log('getServerSideProps...token...', token)
    // console.log('getServerSideProps...user...', user)

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

    // load counts for user
    const counts = await getUserCounts({
      token,
      frontend: false
    })

    return {
      // passed to the page component as props
      props: {
        section,
        counts
      },
    }
  }catch(e){
    return {
      notFound: true,
    }
  }
}
