// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {CommitHistory} from '~/types/SoftwareTypes'
import {getTimeAgoSince} from '~/utils/dateFn'
import {prepareDataForSoftwarePage} from '~/components/charts/d3LineChart/formatData'
import NoDataAvailableChart from '~/components/charts/d3LineChart/NoDataAvailableChart'
import SingleLineChart from '~/components/charts/d3LineChart/SingleLineChart'

export type CommitsChartProps = {
  repository_url: string | null,
  commit_history?: CommitHistory
  commit_history_scraped_at?: string
  className?: string
}

export default function CommitsChart({repository_url, commit_history, commit_history_scraped_at, className}: CommitsChartProps) {
  // if there is commit_history
  if (commit_history && Object.keys(commit_history).length > 0) {
    // format commits data for chart and calculate other stats
    const {lineData, lastCommitDate, totalCountY} = prepareDataForSoftwarePage(commit_history)
    // render
    return (
      <div className={`flex-1 w-full ${className ?? ''}`}>
        <SingleLineChart data={lineData} />
        <div className="software_commitsStat pt-4" id="commitsStat">
          <b>{totalCountY} commits</b> | Last commit <b>&#x2248; {
            getTimeAgoSince(new Date(), lastCommitDate?.toISOString() ?? null)
          }</b>
        </div>
      </div>
    )
  }
  // ELSE if no commit history we show graph placeholder with the message
  let noCommitMessage: string | undefined
  if (typeof repository_url === 'undefined' || repository_url === null) {
    noCommitMessage = 'We cannot display the activity graph, because we do not know the repository url.'
  } else if (typeof commit_history_scraped_at === 'undefined' || commit_history_scraped_at === null) {
    // not scraped yet
    noCommitMessage = 'We did not scrape the commit history of this repository yet.'
  } else if (commit_history_scraped_at && commit_history && Object.keys(commit_history).length == 0) {
    // we did scraped repo but no commit history
    noCommitMessage = 'We cannot display this graph because the repository is empty.'
  } else if (commit_history_scraped_at && (typeof commit_history === 'undefined' || commit_history === null)) {
    // we did scraped repo but no commit history exists
    noCommitMessage = 'We cannot display this graph because we cannot read the commit history.'
  }

  return (
    <div className={`flex-1 w-full ${className ?? ''}`}>
      <NoDataAvailableChart text={noCommitMessage} />
    </div>
  )
}
