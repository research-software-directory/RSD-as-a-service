
export type CategoryID = string

export type CategoryEntry = {
  id: CategoryID
  parent: CategoryID | null
  short_name: string
  name: string
}


export type CategoryPath = CategoryEntry[]

export type CategoryTreeLevel = {
  category: CategoryEntry
  children: CategoryTreeLevel[]
}
export type CategoryTree = CategoryTreeLevel[]
