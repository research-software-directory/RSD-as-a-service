// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEventHandler, useEffect, useMemo, useState} from 'react'
import {useSession} from '~/auth'
import {softwareInformation as config} from '../editSoftwareConfig'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {addCategoryToSoftware, deleteCategoryToSoftware, getAvailableCategories} from '~/utils/getSoftware'
import {CategoryID, CategoryPath} from '~/types/Category'
import {CategoriesWithHeadlines} from '~/components/category/CategoriesWithHeadlines'

export type SoftwareCategoriesProps = {
  softwareId: string
  categories: CategoryPath[]
}

function leaf<T>(list: T[]) {
  return list[list.length - 1]
}

export default function AutosaveSoftwareCategories({softwareId, categories: defaultCategoryPaths}: SoftwareCategoriesProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [categoryPaths, setCategoryPaths] = useState(defaultCategoryPaths)
  const [availableCategoryPaths, setAvailableCategoryPaths] = useState<CategoryPath[]>([])

  const categoryMap = useMemo(() => {
    const map: Record<CategoryID, number> = {}
    for (const [index, path] of availableCategoryPaths.entries()) {
      const leafCategory = leaf(path)
      map[leafCategory.id] = index
    }
    return map
  }, [availableCategoryPaths])

  useEffect(() => {
    getAvailableCategories()
      .then(setAvailableCategoryPaths)
  }, [])

  const addCategory = (categoryPath: CategoryPath) => {
    const category = leaf(categoryPath)
    addCategoryToSoftware(softwareId, category.id, token).then(() => {
      // FIXME: should we expect that this is current value or should we re-fetch the value from backend?
      setCategoryPaths([...categoryPaths, categoryPath])
    }).catch((error) => {
      showErrorMessage(error.message)
    })
  }

  const onAdd: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const categoryIdx = parseInt(event.target.value ?? '')
    if (isNaN(categoryIdx)) return
    const path = availableCategoryPaths[categoryIdx]
    const categoryId = path[path.length - 1].id
    addCategory(path)
    // reset selection
    event.target.value = 'none'
  }

  const onRemove = (categoryId: CategoryID) => {
    deleteCategoryToSoftware(softwareId, categoryId, token).then(() => {
      const categoryIndex = categoryPaths.findIndex(categoryPath => leaf(categoryPath).id == categoryId)
      // FIXME: should we expect that this is current value or should we re-fetch the value from backend?
      setCategoryPaths(categoryPaths.filter((el, index) => index != categoryIndex))
    }).catch((error) => {
      showErrorMessage(error.message)
    })
  }


  return (
    <>
      <EditSectionTitle
        title={config.categories.title}
        subtitle={config.categories.subtitle}
      />
      <div className="mb-2">
        <select className="p-2 w-full bg-primary text-white" onChange={onAdd}>
          <option value="none">click to assign categories</option>
          {availableCategoryPaths.map((categoryPath, index) => <option key={index} value={index}>{categoryPath.map(cat => cat.short_name).join(' :: ')}</option>)}
        </select>
        <div className="ml-1">
          <CategoriesWithHeadlines categories={categoryPaths} onRemove={onRemove}/>
        </div>
      </div>
    </>
  )
}
