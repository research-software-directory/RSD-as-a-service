
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
import RelatedSoftwareInfo from './RelatedSoftwareInfo'

export type EditSoftwarePage = {
  status: string,
  label: string,
  icon: JSX.Element,
  component: JSX.Element
}

export const editSoftwareMenu:EditSoftwarePage[] = [
  {label: 'Software information', icon: <Filter1Icon />, component: <SoftwareInformation />, status:'Requered information'},
  {label: 'Contributors', icon: <Filter2Icon />, component: <SoftwareContributors />, status: 'Requered information'},
  {label: 'Organisations', icon: <Filter3Icon/>, component: <SoftwareOgranisations/>, status:'Optional information'},
  {label: 'Mentions', icon: <Filter4Icon />, component: <SoftwareMentions />, status: 'Optional information'},
  {label: 'Testimonials', icon: <Filter5Icon />, component: <SoftwareTestimonials />, status:'Optional information'},
  {label: 'Related software', icon: <Filter6Icon/>, component: <RelatedSoftwareInfo/>, status:'Optional information'}
]
