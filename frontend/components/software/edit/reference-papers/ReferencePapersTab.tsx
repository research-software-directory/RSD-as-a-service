// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import EditSection from '~/components/layout/EditSection'
import FindReferencePaper from './FindReferencePaper'
import ReferencePapersList from './ReferencePapersList'

export default function ReferencePapersTab() {
  return (
    <EditSection className="xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]">
      <div className="pt-4 pb-8">
        <ReferencePapersList />
      </div>
      <div className="pt-4 pb-8">
        <FindReferencePaper />
      </div>
    </EditSection>
  )
}
