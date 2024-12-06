// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import CardTitleMuted from '~/components/layout/CardTitleMuted'

export default function SourceRsd({source,domain}:Readonly<{source?:string|null,domain?:string|null}>){

  if (!source) return null

  return (
    <CardTitleMuted
      title={domain ?? source}
      label={source}
    />
  )
}
