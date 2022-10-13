// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0
import InfoIcon from '@mui/icons-material/Info'
import Diversity1Icon from '@mui/icons-material/Diversity1'
import FactoryIcon from '@mui/icons-material/Factory'
import AddCommentIcon from '@mui/icons-material/AddComment'
import ThreePIcon from '@mui/icons-material/ThreeP'
import ShareIcon from '@mui/icons-material/Share'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

import SoftwareInformation from './information'
import SoftwareContributors from './contributors'
import SoftwareOgranisations from './organisations'
import SoftwareMentions from './mentions'
import SoftwareTestimonials from './testimonials'
import RelatedTopics from './related'
import SoftwareMaintainers from './maintainers'

export type EditSoftwarePageProps = {
  formId?:string,
  status: string,
  label: string,
  icon: JSX.Element,
  component: (props:any)=>JSX.Element
}

export const editSoftwarePage:EditSoftwarePageProps[] = [
  {
    // formId: 'software-information',
    label: 'Information',
    icon: <InfoIcon />,
    component: (props?) => <SoftwareInformation {...props} />,
    status: 'Required information'
  },
  {
    // formId: 'contributors',
    label: 'Contributors',
    icon: <Diversity1Icon />,
    component: (props?) => <SoftwareContributors {...props} />,
    status: 'Required information'
  },
  {
    label: 'Organisations',
    icon: <FactoryIcon />,
    component: (props?) => <SoftwareOgranisations {...props} />,
    status: 'Optional information'
  },
  {
    label: 'Mentions',
    icon: <AddCommentIcon />,
    component: (props?) => <SoftwareMentions {...props} />,
    status: 'Optional information'
  },
  {
    // formId: 'testimonials',
    label: 'Testimonials',
    icon: <ThreePIcon />,
    component: (props?) => <SoftwareTestimonials {...props} />,
    status: 'Optional information'
  },
  {
    // formId: 'related-software',
    label: 'Related topics',
    icon: <ShareIcon />,
    component: (props?) => <RelatedTopics {...props} />,
    status: 'Optional information'
  },
  {
    // formId: 'output',
    label: 'Maintainers',
    icon: <PersonAddIcon />,
    component: (props?) => <SoftwareMaintainers {...props} />,
    status: 'Optional information'
  }
]
