type MentionDoiProps = {
  url: string | null
  doi: string | null
  className?: string
}

export default function MentionDoi({url,doi,className}:MentionDoiProps) {
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
