// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {isoStrToLocalDateStr} from '~/utils/dateFn'

type PublicationDateProps={
  publication_date:string|null
  className?:string
}

export default function PublicationDate({publication_date, className}:PublicationDateProps) {
  if (publication_date){
    return (
      <span
        className={`line-clamp-1 text-sm text-base-content-disabled tracking-widest uppercase ${className ?? ''}`}
      >
        {isoStrToLocalDateStr(publication_date)}
      </span>
    )
  }
  return null
}
