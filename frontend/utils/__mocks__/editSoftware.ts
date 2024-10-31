// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {NewSoftwareItem} from '~/types/SoftwareTypes'

export async function addSoftware({software, token}:
  { software: NewSoftwareItem, token: string }) {
  // console.log('Mocked addSoftware...')
  return {
    status: 201,
    message: {
      software,
      token
    }
  }
}

export async function getSoftwareToEdit({slug, token, baseUrl}:
  { slug: string, token: string, baseUrl?: string }) {
  return {
    status: 200,
    message: {
      slug,
      token,
      baseUrl
    }
  }
}
