// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function removeOrganisationCategoriesFromProject(
  projectId: string,
  organisationId: string,
  token: string
){
  return {status:200}
}

export async function getCategoryListForProject(project_id: string, token?: string){
  const categories:Set<string> = new Set()
  return categories
}
