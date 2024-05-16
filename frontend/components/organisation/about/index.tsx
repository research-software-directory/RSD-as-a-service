// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import ReactMarkdownWithSettings from '~/components/layout/ReactMarkdownWithSettings'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import useOrganisationContext from '../context/useOrganisationContext'

export function AboutPagePlaceholder() {
  const router = useRouter()
  function goToSettings() {
    router.push({
      query: {
        slug:router.query['slug'],
        page:'settings'
      }
    })
  }
  // this message is only shown to organisation maintainers
  return (
    <Alert severity="info" sx={{marginTop:'0.5rem'}}>
      <AlertTitle sx={{fontWeight: 500}}>About section not defined</AlertTitle>
      <p>
        The about section is not visible to visitors because it does not have any content.
      </p>
      <span>To activate the about section, add content to the about section <strong>
        <button onClick={goToSettings}>in the settings.</button>
      </strong>
      </span>
    </Alert>
  )
}

export default function AboutPage() {
  const {description} = useOrganisationContext()
  // if description is present we return markdown page
  if (description) {
    return (
      <BaseSurfaceRounded
        className="flex-1 flex justify-center mb-12 p-4"
        type="div"
      >
        <ReactMarkdownWithSettings
          className="pt-4"
          markdown={description}
        />
      </BaseSurfaceRounded>
    )
  }
  // if no description we return placeholder info
  return <AboutPagePlaceholder />
}
