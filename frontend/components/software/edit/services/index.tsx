// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import EditSection from '~/components/layout/EditSection'
import ServiceInfoAlert from './ServiceInfoAlert'
import SoftwareRepoServices from './SoftwareRepoServices'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import PackageManagerServices from './PackageManagerServices'
import {cfg} from './config'

export default function SoftwareServices() {

  return (
    <EditSection className="xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem]">
      <div className="pt-4 pb-8">
        <EditSectionTitle
          title={cfg.repository.title}
          subtitle={cfg.repository.subtitle}
        />
        <SoftwareRepoServices />
        <div className="py-2"></div>
        <EditSectionTitle
          title={cfg.package_managers.title}
          subtitle={cfg.package_managers.subtitle}
        />
        <PackageManagerServices />
      </div>
      <div className="pt-4 pb-8">
        <ServiceInfoAlert />
      </div>
    </EditSection>
  )
}
