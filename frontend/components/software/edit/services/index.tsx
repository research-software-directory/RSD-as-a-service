// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import EditSection from '~/components/layout/EditSection'
import ServiceInfoAlert from './ServiceInfoAlert'
import SoftwareRepoServices from './SoftwareRepoServices'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import PackageManagerServices from './PackageManagerServices'
import {config} from './config'

export default function SoftwareServices() {

  return (
    <EditSection className="xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem]">
      <div className="pt-4 pb-8">
        <EditSectionTitle
          title={config.repository.title}
          subtitle={config.repository.subtitle}
        />
        <SoftwareRepoServices />
        <div className="py-2"></div>
        <EditSectionTitle
          title={config.package_managers.title}
          subtitle={config.package_managers.subtitle}
        />
        <PackageManagerServices />
      </div>
      <div className="pt-4 pb-8">
        <ServiceInfoAlert />
      </div>
    </EditSection>
  )
}
