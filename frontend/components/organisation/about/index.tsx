import {useRouter} from 'next/router'
import {Alert, AlertTitle} from '@mui/material'
import ReactMarkdownWithSettings from '~/components/layout/ReactMarkdownWithSettings'
import {OrganisationComponentsProps} from '../OrganisationNavItems'

export function AboutPagePlaceholder() {
  const router = useRouter()
  function goToSettings() {
    router.push({
      query: {
        slug:router.query['slug'],
        page:'settings'
      }
    })
  }
  // this message is only shown to organisation maintainers
  return (
    <Alert severity="info" sx={{marginTop:'0.5rem'}}>
      <AlertTitle sx={{fontWeight: 500}}>About section not defined</AlertTitle>
      <p>About section is not visible to the vistors because it does not have any content.</p>
      <span>To activate about section add the content to about section <strong>
          <button onClick={goToSettings}>in the settings.</button>
        </strong>
      </span>
    </Alert>
  )
}


export default function AboutPage({organisation}: OrganisationComponentsProps) {
  // if description is present we return markdown page
  if (organisation.description) {
    return (
      <section className="pt-2 pb-12">
        <ReactMarkdownWithSettings
            markdown={organisation?.description}
        />
      </section>
    )
  }
  // if no description we return placeholder info
  return <AboutPagePlaceholder />
}
