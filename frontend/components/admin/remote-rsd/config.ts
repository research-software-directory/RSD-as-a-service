// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {isProperUrl} from '~/utils/fetchHelpers'

async function isValidUrl(url:string){
  // validate url syntax first
  if (isProperUrl(url)===false){
    return 'Invalid url. Please improve your input'
  }
  return true
}

const config = {
  modalTitle:'Remote RSD',
  label: {
    label: 'Name',
    help: 'Remote RSD name. From v3 remote suggests the name.',
    // react-hook-form validation rules
    validation: {
      required: 'Name is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 50, message: 'Maximum length is 50'},
    }
  },
  domain: {
    label: 'Remote RSD homepage',
    help: 'URL to remote RSD homepage (eq. https://research-software-directory.org)',
    validation: {
      required: 'Valid URL is required.',
      // we do not show error message for this one, we use only maxLength value
      maxLength: {value: 200, message: 'Maximum length is 200'},
      validate: isValidUrl
    }
  },
  active: {
    label: 'Active',
    help: 'Include this remote RSD in software search',
    validation: {
      required: 'Active flag is required.',
    }
  },
  scrape_interval_minutes: {
    label: 'Update interval (in minutes)',
    help: 'How often to pull the data?',
    validation: {
      required: 'Update interval is required',
      min:{
        value: 5,
        message: 'Minimum value is 5 minutes'
      }
    }
  },
}

export default config
