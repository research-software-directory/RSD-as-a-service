// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Theme configuration
 * It supports loading MUI themes during the runtime.
 * It requires colors and typography configuration.
 * To add theme:
 * 1. Copy files from ./rsd to new folder of your choice.
 * 2. Adapt values in copied files to reflect your theme.
 * 3. Extend the switch statement in getThemeConfig method to return new theme definitions.
 * 4. Extend the typescript type RsdThemeHost in ./RsdThemeOptionsContext.tsx file
 */


const rsdDefault = require('./rsd/default')
const rsdDark = require('./rsd/dark')

const helmholtzDefault = require('./helmholtz/default')
const helmholtzDark = require('./helmholtz/dark')

const nlescDefault = require('./nlesc/default')
const nlescDark = require('./nlesc/dark')

function getThemeConfig({host='default',mode='default'}){
  // console.group('getThemeConfig')
  // console.log('host...', host)
  // console.log('mode...', mode)
  // console.groupEnd()
  switch (host.toLowerCase()) {
    case 'helmholtz':
      if (mode === 'dark') return helmholtzDark
      return helmholtzDefault
    case 'nlesc':
      if (mode === 'dark') return nlescDark
      return nlescDefault
    default:
      // rsd is default theme
      if (mode==='dark') return rsdDark
      return rsdDefault
  }
}

module.exports=getThemeConfig
