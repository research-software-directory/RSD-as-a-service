// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function VerifyGithubUrl({url}:{url: string}) {
  if ((url.startsWith('https://github.com/') || url.startsWith('http://github.com/'))
    && !url.match('^https?://github\\.com/([^\\s/]+)/([^\\s/]+)/?$')) {
    return <span className="text-warning">This does not seem to be the root of a single GitHub repository, are you
      sure?</span>
  }
  return null
}
