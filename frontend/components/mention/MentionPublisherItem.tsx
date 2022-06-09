// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type MentionPublisherItemProps = {
  publisher: string | null
  page: string | null
  publication_year: number | null
  className?:string
}
export default function MentionPublisherItem(
  {publisher, page, publication_year, className}: MentionPublisherItemProps
) {

  if (publisher && page && publication_year) {
    return (
      <div className={className}>
        Published by {publisher} in {publication_year}, page: {page}
      </div>
    )
  }
  if (publisher && publication_year) {
    return (
      <div className={className}>
        Published by {publisher} in {publication_year}
      </div>
    )
  }
  if (publisher && page) {
    return (
      <div className={className}>
        Published by {publisher}, page: {page}
      </div>
    )
  }
  if (publisher) {
    return (
      <div className={className}>
        Published by {publisher}
      </div>
    )
  }
  if (publication_year) {
    return (
      <div className={className}>
        Published in {publication_year}
      </div>
    )
  }
  return null
}
