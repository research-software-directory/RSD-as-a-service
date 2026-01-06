import {notFound} from 'next/navigation'

import ProtectedContent from '~/auth/ProtectedContent'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'
import {getProjectItem} from '~/components/projects/apiProjects'
import {EditProjectProvider} from '~/components/projects/edit/context/editProjectContext'
import EditProjectNav from '~/components/projects/edit/EditProjectNav'
import EditProjectStickyHeader from '~/components/projects/edit/EditProjectStickyHeader'

/**
 * EditProjectLayout adds article with container layout (lg:)
 * @param param0
 * @returns
 */
export default async function EditProjectLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params
}: Readonly<{
  children: React.ReactNode
  // extract slug from params
  params: Promise<{slug: string}>
}>) {

  const [{slug},{token},modules] = await Promise.all([
    params,
    getUserSettings(),
    getActiveModuleNames()
  ])

  // show 404 page if module is not enabled
  if (modules.includes('projects')===false){
    return notFound()
  }

  const editProject = await getProjectItem({slug, token})
  // show 404 project not found in DB
  if (editProject === undefined) {
    return notFound()
  }

  return (
    <>
      <noscript>
        <p style={{fontSize: '2rem', textAlign: 'center'}}>Please enable JavaScript to use this page</p>
      </noscript>
      <ProtectedContent slug={slug} pageType="project">
        <UserAgreementModal />

        {/* edit project context to share project info between pages */}
        <EditProjectProvider state={{
          id: editProject.id,
          slug: editProject.slug,
          title: editProject.title
        }}>
          <article className="flex-1 flex flex-col px-4 lg:container lg:mx-auto">
            <EditProjectStickyHeader />
            <section className="flex-1 md:flex gap-[3rem]">
              <EditProjectNav slug={slug}/>
              {children}
            </section>
          </article>
        </EditProjectProvider>
      </ProtectedContent>
    </>
  )
}
