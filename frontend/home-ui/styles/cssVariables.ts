// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Theme} from '@mui/material/styles/createTheme'

export type CssVariableProps = {
  [key:string]:string | number
}

export function createCssVariables(vars: CssVariableProps) {
  if (vars) {
    const css:any={}
    const options = Object.keys(vars)
    options.forEach(key => {
      const item = vars[key]
      css[`--rsd-${key}`]= item
    })
    // debugger
    return {
      ':root': css
    }
  }
}

function traverseObject(palette: any, parent?: string) {
  const keys = Object.keys(palette)
  let vars: any = {}

  keys.forEach(key => {
    const item = palette[key]
    switch (typeof item) {
      case 'string':
      case 'number':
        // debugger
        let id = '--rsd'
        if (parent) {
          id += `-${parent}`
        }
        id += `-${key}`
        // addToObject(vars, id, item)
        vars[id] = item
        break
      case 'object':
        const children = traverseObject(item, key)
        vars = {
          ...vars,
          ...children
        }
        break
      case 'function':
      default:
      // skip thisone
    }
  })
  return vars
}

export function extractCssVariables(theme: Theme) {
  // console.log('getCssVarsFromTheme.theme...', theme)
  const vars = traverseObject(theme.palette)
  return {
    ':root': vars
  }
}
