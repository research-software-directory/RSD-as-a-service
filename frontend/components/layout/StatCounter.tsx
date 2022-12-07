// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

export default function StatCounter({label,value}:{label:string,value:number|undefined}) {

  if (typeof value!=='undefined' && label){
    return (
      <div className="text-center">
        <div
          style={{
            fontSize: '3.5rem',
            fontWeight: '200',
            lineHeight: 1.25
          }}
        >
          {value}
        </div>
        <div>
          {label}
        </div>
      </div>
    )
  }
  // return nothing if values not provided
  return null
}
