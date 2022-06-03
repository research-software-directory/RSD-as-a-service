// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react'

import {Session} from '~/auth'
import EditSection from '~/components/layout/EditSection'
import EditMentionsProvider from './EditMentionsProvider'
import MentionByType from './MentionByType'
import FindSoftwareMention from './FindSoftwareMention'
import AddImpact from './AddMention'
import editSoftwareContext from '../editSoftwareContext'

export default function SoftwareMentions({session}:{session:Session}) {
  const {pageState} = useContext(editSoftwareContext)

  // console.group('ProjectImpact')
  // console.log('session...', session)
  // console.groupEnd()

  return (
    <EditMentionsProvider token={session.token} software={pageState.software.id}>
      <EditSection className='xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4 xl:pl-[3rem]">
          <MentionByType software={pageState.software.id ?? ''} token={session.token}/>
        </div>
        <div className="py-4">
          <FindSoftwareMention />
          <div className="py-4"></div>
          <AddImpact />
        </div>
      </EditSection>
    </EditMentionsProvider>
  )
}
