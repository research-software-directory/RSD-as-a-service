// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getTimeAgoSince} from '~/utils/dateFn'
import {prepareDataForSoftwarePage} from '~/components/charts/d3LineChart/formatData'
import NoDataAvailableChart from '~/components/charts/d3LineChart/NoDataAvailableChart'
import SingleLineChart from '~/components/charts/d3LineChart/SingleLineChart'
import {CommitHistory} from '~/components/software/edit/repositories/apiRepositories'

export type CommitsChartProps = Readonly<{
  repository_url?: string | null,
  archived?: boolean | null,
  star_count?: number | null,
  fork_count?: number | null,
  commit_history?: CommitHistory
  commit_history_scraped_at?: string | null
  className?: string
}>

export function ArchivedRepo({archived}:Readonly<{archived?:boolean|null}>){
  if (!archived) return null
  return (
    <span data-testid="archived-repository">
      <b className="text-warning uppercase">archived repository</b>
    </span>
  )
}

export function StarCount({star_count}:Readonly<{star_count?:number|null}>){
  if (star_count===null || star_count===undefined) return null
  return (
    <span data-testid="star-count">
      {star_count===1 ? `${star_count} star`:`${star_count} stars`}
    </span>
  )
}

export function ForkCount({fork_count}:Readonly<{fork_count?:number|null}>){
  if (fork_count===null || fork_count===undefined) return null
  return (
    <span data-testid="fork-count">
      {fork_count===1 ? `${fork_count} fork` : `${fork_count} forks`}
    </span>
  )
}

export function Commits({commits,lastCommitDate}:Readonly<{commits:number|null,lastCommitDate?:Date}>){
  return (
    <>
      <span><b>{commits===1 ? `${commits} commit` : `${commits} commits`}</b></span>
      <span>Last commit&nbsp;<b>&#x2248;&nbsp;{
        getTimeAgoSince(new Date(), lastCommitDate?.toISOString() ?? null)
      }</b></span>
    </>
  )
}

export default function CommitsChart({
  repository_url, commit_history, commit_history_scraped_at,
  archived, star_count, fork_count, className
}: CommitsChartProps) {
  // if there is commit_history
  if (commit_history && Object.keys(commit_history).length > 0) {
    // format commits data for chart and calculate other stats
    const {lineData, lastCommitDate, totalCountY} = prepareDataForSoftwarePage(commit_history)
    // render
    return (
      <div className={`flex-1 w-full ${className ?? ''}`}>
        <SingleLineChart data={lineData} />
        <div className="flex pt-4 px-2 *:border-l *:border-base-700 *:px-2 *:text-center" id="commitsStat">
          <ArchivedRepo archived={archived} />
          <Commits commits={totalCountY} lastCommitDate={lastCommitDate}/>
          <StarCount star_count={star_count} />
          <ForkCount fork_count={fork_count} />
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
