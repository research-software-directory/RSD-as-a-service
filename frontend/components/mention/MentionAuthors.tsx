type MentionAuthors = {
  authors: string | null
  className?: string
}

export default function MentionAuthors({authors, className}: MentionAuthors) {
  if (authors) {
    return (
      <div className={className}>
        Author(s): {authors}
      </div>
    )
  }
  return null
}
