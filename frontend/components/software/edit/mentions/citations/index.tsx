// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import EditSection from '~/components/layout/EditSection'
import ContentLoader from '~/components/layout/ContentLoader'
import {useSoftwareMentionContext} from '../SoftwareMentionContext'
import CitationsByType from './CitationsByType'
import SoftwareCitationInfo from './SoftwareCitationInfo'

export default function SoftwareCitationsTab() {
  /**
   * Get loading state and loaded mention items from software mention context.
   */
  const {loading,citations} = useSoftwareMentionContext()

  // console.group('SoftwareCitationsTab')
  // console.log('loading...', loading)
  // console.log('citations...', citations)
  // console.groupEnd()

  return (
    <EditSection className='pt-4 pb-8'>
      <SoftwareCitationInfo />
      <div className="py-2" />
      {/* render citations by type */}
      {loading ?
        <ContentLoader />
        :
        <CitationsByType mentions={citations} />
      }
    </EditSection>
  )
}
