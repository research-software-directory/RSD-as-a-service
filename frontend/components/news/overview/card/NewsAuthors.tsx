// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
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
        className={`line-clamp-1 text-sm text-base-content-disabled ${className ?? ''}`}
      >
        {author}
      </span>
    )
  }
  return null
}
