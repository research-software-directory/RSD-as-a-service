// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import useSoftwareContext from '../useSoftwareContext'
import useSoftwareToEdit from './useSoftwareToEdit'
import SoftwareInformationForm from './SoftwareInformationForm'

export default function SoftwareInformationPage() {
  const {token} = useSession()
  const {software:{slug}} = useSoftwareContext()
  const {editSoftware,loading} = useSoftwareToEdit({slug, token})

  // console.group('SoftwareInformationPage')
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
    return (
      <SoftwareInformationForm editSoftware={editSoftware} />
    )
  }

  return <ContentLoader />
}
