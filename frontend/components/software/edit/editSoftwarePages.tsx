// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import dynamic from 'next/dynamic'

import AppShortcutIcon from '@mui/icons-material/AppShortcut'
import GroupIcon from '@mui/icons-material/Group'
import BusinessIcon from '@mui/icons-material/Business'
import AddCommentIcon from '@mui/icons-material/AddComment'
import ThreePIcon from '@mui/icons-material/ThreeP'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ContentLoader from '~/components/layout/ContentLoader'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'
import JoinInnerIcon from '@mui/icons-material/JoinInner'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import ArticleIcon from '@mui/icons-material/Article'
import Diversity3Icon from '@mui/icons-material/Diversity3'


// use dynamic imports instead
const SoftwareContributors = dynamic(() => import('./contributors'),{
  loading: ()=><ContentLoader />
})
const SoftwareDescription = dynamic(() => import('./information'),{
  loading: ()=><ContentLoader />
})
const SoftwareLinks = dynamic(() => import('./links'),{
  loading: ()=><ContentLoader />
})
const SoftwareMaintainers = dynamic(() => import('./maintainers'),{
  loading: ()=><ContentLoader />
})
const SoftwareMentions = dynamic(() => import('./mentions'),{
  loading: ()=><ContentLoader />
})
const SoftwareOrganisations = dynamic(() => import('./organisations'),{
  loading: ()=><ContentLoader />
})
const PackageManagers = dynamic(() => import('./package-managers'),{
  loading: ()=><ContentLoader />
})
const RelatedSoftware = dynamic(() => import('./related-software'),{
  loading: ()=><ContentLoader />
})
const RelatedProjects = dynamic(() => import('./related-projects'),{
  loading: ()=><ContentLoader />
})
const SoftwareTestimonials = dynamic(() => import('./testimonials'),{
  loading: ()=><ContentLoader />
})
const SoftwareServices = dynamic(() => import('./services'),{
  loading: ()=><ContentLoader />
})
const SoftwareCommunities = dynamic(() => import('./communities'),{
  loading: ()=><ContentLoader />
})


export type EditSoftwarePageProps = {
  id: string
  status: string,
  label: string,
  icon: JSX.Element,
  render: () => JSX.Element
}

export const editSoftwarePage:EditSoftwarePageProps[] = [{
  id: 'information',
  label: 'Description',
  icon: <ArticleIcon />,
  render: () => <SoftwareDescription />,
  status: ''
},{
  id: 'links',
  label: 'Links & metadata',
  icon: <AppShortcutIcon />,
  render: () => <SoftwareLinks />,
  status: ''
},{
  id: 'contributors',
  label: 'Contributors',
  icon: <GroupIcon />,
  render: () => <SoftwareContributors />,
  status: ''
},{
  id: 'organisations',
  label: 'Organisations',
  icon: <BusinessIcon />,
  render: () => <SoftwareOrganisations />,
  status: ''
},{
  id: 'mentions',
  label: 'Mentions',
  icon: <AddCommentIcon />,
  render: () => <SoftwareMentions />,
  status: ''
},{
  id: 'testimonials',
  label: 'Testimonials',
  icon: <ThreePIcon />,
  render: () => <SoftwareTestimonials />,
  status: ''
},{
  id: 'package-managers',
  label: 'Package managers',
  icon: <HomeRepairServiceIcon />,
  render: () => <PackageManagers />,
  status: ''
},{
  id: 'communities',
  label: 'Communities',
  icon: <Diversity3Icon />,
  render: () => <SoftwareCommunities />,
  status: ''
},{
  id: 'related-software',
  label: 'Related software',
  icon: <JoinInnerIcon />,
  render: () => <RelatedSoftware />,
  status: ''
},{
  id: 'related-projects',
  label: 'Related projects',
  icon: <DonutLargeIcon />,
  render: () => <RelatedProjects />,
  status: ''
},{
  id: 'maintainers',
  label: 'Maintainers',
  icon: <PersonAddIcon />,
  render: () => <SoftwareMaintainers />,
  status: ''
},{
  id: 'services',
  label: 'Background services',
  icon: <MiscellaneousServicesIcon />,
  render: () => <SoftwareServices />,
  status: ''
}
]
