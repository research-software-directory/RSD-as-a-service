// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export const home_config = {
  button: {
    discover: {
      label: 'Discover Software',
      url: '/software?order=mention_cnt',
      target:'_self'
    },
    signUp: {
      label: 'Sign up to contribute',
      // MOVED to form
      // url: 'https://research-software-directory.github.io/documentation/getting-access.html',
      // target: '_blank'
    },
    register: {
      label: 'Register your organisation',
      // MOVED to form
      // url: 'mailto:rsd@esciencecenter.nl?subject=Register organisation',
      // target: '_blank'
    },
    demo: {
      label: 'Demo',
      url: '/documentation/users/online-demo/',
      target: '_blank'
    },
    docs: {
      label: 'Docs',
      url: '/documentation/',
      target: '_blank'
    },
    faq: {
      label: 'FAQ',
      url: '/documentation/users/faq/',
      target: '_blank'
    },
    team: {
      label: 'Our story',
      url: '/page/about',
      target: '_self'
    },
    github: {
      label: 'Join us on GitHub',
      url: 'https://github.com/research-software-directory/RSD-as-a-service',
      target: '_blank'
    },
    contact: {
      label: 'Contact us',
      url: 'mailto:rsd@esciencecenter.nl?subject=Question about RSD',
      target: '_blank'
    },
    news:{
      label: 'More news',
      url: '/news',
      target: '_self'
    }
  }
}

export const personalSignUp = {
  notification: [
    '* Required',
    'We will use your default email application to send an email to rsd@esciencecenter.nl. Please send us an email directly if this fails.'
  ],
  name: {
    label: 'Your name *'
  },
  affiliation: {
    label: 'Your affiliation *'
  },
  role: {
    label: 'Your professional role'
  },
  orcid: {
    label: 'Your ORCID'
  },
  description: {
    label: 'Any additional information you would like to share about your request, such as a description of the content you would like to contribute.',
  }
}

export const organisationSignUp = {
  notification: [
    '* Required',
    'We will use your default email application to send an email to rsd@esciencecenter.nl. Please send us an email directly if this fails.'
  ],
  name: {
    label: 'Name *'
  },
  organisation: {
    label: 'Organisation *'
  },
  role: {
    label: 'Professional role'
  },
  // rorId: {
  //   label: 'ROR id'
  // },
  description: {
    label: 'Any additional information you would like to share about your request such as a link to the website of your organisation.',
  }
}
