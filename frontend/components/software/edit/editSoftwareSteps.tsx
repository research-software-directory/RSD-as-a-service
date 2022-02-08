
import Filter1Icon from '@mui/icons-material/Filter1'
import Filter2Icon from '@mui/icons-material/Filter2'
import Filter3Icon from '@mui/icons-material/Filter3'
import Filter4Icon from '@mui/icons-material/Filter4'
import Filter5Icon from '@mui/icons-material/Filter5'
import Filter6Icon from '@mui/icons-material/Filter6'

import SoftwareInformation from './SoftwareInformation'
import SoftwareContributors from './SoftwareContributors'
import SoftwareOgranisations from './SoftwareOgranisations'
import SoftwareMentions from './SoftwareMentions'
import SoftwareTestimonials from './SoftwareTestimonials'
import RelatedSoftwareInfo from './RelatedSoftwareEdit'

export type EditSoftwarePageStep = {
  id:string,
  status: string,
  label: string,
  icon: JSX.Element,
  component: (props:any)=>JSX.Element
}

export const editSoftwareMenu:EditSoftwarePageStep[] = [
  {
    id: 'software-information',
    label: 'Software information',
    icon: <Filter1Icon />,
    component: (props?) => <SoftwareInformation {...props} />,
    status: 'Required information'
  },
  {
    id: 'contributors',
    label: 'Contributors',
    icon: <Filter2Icon />,
    component: (props?) => <SoftwareContributors {...props} />,
    status: 'Required information'
  },
  {
    id: 'organisations',
    label: 'Organisations',
    icon: <Filter3Icon />,
    component: (props?) => <SoftwareOgranisations {...props} />,
    status: 'Optional information'
  },
  {
    id:'mentions',
    label: 'Mentions',
    icon: <Filter4Icon />,
    component: (props?) => <SoftwareMentions {...props} />,
    status: 'Optional information'
  },
  {
    id:'testimonials',
    label: 'Testimonials',
    icon: <Filter5Icon />,
    component: (props?) => <SoftwareTestimonials {...props} />,
    status: 'Optional information'
  },
  {
    id:'related-software',
    label: 'Related software',
    icon: <Filter6Icon />,
    component: (props?) => <RelatedSoftwareInfo {...props} />,
    status: 'Optional information'
  }
]
