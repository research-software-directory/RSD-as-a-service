// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type MentionPublisherItemProps = {
  publisher: string | null
  page: string | null
  publication_year: number | null,
  journal: string | null,
  className?:string
}
export default function MentionPublisherItem(
  {publisher, page, publication_year, journal, className}: MentionPublisherItemProps
) {

  if (publisher || publication_year || journal) {
    return (
      <div className={className}>
        Published {journal && `in ${journal}`} {publisher && `by ${publisher}`} {publication_year && `in ${publication_year}`}{page && `, page: ${page}`}
      </div>
    )
  } else return null
}
