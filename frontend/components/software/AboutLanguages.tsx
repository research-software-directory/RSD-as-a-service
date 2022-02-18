import Code from '@mui/icons-material/Code'
import {PrograminLanguages} from '../../types/SoftwareTypes'

export default function AboutLanguages({languages}: {languages: PrograminLanguages }) {

  if (typeof languages == 'undefined') return null

  // extract language keys
  const keys = Object.keys(languages)

  // calculate total lines of code
  let total = 0
  keys.map((key) => {
    total+=languages[key]
  })
  // calculate pct
  const stats:any = {}
  keys.map(key => {
    const pct = Math.round((languages[key] / total) * 100)
    if (pct > 0) {
      stats[key] = {
        val: languages[key],
        pct
      }
    }
  })

  function getStatBar(key: string) {
    // calculate percentage of total code base
    const pct = Math.round((languages[key] / total) * 100)
    if (pct > 0) {
      // return bar scaled to pct
      return (
        <div
          title={`${pct}%`}
          className="bg-grey-400"
          style={{
            width: `${pct}%`,
            height: '0.5rem',
            opacity: 0.5
          }}>
        </div>
      )
    }
  }

  return (
    <>
    <div className="pt-8 pb-2">
      <Code color="primary" />
      <span className="text-primary pl-2">Programming language</span>
    </div>
    <ul className="py-1">
      {/* show only stat selection pct > 0*/}
      {Object.keys(stats)?.map((key) => {
        return (
          <li key={key}>
            {key}
            <div
              title={`${stats[key].pct}%`}
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
