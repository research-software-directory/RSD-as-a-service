// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import EditSection from '~/components/layout/EditSection'
import EditMentionsProvider from './EditMentionsProvider'
import MentionByType from './MentionByType'
import FindSoftwareMention from './FindSoftwareMention'
import AddMention from './AddMention'
import useSoftwareContext from '../useSoftwareContext'

export default function SoftwareMentions() {
  const {token} = useSession()
  const {software} = useSoftwareContext()

  // console.group('ProjectImpact')
  // console.log('session...', session)
  // console.groupEnd()

  return (
    <EditMentionsProvider token={token} software={software.id}>
      <EditSection className='xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]'>
        <div className="pt-4 pb-8 xl:pl-[3rem]">
          <MentionByType software={software.id ?? ''} token={token}/>
        </div>
        <div className="pt-4 pb-8">
          <FindSoftwareMention />
          <div className="py-4"></div>
          <AddMention />
          <div className="py-4"></div>
        </div>
      </EditSection>
    </EditMentionsProvider>
  )
}
