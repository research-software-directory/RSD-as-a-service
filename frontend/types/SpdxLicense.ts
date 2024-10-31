// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// Based on sample request
// https://raw.githubusercontent.com/spdx/license-list-data/master/json/licenses.json
// more info
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const licenseExample = {
  'reference': 'https://spdx.org/licenses/OLDAP-2.2.html',
  'isDeprecatedLicenseId': false,
  'detailsUrl': 'https://spdx.org/licenses/OLDAP-2.2.json',
  'referenceNumber': 15,
  'name': 'Open LDAP Public License v2.2',
  'licenseId': 'OLDAP-2.2',
  'seeAlso': [
    'http://www.openldap.org/devel/gitweb.cgi?p\u003dopenldap.git;a\u003dblob;f\u003dLICENSE;hb\u003d470b0c18ec67621c85881b2733057fecf4a1acc3'
  ],
  'isOsiApproved': false
}

export type SpdxLicense = typeof licenseExample
