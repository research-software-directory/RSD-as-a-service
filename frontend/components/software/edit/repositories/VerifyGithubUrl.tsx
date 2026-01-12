// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function VerifyGithubUrl({url}:Readonly<{url: string}>) {
  if ((url.startsWith('https://github.com/') || url.startsWith('http://github.com/')) // NOSONAR
    && !url.match('^https?://github\\.com/([^\\s/]+)/([^\\s/]+)/?$')) { // NOSONAR
    return <span className="text-warning">This does not seem to be the root of a single GitHub repository, are you
      sure?</span>
  }
  return 'Provide url to source code repository'
}
