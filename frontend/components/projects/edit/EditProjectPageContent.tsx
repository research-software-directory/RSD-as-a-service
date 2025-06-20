// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import dynamic from 'next/dynamic'
import ContentLoader from '~/components/layout/ContentLoader'

// use dynamic imports
const ProjectInformation = dynamic(() => import('./information'),{
  loading: ()=><ContentLoader />
})
const ProjectTeam = dynamic(() => import('./team'),{
  loading: ()=><ContentLoader />
})
const ProjectOrganisations = dynamic(() => import('./organisations'),{
  loading: ()=><ContentLoader />
})
const ProjectMentions = dynamic(() => import('./mentions'),{
  loading: ()=><ContentLoader />
})
const RelatedProjects = dynamic(() => import('./related-projects'),{
  loading: ()=><ContentLoader />
})
const RelatedSoftware = dynamic(() => import('./related-software'),{
  loading: ()=><ContentLoader />
})
const ProjectTestimonials = dynamic(() => import('./testimonials'),{
  loading: ()=><ContentLoader />
})

const ProjectMaintainers = dynamic(() => import('./maintainers'),{
  loading: ()=><ContentLoader />
})

export type EditProjectPageId = 'information' | 'team' | 'organisations' | 'mentions' | 'testimonials' | 'related-projects' | 'related-software' | 'maintainers'

export default function EditProjectPageContent({pageId}:Readonly<{pageId:EditProjectPageId}>) {
  switch (pageId){
    case 'information':
      return <ProjectInformation />
    case 'team':
      return <ProjectTeam />
    case 'organisations':
      return <ProjectOrganisations />
    case 'mentions':
      return <ProjectMentions />
    case 'testimonials':
      return <ProjectTestimonials />
    case 'related-projects':
      return <RelatedProjects />
    case 'related-software':
      return <RelatedSoftware />
    case 'maintainers':
      return <ProjectMaintainers />
    default:
      // project info as default route
      return <ProjectInformation />
  }
}
