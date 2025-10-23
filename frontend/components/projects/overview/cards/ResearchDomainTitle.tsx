// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import CardTitleMuted from '~/components/layout/CardTitleMuted'

export default function ResearchDomainTitle({domains=[]}:{domains: string[]}) {
  const mainDomain:string[] = []
  domains.forEach(domain => {
    if (domain.toUpperCase().startsWith('LS')===true &&
      mainDomain.includes('Life Sciences') === false) {
      mainDomain.push('Life Sciences')
    }
    if (domain.toUpperCase().startsWith('PE') === true &&
      mainDomain.includes('Physical Sciences and Engineering') === false) {
      mainDomain.push('Physical Sciences and Engineering')
    }
    if (domain.toUpperCase().startsWith('SH') === true &&
      mainDomain.includes('Social Sciences and Humanities') === false
    ) {
      mainDomain.push('Social Sciences and Humanities')
    }
  })

  const mainDomains = mainDomain.join(', ')

  return (
    <CardTitleMuted
      title={mainDomains}
      label={mainDomains}
    />
  )

}
