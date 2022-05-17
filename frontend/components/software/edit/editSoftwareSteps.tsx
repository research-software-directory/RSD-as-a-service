
import Filter1Icon from '@mui/icons-material/Filter1'
import Filter2Icon from '@mui/icons-material/Filter2'
import Filter3Icon from '@mui/icons-material/Filter3'
import Filter4Icon from '@mui/icons-material/Filter4'
import Filter5Icon from '@mui/icons-material/Filter5'
import Filter6Icon from '@mui/icons-material/Filter6'
import Filter7Icon from '@mui/icons-material/Filter7'

import SoftwareInformation from './information'
import SoftwareContributors from './contributors'
import SoftwareOgranisations from './organisations'
import SoftwareMentions from './mentions'
import SoftwareTestimonials from './testimonials'
import RelatedTopics from './related'
import SoftwareMaintainers from './maintainers'

export type EditSoftwarePageStep = {
  formId?:string,
  status: string,
  label: string,
  icon: JSX.Element,
  component: (props:any)=>JSX.Element
}

export const editSoftwareMenu:EditSoftwarePageStep[] = [
  {
    formId: 'software-information',
    label: 'Software information',
    icon: <Filter1Icon />,
    component: (props?) => <SoftwareInformation {...props} />,
    status: 'Required information'
  },
  {
    // formId: 'contributors',
    label: 'Contributors',
    icon: <Filter2Icon />,
    component: (props?) => <SoftwareContributors {...props} />,
    status: 'Required information'
  },
  {
    label: 'Organisations',
    icon: <Filter3Icon />,
    component: (props?) => <SoftwareOgranisations {...props} />,
    status: 'Optional information'
  },
  {
    label: 'Mentions',
    icon: <Filter4Icon />,
    component: (props?) => <SoftwareMentions {...props} />,
    status: 'Optional information'
  },
  {
    formId: 'testimonials',
    label: 'Testimonials',
    icon: <Filter5Icon />,
    component: (props?) => <SoftwareTestimonials {...props} />,
    status: 'Optional information'
  },
  {
    // formId: 'related-software',
    label: 'Related topics',
    icon: <Filter6Icon />,
    component: (props?) => <RelatedTopics {...props} />,
    status: 'Optional information'
  },
  {
    // formId: 'output',
    label: 'Maintainers',
    icon: <Filter7Icon />,
    component: (props?) => <SoftwareMaintainers {...props} />,
    status: 'Optional information'
  }
]
