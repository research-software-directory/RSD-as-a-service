
import LinkIcon from '@mui/icons-material/Link'
import CommitsChart from './CommitsChart'
import {CommitHistory} from '../../types/SoftwareTypes'

export default function GetStartedSection({get_started_url, commit_history}:
  {get_started_url: string | null, commit_history: CommitHistory}) {

  function renderGetStartedUrl() {
    if (get_started_url) {
      return (
        <a href={get_started_url ?? ''} target="_blank" rel="noreferrer">
          <div className="bg-primary hover:bg-grey-500 text-white font-medium text-2xl py-4 px-6">
            Get started
            <LinkIcon sx={{marginLeft:'1rem', height:'2rem'}} />
          </div>
        </a>
      )
    }
    return null
  }

  if (!get_started_url) return null

  return (
    <section className="flex bg-grey-200 py-12 lg:pt-24 lg:pb-28">
      <article className="flex flex-col flex-1 items-start px-4 lg:flex-row lg:items-center lg:px-4 lg:container lg:mx-auto">
        {/* render get started url if present */}
        {renderGetStartedUrl()}

        <CommitsChart
          commit_history={commit_history}
        />
      </article>
    </section>
  )
}
