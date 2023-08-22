// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export default async function getAnnouncement() {
  const url = getBaseUrl() + '/global_announcement'
  const resp = await fetch(url, {method: 'GET',})
  const json = await resp.json()
  if (json[0] && json[0].enabled) {
    return json[0].text
  } else {
      logger('getAnnouncement failed:')
      return null
  }
}
