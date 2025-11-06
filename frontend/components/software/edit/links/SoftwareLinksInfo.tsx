// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {Fragment} from 'react'
import Alert from '@mui/material/Alert'
import {ReorderedCategories} from '~/components/category/useReorderedCategories'
import {config} from '~/components/software/edit/links/config'
import {CategoryEntry} from '~/types/Category'

type SoftwareLinksInfoProps = {
  readonly reorderedCategories: ReorderedCategories
}

export default function SoftwareLinksInfo({reorderedCategories}: SoftwareLinksInfoProps) {

  const helpForCategories = generateHelpOnCategories(reorderedCategories)

  return (
    <Alert
      severity="info"
    >
      On this page you can provide links and metadata to better describe your software. Some of this metadata can be imported automatically.

      <p className="py-2"><strong>Getting started URL</strong></p>
      <p >The getting started URL can be used to link to a webpage describing how to install and use the software. This link will be prominently shown on the top of the software page.</p>

      <p className="py-2"><strong>Software DOI</strong></p>
      <p>The Software DOI is a unique identifier for your software, similar to DOIs for publications or datasets. Using the Software DOI, the RSD can import metadata about the software such as contributors, keywords, and licenses. It also enables the RSD to find new versions of your software, provide citation data to visitors (in various formats such as BibTex, CodeMeta, JATS, RIS and CSL), and track who cites your software.</p>

      <p className="py-2">You can use <a href="https://help.zenodo.org/faq/#versioning" target='_blank'><u>Zenodo</u></a> to create a DOI for your software. Use the Validate DOI button check it the DOI is correct.</p>

      <p className="py-2"><strong>Licences</strong></p>
      <p>Here you can provide the license of your software, by selecting an existing Open Source license, specifying your own, or importing the license information from the Software DOI.</p>

      <p className="py-2"><strong>Keywords</strong></p>
      <p>Here you can provide keyword that describe your software, by selecting from existing keyword, adding your own, or importing the keywords from the Software DOI.</p>

      {helpForCategories.map(([headline, text]) => (
        <Fragment key={headline}>
          <p className="py-2"><strong>{headline}</strong></p>
          <p>{text}</p>
        </Fragment>
      ))}


    </Alert>
  )
}

function generateHelpOnCategories(reorderedCategories: ReorderedCategories) {
  const items = []

  for (const treeLevel of reorderedCategories.highlighted) {
    const category: CategoryEntry = treeLevel.getValue()
    if (category.properties.is_highlight && category.properties.description) {
      items.push([category.name, category.properties.description])
    }
  }
  if (reorderedCategories.general.length > 0) {
    items.push([config.categories.title, config.categories.help])
  }

  return items
}
