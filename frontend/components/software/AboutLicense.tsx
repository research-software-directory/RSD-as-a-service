import AttachFileIcon from '@mui/icons-material/AttachFile'

export default function AboutLicense({license}:{license:string[]}) {
  return (
    <>
    <div className="pt-8 pb-2">
        <AttachFileIcon color="primary" sx={{transform:'rotate(45deg)'}} />
      <span className="text-primary pl-2">License</span>
    </div>
    <ul className="py-1">
      {license.map((item, pos) => {
        return <li key={pos}>{ item }</li>
      })}
    </ul>
    </>
  )
}
