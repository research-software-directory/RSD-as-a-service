// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export type Organisation = {
  name: string
  logo?:string
}

// NOTE! Because tests run in parallel you need
// to ensure organisation adding "collisions"
// eq. when 2 tests try to add same organisation to RSD
// so far using unique organisations on each test works best

export const mockSoftwareOrganisation = {
  chrome: [{
      name: 'Massachusetts Institute of Technology',
      logo: 'images/mit-logo.png'
    },{
      name: 'GBS Leiden',
      logo: 'images/gbs-leiden-logo.png'
    }],
  chromium: [{
      name: 'Vrije Universiteit Amsterdam',
      logo: 'images/vu-logo.svg'
    },{
      name: 'Eindhoven University of Technology',
      logo: 'images/tu-delft-logo.jpg'
  }],
  firefox: [{
      name: 'Massachusetts Institute of Technology',
      logo: 'images/mit-logo.png'
    },{
      name: 'GBS Leiden',
      logo: 'images/gbs-leiden-logo.png'
    }
  ],
  msedge: [{
      name: 'Tottori University',
      logo: 'images/tattori-logo-eng.png'
    },{
      name: 'Gemeente Den Haag'
  }],
  webkit: [{
      name: 'Erasmus University Rotterdam',
      logo: 'images/erasmus_logo.png'
    },{
      name: 'GGD Rotterdam-Rijnmond'
  }]
}

// we need to use different organisations
// to avoid collision of two proceses
// creating new organisation at the same time
export const mockProjectOrganisation = {
  chrome: [{
    name: 'Vrije Universiteit Amsterdam',
    logo: 'images/vu-logo.svg'
  }, {
    name: 'Eindhoven University of Technology',
    logo: 'images/tu-delft-logo.jpg'
  }],
  chromium: [{
    name: 'Netherlands eScience Center',
    logo: 'images/nlescience.png'
  }, {
    name: 'Dutch Research Council',
    logo: 'images/nwo-logo.svg'
  }],
  msedge: [{
    name: 'Massachusetts Institute of Technology',
    logo: 'images/mit-logo.png'
  }, {
    name: 'GBS Leiden',
    logo: 'images/gbs-leiden-logo.png'
  }
  ],
  firefox: [{
    name: 'Gemeente Leiden'
  }, {
    name: 'Gemeente Amsterdam'
  }],
  webkit: [{
    name: 'Philips'
  }, {
    name: 'Microsoft'
  }]
}

export const fundingOrganisation = {
  chrome: [
    // 'Netherlands eScience Center',
    'https://ror.org/00rbjv475',
    'Dutch Research Council'
  ],
  chromium: [
    'Vrije Universiteit Amsterdam',
    'Eindhoven University of Technology'
  ],
  firefox: [
    'University of Twente',
    'Tottori University'
  ],
  msedge: [
    'Gemeente Leiden',
    'Gemeente Den Haag'
  ],
  webkit: [
    'Erasmus University Rotterdam',
    'GGD Rotterdam-Rijnmond'
  ]
}
