// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CategoriesForSoftware, CategoryForSoftwareIds,} from '~/types/SoftwareTypes'
import {CategoryPath} from '~/types/Category'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getSoftwareList({url,token}:{url:string,token?:string }){
  return []
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getSoftwareItem(slug:string|undefined, token?:string){
  return []
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getRepostoryInfoForSoftware(software: string | undefined, token?: string) {
  return []
}


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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getReleasesForSoftware(uuid:string,token?:string){
  return []
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getKeywordsForSoftware(uuid:string,frontend?:boolean,token?:string){
  return []
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getCategoriesForSoftware(software_id: string, token?: string): Promise<CategoriesForSoftware> {
  return []
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getCategoryForSoftwareIds(software_id: string, token?: string): Promise<CategoryForSoftwareIds> {
  return new Set()
}

export async function getAvailableCategories(): Promise<CategoryPath[]> {
  return []
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function addCategoryToSoftware(softwareId: string, categoryId: string, token: string) {
  return []
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteCategoryToSoftware(softwareId: string, categoryId: string, token: string) {
  return null
}


/**
 * LICENSE
 */

export type License = {
  id:string
  software:string
  license: string
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getLicenseForSoftware(uuid:string,frontend?:boolean,token?:string){
  return []
}

/**
 * Contributors and mentions counts
 */

export type ContributorMentionCount = {
  id: string
  contributor_cnt: number | null
  mention_cnt: number | null
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getContributorMentionCount(uuid: string,token?: string){
  return []
}

/**
 * REMOTE MARKDOWN FILE
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getRemoteMarkdown(url: string) {
  return []
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getRemoteMarkdownTest(url: string) {
  return []
}

// RELATED PROJECTS FOR SORFTWARE
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getRelatedProjectsForSoftware({software, token, frontend, approved=true}:
  { software: string, token?: string, frontend?: boolean, approved?:boolean }) {
  return []
}
