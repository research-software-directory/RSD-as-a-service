import {AutocompleteOption} from '../types/AutocompleteOptions'

/**
 * Excludes options from the list if the key is found in the reference list.
 * If the item is found in the reference list it will not be returned.
 * It's used to deduplicate items received from different data sources.
 */
export function optionsNotInReferenceList<T>({list, referenceList}:
  { list: AutocompleteOption<T>[], referenceList: AutocompleteOption<T>[] }) {
  if (list.length > 0) {
    // keys in list
    const itemsNotInReferenceList = list.filter(({key: lKey}) => {
      // if item cannot be found in referenceList
      return !referenceList.some(({key: rKey}) => {
        // compare list item with items in reference list
        return lKey === rKey
      })
    })
    return itemsNotInReferenceList
  }
  return []
}
