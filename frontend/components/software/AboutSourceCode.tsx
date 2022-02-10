
import GitHubIcon from '@mui/icons-material/GitHub'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

export default function AboutSourceCode({repository}:{repository: string|null}) {
  const code = '</>'

  function getIcon() {
    // abort if no info
    if (repository && repository.length > 3) {
      // return github icon or folder icon for other urls
      if (repository?.toLowerCase()?.indexOf('github') > -1) {
        return (
          <a key={repository} href={repository} title="Github repository" target="_blank" rel="noreferrer">
            <GitHubIcon sx={{
              width: '3rem',
              height: '3rem'
            }} />
          </a>
        )
      } else {
        return (
          <a key={repository} href={repository} title="Repository" target="_blank" rel="noreferrer">
            <FolderOpenIcon sx={{
              width: '3rem',
              height: '3rem',
              color: 'secondary'
            }} />
          </a>
        )
      }
    }
    return null
  }

  return (
    <>
    <div className="pt-8 pb-2">
      <span className="font-bold text-primary">{code}</span>
      <span className="text-primary pl-2">Source code</span>
    </div>
    <div className="py-1">
      {getIcon()}
    </div>
    </>
  )
}
