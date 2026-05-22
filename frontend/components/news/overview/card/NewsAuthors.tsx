// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type PublicationDateProps={
  author:string|null
  className?:string
}

export default function NewsAuthors({author, className}:PublicationDateProps) {
  if (author){
    return (
      <span
        className={`line-clamp-1 text-sm text-base-content-secondary ${className ?? ''}`}
      >
        {author}
      </span>
    )
  }
  return null
}
