import {CategoryPath, CategoryTree, CategoryTreeLevel} from '~/types/Category'

export const genCategoryTree = (categories: CategoryPath[]) : CategoryTree => {
  const tree: CategoryTree = []
  for (const path of categories) {
    let cursor = tree
    for (const item of path) {
      const found = cursor.find(el => el.category.id == item.id)
      if (found) {
        cursor = found.children
      } else {
        const sub: CategoryTreeLevel = {category: item, children: []}
        cursor.push(sub)
        cursor = sub.children
      }
    }
  }
  return tree
}
