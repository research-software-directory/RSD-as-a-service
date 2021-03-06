// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function StatCounter({label,value}:{label:string,value:number|undefined}) {

  if (typeof value!=='undefined' && label){
    return (
      <div className="px-4 text-center">
        <div className=" text-5xl font-light">{value}</div>
        <div className="">{label}</div>
      </div>
    )
  }
  // return nothing if values not provided
  return null
}
