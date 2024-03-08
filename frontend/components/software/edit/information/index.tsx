// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import useSoftwareContext from '../useSoftwareContext'
import EditSoftwareDescriptionForm from './EditSoftwareDescriptionForm'
import useSoftwareTable from './useSoftwareTable'

export default function EditSoftwareDescrptionPage() {
  const {token} = useSession()
  const {software:{slug}} = useSoftwareContext()
  const {editSoftware,loading} = useSoftwareTable({slug, token})

  // console.group('EditSoftwareDescrptionPage')
  // console.log('loading...', loading)
  // console.log('token...', token)
  // console.log('slug...', slug)
  // console.log('editSoftware...', editSoftware)
  // console.groupEnd()

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )
  // Load the form component after editSoftware is present
  // in order to loaded these values directly in the form (defaultValues)
  if (editSoftware) {
    return <EditSoftwareDescriptionForm data={editSoftware} />
  }

  return <ContentLoader />
}
