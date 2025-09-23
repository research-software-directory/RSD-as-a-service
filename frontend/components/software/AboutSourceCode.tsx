// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {RepositoryForSoftware} from './edit/repositories/apiRepositories'
import RepositoryIcon from './edit/repositories/RepositoryIcon'

type AboutSourceCodeProps = Readonly<{
  repositories: RepositoryForSoftware[]
}>

export default function AboutSourceCode({repositories}: AboutSourceCodeProps) {
  const code = '</>'

  // do not show section if no repos
  if (repositories.length===0) return null

  function getIcon(repository:RepositoryForSoftware) {
    if (repository===null) return (<i>Not specified</i>)
    // abort if no info
    return (
      <a key={repository.url} href={repository.url ?? ''}
        title={repository.url ?? ''} target="_blank" rel="noreferrer"
        className="hover:text-base-content"
      >
        <RepositoryIcon platform={repository.code_platform} />
      </a>
    )
  }

  return (
    <div>
      <div className="pb-2">
        <span className="font-bold text-primary">{code}</span>
        <span className="text-primary pl-2">Source code</span>
      </div>
      <div className="flex flex-wrap items-end gap-4 py-1">
        {repositories.map(repo=>{
          return getIcon(repo)
        })}
      </div>
    </div>
  )
}
