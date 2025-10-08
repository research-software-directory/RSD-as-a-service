// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Point} from './SingleLineChart'

export type Data = {
  [key:string]:number
}

function formatUnixDateData(data: Data) {
  if (typeof data === 'undefined' || data === null) {
    return {
      lineData: [],
      lastUpdateInMs: 0
    }
  }
  const keys = Object.keys(data)
  const lineData: Point[] = []
  let lastUpdateInMs:number|undefined

  keys.forEach(key => {
    const point = data[key]
    lineData.push({
      x: Number.parseInt(key) * 1000,
      y: point
    })
    // mark as last update if > 0
    if (point > 0) lastUpdateInMs = Number.parseInt(key) * 1000
  })

  return {
    lineData,
    lastUpdateInMs
  }
}

export function prepareDataForSoftwarePage(data: Data) {
  // console.log('prepareDataForSoftwarePage...',data)
  // format unix time in seconds to ms for js
  const {lineData,lastUpdateInMs} = formatUnixDateData(data)
  // calculate total number of commits
  const totalCountY:number = lineData.reduce((acc: any, point) => {
    return acc+=point.y
  }, 0)
  // extract last commit date
  const lastCommitDate = lastUpdateInMs ? new Date(lastUpdateInMs) : undefined
  // return this stats
  return {
    lineData,
    totalCountY,
    lastCommitDate
  }
}
