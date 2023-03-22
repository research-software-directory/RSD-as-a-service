// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import dynamic from 'next/dynamic'

import InfoIcon from '@mui/icons-material/Info'
import Diversity1Icon from '@mui/icons-material/Diversity1'
import FactoryIcon from '@mui/icons-material/Factory'
import AddCommentIcon from '@mui/icons-material/AddComment'
import ThreePIcon from '@mui/icons-material/ThreeP'
import ShareIcon from '@mui/icons-material/Share'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ContentLoader from '~/components/layout/ContentLoader'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'

// import SoftwareInformation from './information'
// import SoftwareContributors from './contributors'
// import SoftwareOgranisations from './organisations'
// import SoftwareMentions from './mentions'
// import SoftwareTestimonials from './testimonials'
// import RelatedTopics from './related'
// import SoftwareMaintainers from './maintainers'

// use dynamic imports instead
const SoftwareInformation = dynamic(() => import('./information'),{
  loading: ()=><ContentLoader />
})
const SoftwareContributors = dynamic(() => import('./contributors'),{
  loading: ()=><ContentLoader />
})
const SoftwareOgranisations = dynamic(() => import('./organisations'),{
  loading: ()=><ContentLoader />
})
const PackageManagers = dynamic(() => import('./package-managers'),{
  loading: ()=><ContentLoader />
})
const SoftwareMentions = dynamic(() => import('./mentions'),{
  loading: ()=><ContentLoader />
})
const SoftwareTestimonials = dynamic(() => import('./testimonials'),{
  loading: ()=><ContentLoader />
})
const RelatedTopics = dynamic(() => import('./related'),{
  loading: ()=><ContentLoader />
})
const SoftwareMaintainers = dynamic(() => import('./maintainers'),{
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
    label: 'Information',
    icon: <InfoIcon />,
    render: () => <SoftwareInformation />,
    status: 'Required information'
  },{
    id: 'contributors',
    label: 'Contributors',
    icon: <Diversity1Icon />,
    render: () => <SoftwareContributors />,
    status: 'Required information'
  },{
    id: 'organisations',
    label: 'Organisations',
    icon: <FactoryIcon />,
    render: () => <SoftwareOgranisations />,
    status: 'Optional information'
  },{
    id: 'mentions',
    label: 'Mentions',
    icon: <AddCommentIcon />,
    render: () => <SoftwareMentions />,
    status: 'Optional information'
  },{
    id: 'testimonials',
    label: 'Testimonials',
    icon: <ThreePIcon />,
    render: () => <SoftwareTestimonials />,
    status: 'Optional information'
  },{
    id: 'package-managers',
    label: 'Package managers',
    icon: <HomeRepairServiceIcon />,
    render: () => <PackageManagers />,
    status: 'Optional information'
  },{
    id: 'related-topics',
    label: 'Related topics',
    icon: <ShareIcon />,
    render: () => <RelatedTopics />,
    status: 'Optional information'
  },{
    id: 'maintainers',
    label: 'Maintainers',
    icon: <PersonAddIcon />,
    render: () => <SoftwareMaintainers />,
    status: 'Optional information'
  }
]
