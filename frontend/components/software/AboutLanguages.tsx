import Code from '@mui/icons-material/Code'

export default function AboutLanguages({languages=[]}: { languages: string[] }) {

  if (languages.length===0) return null

  return (
    <>
    <div className="pt-8 pb-2">
      <Code color="primary" />
      <span className="text-primary pl-2">Programming language</span>
    </div>
    <ul className="py-1">
      {languages.map((item, pos) => {
        return <li key={pos}>{ item }</li>
      })}
    </ul>
    </>
  )
}
