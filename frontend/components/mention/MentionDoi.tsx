// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type MentionDoiProps = {
  url: string | null
  doi: string | null
  className?: string
}

export default function MentionDoi({url,doi,className}:MentionDoiProps) {
  if (url && doi) {
    return (
      <div className={className}>
        <a href={url} target="_blank" rel="noreferrer">
          DOI: {doi}
        </a>
      </div>
    )
  }
  if (doi) {
    return (
      <div className={className}>
        {doi}
      </div>
    )
  }
  return null
}
