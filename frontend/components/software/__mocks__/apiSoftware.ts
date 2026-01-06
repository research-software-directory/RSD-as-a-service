// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */

import {CategoriesForSoftware, CategoryForSoftwareIds,} from '~/types/SoftwareTypes'
import {CategoryPath} from '~/types/Category'


export const getSoftwareList=jest.fn(async({url,token}:{url:string,token?:string})=>{
  return []
})

export const getSoftwareItem=jest.fn(async(slug:string|undefined, token?:string)=>{
  return []
})

export const getRepostoryInfoForSoftware=jest.fn(async(software: string | undefined, token?: string)=>{
  return []
})


/**
 * CITATIONS
 * @param uuid as software_id
 * @returns SoftwareVersion[] | null
 */

export type SoftwareVersion = {
  doi: string,
  version: string,
  doi_registration_date: string
}

export const getReleasesForSoftware=jest.fn(async(uuid:string,token?:string)=>{
  return []
})

export const getKeywordsForSoftware=jest.fn(async(uuid:string,frontend?:boolean,token?:string)=>{
  return []
})

export const getCategoriesForSoftware=jest.fn(async(software_id: string, token?: string): Promise<CategoriesForSoftware>=>{
  return []
})

export const getCategoryForSoftwareIds=jest.fn(async(software_id: string, token?: string): Promise<CategoryForSoftwareIds>=>{
  return new Set()
})

export const getAvailableCategories=jest.fn(async(): Promise<CategoryPath[]>=>{
  return []
})

export const addCategoryToSoftware=jest.fn(async(softwareId: string, categoryId: string, token: string)=>{
  return []
})

export const deleteCategoryToSoftware=jest.fn(async(softwareId: string, categoryId: string, token: string)=>{
  return null
})


/**
 * LICENSE
 */
export type License = {
  id:string
  software:string
  license: string
}

export const getLicenseForSoftware=jest.fn(async(uuid:string,frontend?:boolean,token?:string)=>{
  return []
})

/**
 * Contributors and mentions counts
 */

export type ContributorMentionCount = {
  id: string
  contributor_cnt: number | null
  mention_cnt: number | null
}

export const getContributorMentionCount=jest.fn(async(uuid: string,token?: string)=>{
  return []
})

/**
 * REMOTE MARKDOWN FILE
*/
export const getRemoteMarkdown=jest.fn(async(url: string)=>{
  return []
})

export const getRemoteMarkdownTest=jest.fn(async(url: string)=>{
  return []
})

// RELATED PROJECTS FOR SORFTWARE
export const getRelatedProjectsForSoftware=jest.fn(async({software, token, frontend, approved=true}:
{software: string, token?: string, frontend?: boolean, approved?:boolean})=>{
  return []
})
