// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import LinkIcon from '@mui/icons-material/Link'
import CommitsChart from './CommitsChart'
import {CommitHistory} from '../../types/SoftwareTypes'

type GetStartedSectionProps = {
  get_started_url: string | null,
  repository_url: string | null,
  commit_history: CommitHistory,
  commit_history_scraped_at: string
}

export default function GetStartedSection(props:GetStartedSectionProps) {
  const {repository_url, get_started_url, commit_history, commit_history_scraped_at} = props

  // if no get_started_url and repository_url we do not render this section
  if (!get_started_url && !repository_url) return null

  function renderGetStartedUrl() {
    if (get_started_url) {
      return (
        <a href={get_started_url ?? ''} target="_blank" rel="noreferrer">
          <div className="bg-primary text-primary-content font-medium text-2xl py-4 px-6">
            Get started
            <LinkIcon sx={{marginLeft:'1rem', height:'2rem'}} />
          </div>
        </a>
      )
    }
    return null
  }

  function renderCommitChart() {
    let classes=''
    if (get_started_url) {
      // add margin when get_started_url is present
      classes = 'pl-0 lg:pl-24'
    }
    return (
      <CommitsChart
        className={classes}
        repository_url={repository_url}
        commit_history={commit_history}
        commit_history_scraped_at={commit_history_scraped_at}
      />
    )
  }

  return (
    <section className="flex bg-base-200 py-12 lg:pt-24 lg:pb-28">
      <article className="flex flex-col flex-1 items-start px-4 lg:flex-row lg:items-center lg:px-4 lg:container lg:mx-auto">
        {/* render get started url if present */}
        {renderGetStartedUrl()}
        {renderCommitChart()}
      </article>
    </section>
  )
}
