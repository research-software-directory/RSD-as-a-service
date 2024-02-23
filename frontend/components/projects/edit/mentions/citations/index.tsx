// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import EditSection from '~/components/layout/EditSection'
import ContentLoader from '~/components/layout/ContentLoader'
import CitationsByType from '~/components/software/edit/mentions/citations/CitationsByType'
import {useProjectMentionContext} from '../ProjectMentionContext'
import ProjectCitationInfo from './ProjectCitationInfo'

export default function ProjectCitationsTab() {
  /**
   * Get loading state and loaded mention items from software mention context.
   */
  const {loading,citation} = useProjectMentionContext()

  // console.group('ProjectCitationsTab')
  // console.log('loading...', loading)
  // console.log('citation...', citation)
  // console.groupEnd()

  return (
    <EditSection className='pt-4 pb-8'>
      <ProjectCitationInfo />
      <div className="py-2" />
      {/* render citations by type */}
      {loading ?
        <ContentLoader />
        :
        <CitationsByType mentions={citation} />
      }
    </EditSection>
  )
}
