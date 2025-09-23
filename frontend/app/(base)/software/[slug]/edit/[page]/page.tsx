import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import EditSoftwareCommunities from '~/components/software/edit/communities'
import EditSoftwareContributors from '~/components/software/edit/contributors'
import {EditSoftwarePageId} from '~/components/software/edit/editSoftwareMenuItems'
import EditSoftwareDescriptionPage from '~/components/software/edit/information'
import EditSoftwareLinksPage from '~/components/software/edit/links'
import EditSoftwareMaintainers from '~/components/software/edit/maintainers'
import EditSoftwareMentionsPage from '~/components/software/edit/mentions'
import SoftwareOrganisations from '~/components/software/edit/organisations'
import EditPackageManagers from '~/components/software/edit/package-managers'
import RelatedProjectsForSoftware from '~/components/software/edit/related-projects'
import RelatedSoftwareForSoftware from '~/components/software/edit/related-software'
import SoftwareHeritagePage from '~/components/software/edit/software-heritage'
import SoftwareTestimonials from '~/components/software/edit/testimonials'
import SoftwareRepositories from '~/components/software/edit/repositories'

import {app} from '~/config/app'

export const metadata: Metadata = {
  title: `Edit software | ${app.title}`,
  description: 'Edit software page',
}

export default async function EditSoftwarePageRouter({
  params
}:Readonly<{
  params: Promise<{slug: string, page: EditSoftwarePageId}>
}>) {
  // extract page to show
  const {page} = await params

  switch (page){
    case 'information':
      return <EditSoftwareDescriptionPage />
    case 'links':
      return <EditSoftwareLinksPage />
    case 'repositories':
      return <SoftwareRepositories />
    case 'contributors':
      return <EditSoftwareContributors />
    case 'organisations':
      return <SoftwareOrganisations />
    case 'mentions':
      return <EditSoftwareMentionsPage />
    case 'testimonials':
      return <SoftwareTestimonials />
    case 'package-managers':
      return <EditPackageManagers />
    case 'software-heritage':
      return <SoftwareHeritagePage />
    case 'communities':
      return <EditSoftwareCommunities />
    case 'related-software':
      return <RelatedSoftwareForSoftware />
    case 'related-projects':
      return <RelatedProjectsForSoftware />
    case 'maintainers':
      return <EditSoftwareMaintainers />
    default:
      // edit software 404 page
      return notFound()
  }

}
