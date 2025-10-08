// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

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
