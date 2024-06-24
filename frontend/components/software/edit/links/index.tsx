// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import useSoftwareContext from '../useSoftwareContext'
import useSoftwareToEdit from './useSoftwareToEdit'
import EditSoftwareMetadataForm from './EditSoftwareMetadataForm'

export default function EditSoftwareDescriptionPage() {
  const {token} = useSession()
  const {software:{slug}} = useSoftwareContext()
  const {editSoftware,loading} = useSoftwareToEdit({slug, token})

  // console.group('EditSoftwareDescriptionPage')
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
  // in order to load these values directly in the form (defaultValues)
  if (editSoftware) {
    return <EditSoftwareMetadataForm data={editSoftware} />
  }

  return <ContentLoader />
}
