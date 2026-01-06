// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Returns items not found in the reference list based on single key (object prop).
 * @param param0
 * @returns items not in reference list
 */
export function itemsNotInReferenceList<T>({list, referenceList, key}:
{list: T[], referenceList: T[], key: keyof T}) {
  if (list.length > 0) {
    // items not present in reference list should be removed from db
    const notInReferenceList = list.filter(item => {
      const lId = item[key]
      // if item cannot be found in reference
      return !referenceList.some(item => {
        const rId = item[key]
        // compare initial item with items in saveList
        return lId === rId
      })
    })

    return notInReferenceList
  }
  return []
}

/**
 * Returns items not found in the reference list using multiple keys (object properties)
 * @param param0
 * @returns items not in reference list
 */
export function itemsNotInListByKeys<T>({list, referenceList, keys}:
{list: T[], referenceList: T[], keys: unknown[]}) {
  if (list.length > 0) {
    // items not present in reference list should be removed from db
    const notInReferenceList = list.filter(item => {
      // generate item from the list
      const lId = keys.reduce((agg:string,key)=>{
        // add value of the property if exists
        if (item[key as keyof T]){
          agg+= item[key as keyof T]
        }
        // make to lower case and remove spaces
        return agg.toLowerCase().replaceAll(' ','')
      },'')

      // const lId = item[key]
      // if item cannot be found in reference
      return !referenceList.some(item => {
        // generate item from the reference list
        const rId = keys.reduce((agg:string,key)=>{
          // add value of the property if exists
          if (item[key as keyof T]){
            agg+= item[key as keyof T]
          }
          // make to lower case and remove spaces
          return agg.toLowerCase().replaceAll(' ','')
        },'')
        // compare initial item with items in referenceList
        return lId === rId
      })
    })
    return notInReferenceList
  }
  return []
}
