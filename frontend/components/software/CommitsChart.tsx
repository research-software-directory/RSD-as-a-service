// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {CommitHistory} from '../../types/SoftwareTypes'
import {getTimeAgoSince} from '../../utils/dateFn'
import {prepareDataForSoftwarePage} from '../charts/d3LineChart/formatData'
import SingleLineChart from '../charts/d3LineChart/SingleLineChart'

export default function CommitsChart({commit_history,className}:
  {commit_history: CommitHistory,className?:string}) {
  // ignore if no commit histiry
  if (!commit_history) return null
  // format commits data for chart and calculate other stats
  const {lineData, lastCommitDate, totalCountY} = prepareDataForSoftwarePage(commit_history)

  // exit if no commit history
  if (lineData.length===0) return null

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
