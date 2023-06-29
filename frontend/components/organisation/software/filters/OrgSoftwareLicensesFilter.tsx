// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import useQueryChange from '~/components/organisation/projects/useQueryChange'
import LicensesFilter, {LicensesFilterOption} from '~/components/filter/LicensesFilter'


type LicensesFilterProps = {
  licenses: string[],
  licensesList: LicensesFilterOption[],
}

export default function SoftwareLicensesFilter({licenses, licensesList}: LicensesFilterProps) {
  const {handleQueryChange} = useQueryChange()

  return (
    <div>
      <LicensesFilter
        licenses={licenses}
        licensesList={licensesList}
        handleQueryChange={handleQueryChange}
      />
    </div>
  )
}
