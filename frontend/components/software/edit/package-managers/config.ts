// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
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
          value: /^https?:\/\/.+\..+/,
          message: 'URL should start with http(s):// and use at least one dot (.)'
        }
      }
    },
    download_scraping_disabled:{
      label: 'Why download count scraping is disabled?',
      help: (service:boolean)=> {
        if (service===false){
          return 'Download count scraping service is not available.'
        }
        return 'Type the reason for disabling download count scraper.'
      },
      validation: {
        maxLength: {
          value: 200,
          message: 'Maximum length is 200'
        }
      }
    },
    reverse_dependency_scraping_disabled:{
      label: 'Why reverse dependency count scraping is disabled?',
      help: (service:boolean)=> {
        if (service===false){
          return 'Reverse dependency count service is not available.'
        }
        return 'Type the reason for disabling reverse dependency count scraper.'
      },
      validation: {
        maxLength: {
          value: 200,
          message: 'Maximum length is 200'
        }
      }
    },
    package_manager:{
      label: 'Detected platform',
      help: 'The platform is detected from the url. Only RSD admin can change this value.',
    }
  }
}
