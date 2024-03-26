// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
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
        className={`line-clamp-1 text-sm text-base-content-disabled font-medium tracking-widest ${className ?? ''}`}
      >
        {author}
      </span>
    )
  }
  return null
}
