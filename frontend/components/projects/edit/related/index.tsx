// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import EditSection from '~/components/layout/EditSection'
import RelatedSoftwareForProject from './RelatedSoftwareForProject'
import RelatedProjectsForProject from './RelatedProjectsForProject'

export default function RelatedProjectItems() {

  return (
    <>
      <EditSection className='xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4 xl:pl-[3rem]">
          <RelatedProjectsForProject />
        </div>
        <div className="py-4 min-w-[21rem] xl:my-0">
          <RelatedSoftwareForProject />
        </div>
      </EditSection>
    </>
  )
}
