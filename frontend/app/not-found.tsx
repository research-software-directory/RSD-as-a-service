// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Metadata} from 'next'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import {app} from '~/config/app'

export const metadata: Metadata = {
  title: `Not Found | ${app.title}`,
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <PageErrorMessage
      status={404}
      message='This page could not be found.'
    />
  )
}
