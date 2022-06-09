// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {mentionType} from '~/components/mention/config'

// export type MentionEditType = keyof typeof mentionTypeSingular
export type MentionTypeKeys = keyof typeof mentionType
export type MentionType = {
  [key in MentionTypeKeys]?: {
    key: string
    plural: string
    singular: string
  }
}

// as in mention table
export type MentionItemProps = {
  id: string | null
  doi: string | null
  url: string | null
  title: string | null
  authors: string | null
  publisher: string | null
  publication_year: number | null
  page: string | null
  // url to external image
  image_url: string | null
  // is_featured?: boolean
  mention_type: MentionTypeKeys | null
  source: string
}

export type MentionByType = {
  [key in MentionTypeKeys]?: MentionItemProps[]
}

// mention table joined with mention_for_software
export type MentionForSoftware = MentionItemProps & {
  mention_for_software?: any[]
}

// mention table joined with output_for_project OR impact_for_project
export type MentionForProject = MentionItemProps & {
  output_for_project?: any[]
  impact_for_project?: any[]
}

export const mentionColumns ='id,doi,url,title,authors,publisher,publication_year,page,image_url,mention_type,source'
