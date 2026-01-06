// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @next/next/no-html-link-for-pages */

import Alert from '@mui/material/Alert'
import useRsdSettings from '~/config/useRsdSettings'

export default function SoftwareHighlightInfo() {
  const {host} = useRsdSettings()
  return (
    <Alert
      severity="info"
    >
      <p className="py-2"><strong>{host.software_highlights?.title}</strong></p>
      <p>In this section you can select software items for the highlights.
        Selected items are shown in the Carousel on the <a href="/software">software overview</a> page and on <a href="/spotlights?order=position">separate page</a>.
      </p>
      <p className="py-2"><strong>Carousel</strong></p>
      <p>The limited number of the items ({host?.software_highlights?.limit ?? 3}) is shown in the carousel.
        The amount of items to show in the carousel is defined in settings.json</p>
      <p className="py-2"><strong>Order</strong></p>
      <p>
        The items are shown in the order displayed on this page. You can drag the item to change its position and the order.
      </p>
    </Alert>
  )
}
