// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Returns items not found in the reference list. This function
 * is used to determine which items should be deleted after editing.
 * @param param0
 * @returns items not in reference list
 */
export function itemsNotInReferenceList<T>({list, referenceList, key}:
  {list: T[], referenceList: T[], key: keyof T}) {
  if (list.length > 0) {
    // items not present in refrence list should be removed from db
    const itemsNotInReferenceList = list.filter(item => {
      const lId = item[key]
      // if item cannot be found in reference
      return !referenceList.some(item => {
        const rId = item[key]
        // compare inital item with items in saveList
        return lId === rId
      })
    })

    return itemsNotInReferenceList
  }
  return []
}
