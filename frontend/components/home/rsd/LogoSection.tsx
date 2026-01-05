// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import LogoEscience from '~/assets/logos/LogoEscience.svg'
import LogoHelmholtz from '~/assets/logos/LogoHelmholtz.svg'
import LogoUMC from '~/assets/logos/LogoUMC.svg'
import LogoUU from '~/assets/logos/LogoUU.svg'
import LogoLeiden from '~/assets/logos/LogoLeiden.svg'

export default function LogoSection() {
  return (
    <div
      id="partners"
      className="w-full max-w-(--breakpoint-xl) mx-auto mt-10 p-5 md:p-10">
      <div id="whyrsd" className="text-xl opacity-50">
        Partners using the Research Software Directory
      </div>
      <div
        className="flex gap-10 w-full max-w-(--breakpoint-xl) flex-wrap mt-6 p-3 md:p-10 items-center opacity-30">
        <LogoEscience className="max-w-[160px]" />
        <LogoHelmholtz className="max-w-[130px]" />
        <LogoUMC className="max-w-[200px]" />
        <LogoUU className="max-w-[220px]" />
        <LogoLeiden className="max-w-[220px]" />
      </div>
    </div>
  )
}
