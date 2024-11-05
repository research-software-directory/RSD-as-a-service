// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from './logger'

export function getPropsFromObject(data: any, props: string[], useNull: boolean = true) {
  try {
    const newData:any = {}
    props.forEach((prop:any) => {
      if (data.hasOwnProperty(prop)) {
        if (useNull && data[prop] === '') {
          newData[prop] = null
        } else {
          newData[prop] = data[prop]
        }
      } else if (useNull===true) {
        newData[prop]=null
      } else {
        logger(`Property [${prop}] not present in data object`, 'warn')
        return newData[prop] = undefined
      }
    })
    return newData
  } catch (e:any) {
    logger(`getPropsFromObject: ${e.message}`,'error')
    return {}
  }
}
