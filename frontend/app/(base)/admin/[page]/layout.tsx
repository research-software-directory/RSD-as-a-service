
import {getUserFromToken} from '~/auth/getSessionServerSide'
import AdminNav from '~/components/admin/AdminNav'
import {adminPages, AdminPageTypes} from '~/components/admin/AdminNavItems'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import {PageTitleSticky} from '~/components/layout/PageTitle'
import {getUserSettings} from '~/components/user/ssrUserSettings'

export default async function AdminLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  // extract page from params
  params: Promise<{page: string}>
}>){

  const [{page},{token}] = await Promise.all([
    params,
    getUserSettings()
  ])

  // 401 if no token
  if (token === undefined){
    return (
      <PageErrorMessage
        status={401}
        message='UNAUTHORIZED'
      />
    )
  }

  // Note! The token is verified
  const user = await getUserFromToken(token)

  // console.group('AdminLayout')
  // console.log('page...',page)
  // console.log('token...',token)
  // console.log('user...',user)
  // console.groupEnd()

  // ADMIN role ONLY
  if (user?.role ==='rsd_admin'){
    const pageTitle = adminPages?.[page as AdminPageTypes].title ?? 'Admin page'
    return (
      <article className="flex-1 flex flex-col px-4 lg:container lg:mx-auto">
        <PageTitleSticky
          style={{padding:'0.5rem 0rem 1rem 0rem'}}
        >
          {/* <div className="w-full flex justify-between items-center"> */}
          <h1 className="flex-1">{pageTitle}</h1>
          {/* </div> */}
        </PageTitleSticky>

        <section className="grid md:grid-cols-[1fr_4fr] gap-8">
          <AdminNav />
          {children}
        </section>
      </article>
    )
  }

  // 403 if not rsd_admin
  return (
    <PageErrorMessage
      status={403}
      message='FORBIDDEN'
    />
  )
}
