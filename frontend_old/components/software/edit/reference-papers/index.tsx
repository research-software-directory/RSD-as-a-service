// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {TabCountsProvider} from './TabCountsProvider'
import PageTabs from './PageTabs'

export default function ReferencePapers() {
  return (
    <div className='flex-1 pt-4 pb-12 overflow-hidden'>
      <TabCountsProvider>
        <PageTabs />
      </TabCountsProvider>
    </div>
  )
}
