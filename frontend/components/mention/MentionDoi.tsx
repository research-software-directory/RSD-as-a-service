import {MentionItemRole} from './MentionItemBase'

type MentionDoiProps = {
  url: string | null
  doi: string | null
  role?: MentionItemRole
  className?: string
}

export default function MentionDoi({url, doi, role = 'view', className}: MentionDoiProps) {
  if (doi && role === 'find') {
    return (
      <div className={className}>
        DOI: {doi}
      </div>
    )
  }
  if (url && doi) {
    return (
      <div className={className}>
        <a href={url} target="_blank" rel="noreferrer">
          DOI: {doi}
        </a>
      </div>
    )
  }
  if (doi) {
    return (
      <div className={className}>
        {doi}
      </div>
    )
  }
  return null
}
