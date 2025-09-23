// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {PackageManager} from './apiPackageManager'

export type PackageManagerSettings = {
  name: string,
  icon: string | null,
  hostname: string[],
  services: string[]
}

export const packageManagerSettings = {
  anaconda: {
    name: 'Anaconda',
    icon: '/images/anaconda-logo-96.svg',
    hostname: ['anaconda.org'],
    services: ['reverse_dependency_count']
  },
  bioconductor: {
    name: 'Bioconductor',
    icon: '/images/bioconductor_logo_spot.svg',
    hostname: ['bioconductor.org', 'www.bioconductor.org'],
    services: []
  },
  cran: {
    name: 'CRAN',
    icon: '/images/cran-r-logo.svg',
    hostname: ['cran.r-project.org'],
    services: ['reverse_dependency_count']
  },
  crates: {
    name: 'Crates.io',
    icon: '/images/rust-cargo-logo.png',
    hostname: ['crates.io'],
    services: ['reverse_dependency_count']
  },
  chocolatey: {
    name: 'Chocolatey',
    icon: '/images/chocolatey-logo.svg',
    hostname: ['community.chocolatey.org'],
    services: []
  },
  debian: {
    name: 'Debian',
    icon: '/images/debian-logo.svg',
    hostname: ['packages.debian.org'],
    services: []
  },
  dockerhub: {
    name: 'Dockerhub',
    icon: '/images/dockerhub-logo.webp',
    hostname: ['hub.docker.com'],
    services: ['download_count']
  },
  fourtu: {
    name: '4TU.ResearchData',
    icon: '/images/4tu-logo.png',
    hostname: ['data.4tu.nl'],
    services: []
  },
  ghcr: {
    name: 'Github Container Registry',
    // NOTE! shared Github logo is used
    icon: '/images/github-logo.svg',
    hostname: ['ghcr.io'],
    services: []
  },
  github: {
    name: 'Github',
    // NOTE! shared Github logo is used
    icon: '/images/github-logo.svg',
    hostname: ['github.com'],
    services: []
  },
  gitlab: {
    name: 'Gitlab',
    // NOTE! shared GitLab logo is used
    icon: '/images/gitlab-icon-rgb.svg',
    hostname: ['gitlab.com', 'registry.gitlab.com'],
    services: []
  },
  golang: {
    name: 'Golang',
    icon: '/images/go-logo-blue.svg',
    hostname: ['pkg.go.dev'],
    services: ['reverse_dependency_count']
  },
  julia: {
    name: 'Julia',
    icon: '/images/julia-logo.svg',
    hostname: ['github.com/JuliaRegistries/General/', '.jl.git'],
    services: ['download_count']
  },
  maven: {
    name: 'Maven',
    icon: '/images/apache-maven-logo.svg',
    hostname: ['mvnrepository.com'],
    services: ['reverse_dependency_count']
  },
  npm: {
    name: 'NPM',
    icon: '/images/npm-logo-64.png',
    hostname: ['www.npmjs.com', 'npmjs.com'],
    services: ['reverse_dependency_count']
  },
  pixi: {
    name: 'Pixi',
    icon: '/images/pixi-logo.png',
    hostname: ['prefix.dev'],
    services: ['download_count']
  },
  pypi: {
    name: 'PyPi',
    icon: '/images/pypi-logo.svg',
    hostname: ['pypi.org'],
    services: ['reverse_dependency_count']
  },
  sonatype: {
    name: 'Sonatype',
    icon: '/images/sonatype-logo.svg',
    hostname: ['central.sonatype.com'],
    services: ['reverse_dependency_count']
  },
  snapcraft: {
    name: 'Snapcraft',
    icon: '/images/snapcraft-logo.svg',
    hostname: ['snapcraft.io'],
    services: []
  },
  other: {
    name: 'Other',
    icon: null,
    hostname: [],
    services: []
  }
}

export type PackageManagerTypes = keyof typeof packageManagerSettings

export type PacManSvcProps={
  name: string,
  desc: string,
  props:{
    value: keyof PackageManager | string[],
    scraped_at: keyof PackageManager,
    last_error: keyof PackageManager,
    url: keyof PackageManager
    disable_reason: keyof PackageManager
  },
  dbprops?: string[]
}

export const pacManServiceList={
  download_count:{
    name: 'Downloads',
    desc: 'Number of downloads of the package, extracted from the package manager api.',
    props:{
      value: 'download_count',
      scraped_at:'download_count_scraped_at',
      last_error:'download_count_last_error',
      disable_reason: 'download_count_scraping_disabled_reason',
      url:'url'
    },
    dbprops: ['download_count','download_count_scraped_at']
  },
  reverse_dependency_count:{
    name: 'Reverse dependencies',
    desc: 'Number of packages depending on this software, extracted from the package manager api.',
    props:{
      value: 'reverse_dependency_count',
      scraped_at:'reverse_dependency_count_scraped_at',
      last_error:'reverse_dependency_count_last_error',
      disable_reason: 'reverse_dependency_count_scraping_disabled_reason',
      url:'url'
    },
    dbprops: ['reverse_dependency_count','reverse_dependency_count_scraped_at']
  }
}

export type PackageManagerServiceKey = keyof typeof pacManServiceList

export const cfg = {
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
    download_count_last_error:{
      label: 'Download count last error',
      help: (service:boolean)=> {
        if (service===false){
          return 'Download count service is not available.'
        }
        return 'Last error logged by RSD service'
      },
      validation: {
        maxLength: {
          value: 500,
          message: 'Maximum length is 500'
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
    reverse_dependency_count_last_error:{
      label: 'Reverse dependency last error',
      help: (service:boolean)=> {
        if (service===false){
          return 'Reverse dependency count service is not available.'
        }
        return 'Last error logged by RSD service'
      },
      validation: {
        maxLength: {
          value: 500,
          message: 'Maximum length is 500'
        }
      }
    },
    package_manager:{
      label: 'Platform',
      help: 'Select the platform',
      validation: {
        required: 'The platform is required',
      }
    }
  }
}
