// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEventHandler, Fragment, useEffect, useMemo, useState} from 'react'
import {useSession} from '~/auth'
import {softwareInformation as config} from '../editSoftwareConfig'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {addCategoryToSoftware, deleteCategoryToSoftware, getAvailableCategories} from '~/utils/getSoftware'
import {CategoryID, CategoryPath, CategoryTree} from '~/types/Category'
import {CategoriesWithHeadlines} from '~/components/category/CategoriesWithHeadlines'
import {genCategoryTree, leaf} from '~/utils/categories'

export type SoftwareCategoriesProps = {
  softwareId: string
  categories: CategoryPath[]
}
export default function AutosaveSoftwareCategories({softwareId, categories: defaultCategoryPaths}: SoftwareCategoriesProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()

  const [availableCategoryPaths, setAvailableCategoryPaths] = useState<CategoryPath[]>([])
  const [availableCategories, setAvailableCategories] = useState<CategoryTree>([])

  const [categoryPaths, setCategoryPaths] = useState(defaultCategoryPaths)
  const selectedCategoryIDs = useMemo(() => {
    const ids = new Set()
    for (const category of categoryPaths ) {
      ids.add(leaf(category).id)
    }
    return ids
  },[categoryPaths])

  useEffect(() => {
    getAvailableCategories()
      .then((categories) => {
        setAvailableCategoryPaths(categories)
        setAvailableCategories(genCategoryTree(categories))
      })
  }, [])

  const onAdd: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const categoryId = event.target.value
    event.target.value = 'none'

    const categoryPath = availableCategoryPaths.find(path => leaf(path).id === categoryId)
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

  if (availableCategories.length === 0) return null

  return (
    <>
      <EditSectionTitle
        title={config.categories.title}
        subtitle={config.categories.subtitle}
      />
      <div className="mb-2">
        <select className="p-2 w-full bg-primary text-white" onChange={onAdd}>
          <option value="none">Select a category</option>
          <OptionsTree items={availableCategories} />
        </select>

        <div className="ml-1">
          <CategoriesWithHeadlines categories={categoryPaths} onRemove={onRemove}/>
        </div>
      </div>
    </>
  )
}
