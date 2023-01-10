// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {Suspense} from 'react'

import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import RelatedSoftwareForSoftware from './RelatedSoftwareForSoftware'
import RelatedProjectsForProject from './RelatedProjectsForSoftware'

export default function RelatedSoftwareItems() {

  return (
    // Not sure if Suspense works in this context
    <Suspense fallback={<ContentLoader />}>
      <EditSection className='xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4 xl:pl-[3rem]">
          <RelatedSoftwareForSoftware />
        </div>
        <div className="py-4 xl:my-0">
          <RelatedProjectsForProject />
        </div>
      </EditSection>
    </Suspense>
  )
}
