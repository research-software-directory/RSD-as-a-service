// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import EditSection from '~/components/layout/EditSection'
import ServiceInfoAlert from './ServiceInfoAlert'
import SoftwareRepoServices from './SoftwareRepoServices'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import PackageManagerServices from './PackageManagerServices'

export default function SoftwareServices() {

  return (
    <EditSection className="xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]">
      <div className="pt-4 pb-8">
        <EditSectionTitle
          title="Software repository"
          subtitle="Information is extracted from the repository using public api"
        />
        <SoftwareRepoServices />
        <div className="py-2"></div>
        <EditSectionTitle
          title="Package managers"
          subtitle="Information is extracted from package manager definitions using public api"
        />
        <PackageManagerServices />
      </div>
      <div className="pt-4 pb-8">
        <ServiceInfoAlert />
      </div>
    </EditSection>
  )
}
