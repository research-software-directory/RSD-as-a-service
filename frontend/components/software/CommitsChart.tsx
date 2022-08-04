// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {CommitHistory} from '../../types/SoftwareTypes'
import {getTimeAgoSince} from '../../utils/dateFn'
import {prepareDataForSoftwarePage} from '../charts/d3LineChart/formatData'
import NoDataAvailableChart from '../charts/d3LineChart/NoDataAvailableChart'
import SingleLineChart from '../charts/d3LineChart/SingleLineChart'


export default function CommitsChart({commit_history, className, noCommitMessage}:
  {commit_history: CommitHistory, className?:string, noCommitMessage?:string}) {

    if (noCommitMessage) return (
    <div className={`flex-1 w-full ${className ?? ''}`}>
      <NoDataAvailableChart text={noCommitMessage}/>
    </div>
  )
  // format commits data for chart and calculate other stats
  const {lineData, lastCommitDate, totalCountY} = prepareDataForSoftwarePage(commit_history)

  // render
  return (
    <div className={`flex-1 w-full ${className ?? ''}`}>
      <SingleLineChart data={lineData} />
      <div className="software_commitsStat pt-4" id="commitsStat">
        <b>{totalCountY} commits</b> | Last commit <b>&#x2248; {
          getTimeAgoSince(new Date(),lastCommitDate?.toISOString()??null)
        }</b>
      </div>
    </div>
  )
}
