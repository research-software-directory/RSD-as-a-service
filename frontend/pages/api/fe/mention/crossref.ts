// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {NextApiRequest, NextApiResponse} from 'next'
import {getCrossrefItemByDoi} from '~/utils/getCrossref'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse) {
  const doi = req.query.doi

  if (doi === undefined || Array.isArray(doi)) {
    res.status(400)
    res.json({status: 400, message: 'please provide a valid DOI as doi query parameter'})
  }

  try {
    const doiResponse = await getCrossrefItemByDoi(doi as string)
    res.status(doiResponse.status)
    res.json(doiResponse)
  } catch {
    res.status(500)
    res.json({status: 500, message: 'Unknown error'})
  }
}
