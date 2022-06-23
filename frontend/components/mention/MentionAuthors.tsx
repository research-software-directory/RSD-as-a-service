// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

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
