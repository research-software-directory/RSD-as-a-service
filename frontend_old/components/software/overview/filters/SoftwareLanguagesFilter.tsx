// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import useSoftwareOverviewParams from '../useSoftwareOverviewParams'
import ProgrammingLanguagesFilter, {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'

type ProgrammingLanguagesFilterProps = {
  prog_lang: string[],
  languagesList: LanguagesFilterOption[]
}

export default function SoftwareLanguagesFilter({prog_lang, languagesList}: ProgrammingLanguagesFilterProps) {
  const {handleQueryChange} = useSoftwareOverviewParams()

  return (
    <div>
      <ProgrammingLanguagesFilter
        prog_lang={prog_lang}
        languagesList={languagesList}
        handleQueryChange={handleQueryChange}
      />
    </div>
  )
}
