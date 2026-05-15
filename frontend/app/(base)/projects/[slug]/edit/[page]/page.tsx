// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (NLEsc) <d.mijatovic@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import EditProjectInformation from '~/components/projects/edit/information'
import ProjectMaintainers from '~/components/projects/edit/maintainers'
import ProjectMentions from '~/components/projects/edit/mentions'
import ProjectOrganisations from '~/components/projects/edit/organisations'
import RelatedProjectsForProject from '~/components/projects/edit/related-projects'
import RelatedSoftwareForProject from '~/components/projects/edit/related-software'
import ProjectTeam from '~/components/projects/edit/team'
import ProjectTestimonials from '~/components/projects/edit/testimonials'
import {editProjectMenuItems, EditProjectPageId} from '~/components/projects/edit/editProjectMenuItems'

export async function generateMetadata({
  params
}:Readonly<{
  params: Promise<{slug: string, page: EditProjectPageId}>
}>): Promise<Metadata> {
  const {page} = await params
  const menuItem = editProjectMenuItems.find(item => item.id === page)
  return {
    // use label of the menu item to added to page title
    title: menuItem ? `${menuItem.label} | Edit project | ${app.title}` : `Edit project | ${app.title}`,
    description: 'Edit project page',
  }
}

export default async function EditProjectPageRouter({
  params
}:Readonly<{
  params: Promise<{slug: string, page: string}>
}>) {
  // extract page to show
  const {page} = await params

  switch (page){
    case 'information':
      return <EditProjectInformation />
    case 'team':
      return <ProjectTeam />
    case 'organisations':
      return <ProjectOrganisations />
    case 'mentions':
      return <ProjectMentions />
    case 'testimonials':
      return <ProjectTestimonials />
    case 'related-projects':
      return <RelatedProjectsForProject />
    case 'related-software':
      return <RelatedSoftwareForProject />
    case 'maintainers':
      return <ProjectMaintainers />
    default:
      // project info as default route
      return notFound()
  }

}
