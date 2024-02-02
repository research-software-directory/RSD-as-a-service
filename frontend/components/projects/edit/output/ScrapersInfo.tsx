// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

export default function ScrapersInfo() {
  return (
    <>
      <h3 className="pt-4 pb-2 text-lg">Scrapers</h3>
      <Alert
        severity="success"
      >
        RSD can automatically scrape all references to the publications using DOI. Scraped citations are shown in the citations section.
      </Alert>
    </>
  )
}
