// SPDX-FileCopyrightText: 2023 - 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEventHandler, Fragment, useMemo, useState} from 'react'
import {useSession} from '~/auth'
import {ReorderedCategories, leaf, useCategoryTree} from '~/utils/categories'
import {addCategoryToSoftware, deleteCategoryToSoftware} from '~/utils/getSoftware'
import {CategoryID, CategoryPath, CategoryTree, CategoryTreeLevel as TCategoryTreeLevel} from '~/types/Category'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {config} from '~/components/software/edit/links/config'
import {CategoryTreeLevel} from '~/components/category/CategoryTree'

export type SoftwareCategoriesProps = {
  softwareId: string
  categories: CategoryPath[]
  reorderedCategories: ReorderedCategories
}
export default function AutosaveSoftwareCategories({softwareId, categories: defaultCategoryPaths, reorderedCategories}: SoftwareCategoriesProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()

  // want to show each highlighted category plus a general section
  const availableCategoriesTree = useMemo(() => [
    ...reorderedCategories.highlighted,
    {
      category: {
        id: 'general',
        name: config.categories.title,
        properties:{subtitle: config.categories.subtitle},
      },
      children: reorderedCategories.general
    } as TCategoryTreeLevel,
  ], [reorderedCategories])

  // selected category items
  const [categoryPaths, setCategoryPaths] = useState(defaultCategoryPaths)
  const categoryTree = useCategoryTree(categoryPaths)
  const selectedCategoryIDs = useMemo(() => {
    const ids = new Set()
    for (const category of categoryPaths ) {
      ids.add(leaf(category).id)
    }
    return ids
  },[categoryPaths])

  const onAdd: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const categoryId = event.target.value
    event.target.value = 'none'

    const categoryPath = reorderedCategories.paths.find(path => leaf(path).id === categoryId)
    if (!categoryPath) return

    const category = leaf(categoryPath)
    addCategoryToSoftware(softwareId, category.id, token).then(() => {
      // Should we trust that this is the current value or should we re-fetch the values from backend?
      setCategoryPaths([...categoryPaths, categoryPath])
    }).catch((error) => {
      showErrorMessage(error.message)
    })
  }

  const onRemove = (categoryId: CategoryID) => {
    deleteCategoryToSoftware(softwareId, categoryId, token).then(() => {
      // Should we trust that this is the current value or should we re-fetch the values from backend?
      setCategoryPaths(categoryPaths.filter(path => leaf(path).id != categoryId))
    }).catch((error) => {
      showErrorMessage(error.message)
    })
  }

  const OptionsTree = ({items, indent=0}: {items: CategoryTree, indent?: number}) => {
    return items.map((item, index) => {
      const isLeaf = item.children.length === 0
      const isSelected = selectedCategoryIDs.has(item.category.id)
      const title = ' '.repeat(indent)+item.category.name
      return <Fragment key={title}>
        {isLeaf ?
          <option disabled={isSelected} value={item.category.id}>{title}{isSelected && ' ✓'}</option>
          :
          <optgroup label={title} />
        }
        <OptionsTree items={item.children} indent={indent+1}/>
      </Fragment>
    })
  }

  const extractSelected = (treeLevel: TCategoryTreeLevel, categoryTree:CategoryTree) => {
    if (treeLevel.category.id == 'general') {
      const selectedItems = []
      // scan the general top-level categories
      for (const general of reorderedCategories.general) {
        const l1 = categoryTree.find((entry) => entry.category.id == general.category.id )
        if (l1) selectedItems.push(l1)
      }
      return selectedItems
    }

    return categoryTree.find((entry) => entry.category.id == treeLevel.category.id )?.children
  }

  if (reorderedCategories.all.length === 0) return null

  return availableCategoriesTree.map(treeLevel => {
    if (treeLevel.children.length == 0) return null

    const selectedItems = extractSelected(treeLevel, categoryTree)

    return (
      <Fragment key={treeLevel.category.id}>
        <div className="py-4"></div>
        <EditSectionTitle
          title={treeLevel.category.name}
          subtitle={treeLevel.category.properties.subtitle}
        />
        <div className="mt-4 mb-2">
          <select className="p-2 w-full" onChange={onAdd}>
            <option value="none">Select a category</option>
            <OptionsTree items={treeLevel.children} />
          </select>

          {selectedItems &&
              <div className="mt-4">
                <CategoryTreeLevel items={selectedItems} showLongNames onRemove={onRemove}/>
              </div>
          }
        </div>
      </Fragment>
    )
  })
}
