import Code from '@mui/icons-material/Code'
import {ProgramingLanguages} from '../../types/SoftwareTypes'
import logger from '../../utils/logger'

/**
 * Calculate programming languages percentages.
 * Inlclude only languages > 1% of code base.
 * Put all others in Other category.
 * @param languages
 * @returns
 */
function calculateStats(languages: ProgramingLanguages) {
  try {
    // extract language keys
    const keys = Object.keys(languages)

    let total = 0, totPct=0, totVal=0, totLang=[]
    // calculate total
    keys.map((key) => {
      total+=languages[key]
    })
    // calculate stats
    const stats:any = {}
    keys.map(key => {
      const pct = Math.round((languages[key] / total) * 100)
      totPct += pct
      totVal += languages[key]
      if (pct > 0) {
        totLang.push(key)
        stats[key] = {
          val: languages[key],
          pct
        }
      }
    })
    // do we need Other category?
    if (totPct < 100 && (keys.length - totLang.length > 1)) {
      // add other to stats
      stats['Other'] = {
        val: total - totVal,
        pct: 100 - totPct
      }
    }
    return stats
  } catch (e:any) {
    logger(`AboutLanguages: Failed to calculateStats. Error: ${e.message}`, 'error')
  }
}


export default function AboutLanguages({languages}: {languages: ProgramingLanguages }) {
  // don't render section if no languages
  if (typeof languages == 'undefined' || languages === null) return null
  const stats = calculateStats(languages)
  // don't render if stats failed
  if (typeof stats == 'undefined') return null

  return (
    <>
    <div className="pt-8 pb-2">
      <Code color="primary" />
      <span className="text-primary pl-2">Programming language</span>
    </div>
    <ul className="py-1">
      {/* show only stat selection pct > 0*/}
      {Object?.keys(stats)?.map((key) => {
        return (
          <li key={key}>
            {key} <span className="text-grey-500 ml-2">{stats[key].pct}%</span>
            <div
              className="bg-grey-400"
              style={{
                width: `${stats[key].pct}%`,
                height: '0.5rem',
                opacity: 0.5
              }}>
            </div>
          </li>
        )
      })}
    </ul>
    </>
  )
}
