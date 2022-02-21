import {CommitHistory} from '../../types/SoftwareTypes'
import {getTimeAgoSince} from '../../utils/dateFn'
import {prepareDataForSoftwarePage} from '../charts/d3LineChart/formatData'
import SingleLineChart from '../charts/d3LineChart/SingleLineChart'

export default function CommitsChart({commit_history}: { commit_history: CommitHistory }) {
  // ignore if no commit histiry
  if (!commit_history) return null
  // format commits data for chart and calculate other stats
  const {lineData, lastCommitDate, totalCountY} = prepareDataForSoftwarePage(commit_history)

  // render
  return (
    <div className="flex-1 pl-0 lg:pl-24 w-full">
      <SingleLineChart data={lineData} />
      <div className="software_commitsStat pt-4" id="commitsStat">
        <b>{totalCountY} commits</b> | Last commit <b>&#x2248; {
          getTimeAgoSince(new Date(),lastCommitDate?.toISOString()??null)
        }</b>
      </div>
    </div>
  )
}
