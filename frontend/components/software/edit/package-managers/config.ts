// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

export const config = {
  title: 'Package managers',
  modal: {
    url: {
      label: 'URL',
      help: 'Provide link to your package.',
      validation: {
        required: 'Link to your software package is required',
        maxLength: {
          value: 200,
          message: 'Maximum length is 200'
        },
        pattern: {
          value: /^https?:\/\/\S+$/,
          message: 'URL must start with http(s):// and cannot include white spaces'
        }
      }
    },
    download_scraping_disabled:{
      label: 'Reason to disable download count service',
      help: (service:boolean)=> {
        if (service===false){
          return 'Download count service is not available.'
        }
        return 'Explain why download count scraper is disabled'
      },
      validation: {
        maxLength: {
          value: 200,
          message: 'Maximum length is 200'
        }
      }
    },
    reverse_dependency_scraping_disabled:{
      label: 'Reason to disable reverse dependency count service',
      help: (service:boolean)=> {
        if (service===false){
          return 'Reverse dependency count service is not available.'
        }
        return 'Explain why reverse dependency count scraper is disabled'
      },
      validation: {
        maxLength: {
          value: 200,
          message: 'Maximum length is 200'
        }
      }
    },
    package_manager:{
      label: 'Platform',
      help: 'The platform is detected from the url. Only RSD admin can change this value.',
    }
  }
}
