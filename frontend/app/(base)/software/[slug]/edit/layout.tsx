import {notFound} from 'next/navigation'

import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import ProtectedContent from '~/auth/ProtectedContent'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'
import {getSoftwareItem} from '~/components/software/apiSoftware'
import {EditSoftwareProvider} from '~/components/software/edit/context/editSoftwareContext'
import EditSoftwareStickyHeader from '~/components/software/edit/EditSoftwareStickyHeader'
import EditSoftwareNav from '~/components/software/edit/EditSoftwareNav'

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
  if (modules.includes('software')===false){
    return notFound()
  }

  const editSoftware = await getSoftwareItem({slug, token})
  // if software not found in DB
  if (editSoftware === undefined) {
    return notFound()
  }

  return (
    <>
      <noscript>
        <p style={{fontSize: '2rem', textAlign: 'center'}}>Please enable JavaScript to use this page</p>
      </noscript>
      <ProtectedContent slug={slug} pageType="software">
        <UserAgreementModal />
        <EditSoftwareProvider state={{
          id: editSoftware.id,
          slug: editSoftware.slug,
          brand_name: editSoftware.brand_name,
          concept_doi: editSoftware.concept_doi
        }}>
          <article className="flex-1 flex flex-col px-4 lg:container lg:mx-auto">
            <EditSoftwareStickyHeader />
            <section className="md:flex gap-[3rem] mb-8">
              <EditSoftwareNav slug={slug} />
              {children}
            </section>
          </article>
        </EditSoftwareProvider>
      </ProtectedContent>
    </>
  )

}
