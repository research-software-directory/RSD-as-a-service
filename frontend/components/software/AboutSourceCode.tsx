
import GitHubIcon from '@mui/icons-material/GitHub'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

export default function AboutSourceCode({repository=[]}:{repository: string[]}) {
  const code = '</>'

  function getIcons() {
    // abort if no info
    if (repository?.length === 0) return null
    // return github icon or folder icon for other urls
    return repository.map((item, pos) => {
      if (item.toLowerCase().indexOf('github') > -1) {
        return (
          <a key={pos} href={item} title="Github repository" target="_blank" rel="noreferrer">
            <GitHubIcon sx={{
              width: '3rem',
              height: '3rem'
            }} />
          </a>
        )
      } else {
        return (
          <a key={pos} href={item} title="Repository" target="_blank" rel="noreferrer">
            <FolderOpenIcon />
          </a>
        )
      }
    })
  }

  return (
    <>
    <div className="pt-8 pb-2">
      <span className="font-bold text-primary">{code}</span>
      <span className="text-primary pl-2">Source code</span>
    </div>
    <ul className="py-1">
      {getIcons()}
    </ul>
    </>
  )
}
