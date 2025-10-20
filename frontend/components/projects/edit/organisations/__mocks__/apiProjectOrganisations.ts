// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */

export const removeOrganisationCategoriesFromProject=jest.fn(async(
  projectId: string,
  organisationId: string,
  token: string
)=>{
  return {status:200}
})

export const getCategoryListForProject=jest.fn(async(project_id: string, token?: string)=>{
  const categories:Set<string> = new Set()
  return categories
})
