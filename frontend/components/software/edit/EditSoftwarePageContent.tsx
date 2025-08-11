// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import dynamic from 'next/dynamic'

import ContentLoader from '~/components/layout/ContentLoader'

const SoftwareDescription = dynamic(() => import('./information'),{
  loading: ()=><ContentLoader />
})
const SoftwareLinks = dynamic(() => import('./links'),{
  loading: ()=><ContentLoader />
})
// use dynamic imports instead
const SoftwareContributors = dynamic(() => import('./contributors'),{
  loading: ()=><ContentLoader />
})
const SoftwareOrganisations = dynamic(() => import('./organisations'),{
  loading: ()=><ContentLoader />
})
const SoftwareMentions = dynamic(() => import('./mentions'),{
  loading: ()=><ContentLoader />
})
const SoftwareTestimonials = dynamic(() => import('./testimonials'),{
  loading: ()=><ContentLoader />
})
const PackageManagers = dynamic(() => import('./package-managers'),{
  loading: ()=><ContentLoader />
})
const SoftwareHeritage = dynamic(() => import('./software-heritage'),{
  loading: ()=><ContentLoader />
})
const RelatedSoftware = dynamic(() => import('./related-software'),{
  loading: ()=><ContentLoader />
})
const RelatedProjects = dynamic(() => import('./related-projects'),{
  loading: ()=><ContentLoader />
})
const SoftwareCommunities = dynamic(() => import('./communities'),{
  loading: ()=><ContentLoader />
})
const SoftwareMaintainers = dynamic(() => import('./maintainers'),{
  loading: ()=><ContentLoader />
})
const SoftwareServices = dynamic(() => import('./services'),{
  loading: ()=><ContentLoader />
})

export type EditSoftwarePageId = 'information' | 'links' | 'contributors' | 'organisations'| 'mentions' |
  'testimonials' | 'package-managers'|'software-heritage'|'communities'|'related-projects' | 'related-software' | 'maintainers'|
  'services'

export default function EditSoftwarePageContent({pageId}:Readonly<{pageId:EditSoftwarePageId}>) {
  switch (pageId){
    case 'information':
      return <SoftwareDescription />
    case 'links':
      return <SoftwareLinks />
    case 'contributors':
      return <SoftwareContributors />
    case 'organisations':
      return <SoftwareOrganisations />
    case 'mentions':
      return <SoftwareMentions />
    case 'testimonials':
      return <SoftwareTestimonials />
    case 'package-managers':
      return <PackageManagers />
    case 'software-heritage':
      return <SoftwareHeritage />
    case 'communities':
      return <SoftwareCommunities />
    case 'related-projects':
      return <RelatedProjects />
    case 'related-software':
      return <RelatedSoftware />
    case 'maintainers':
      return <SoftwareMaintainers />
    case 'services':
      return <SoftwareServices />
    default:
      // info as default route
      return <SoftwareDescription />
  }
}
