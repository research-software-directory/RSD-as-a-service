// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {mentionType} from '~/components/mention/config'

// export type MentionEditType = keyof typeof mentionTypeSingular
export type MentionTypeKeys = keyof typeof mentionType

// as in mention table
// if you update this type, also update the field 'mentionColumns' below
export type MentionItemProps = {
  id: string | null
  doi: string | null
  url: string | null
  title: string | null
  authors: string | null
  publisher: string | null
  publication_year: number | null
  journal: string | null
  page: string | null
  // url to external image
  image_url: string | null
  // is_featured?: boolean
  mention_type: MentionTypeKeys | null
  source: string
  note?: string | null
  openalex_id?: string | null
}

export const mentionColumns ='id,doi,openalex_id,url,title,authors,publisher,publication_year,journal,page,image_url,mention_type,source,note'

export type MentionByType = {
  [key in MentionTypeKeys]?: MentionItemProps[]
}

