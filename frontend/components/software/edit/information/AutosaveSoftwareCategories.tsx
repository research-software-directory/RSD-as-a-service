// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: EUPL-1.2

import { ChangeEventHandler, useEffect, useMemo, useState } from 'react'

import { useSession } from '~/auth'
import { softwareInformation as config } from '../editSoftwareConfig'
import { CategoryID, CategoryPath } from '~/types/SoftwareTypes'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import { SelectedCategory, SoftwareCategories } from '../../SoftwareCategories'
import { addCategoryToSoftware, deleteCategoryToSoftware, getAvailableCategories } from '~/utils/getSoftware'

export type SoftwareCategoriesProps = {
  softwareId: string
  categories: CategoryPath[]
}

function leaf<T>(list: T[]) {
  return list[list.length - 1]
}

export default function AutosaveSoftwareCategories({ softwareId, categories: defaultCategoryPaths }: SoftwareCategoriesProps) {
  const { token } = useSession()
  const { showErrorMessage, showInfoMessage } = useSnackbar()
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
      .then(setAvailableCategoryPaths);
  }, [])

  const addCategory = (categoryPath: CategoryPath) => {
    const category = leaf(categoryPath)
    // console.log('onAdd:', softwareId, category.id)
    addCategoryToSoftware(softwareId, category.id, token).then(() => {
      // FIXME: should we expect that this is corrent or should we re-fetch the value from backend?
      setCategoryPaths([...categoryPaths, categoryPath])
    }).catch((error) => {
      console.log(error)
      showErrorMessage(error.message)
    })
  }

  const onAdd: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const categoryIdx = parseInt(event.target.value ?? '')
    if (isNaN(categoryIdx)) return
    const path = availableCategoryPaths[categoryIdx]
    const categoryId = path[path.length - 1].id
    // console.log('click', { id: categoryId, index: categoryIdx })
    addCategory(path)
    // reset selection
    event.target.value = 'none'
  }

  const onDelete = (category: SelectedCategory) => {
    // console.log('onRemove:', softwareId, category.id)
    deleteCategoryToSoftware(softwareId, category.id, token).then(() => {
      // FIXME: should we expect that this is corrent or should we re-fetch the value from backend?
      setCategoryPaths(categoryPaths.filter((el, index) => index != category.index))
    }).catch((error) => {
      console.log(error)
      showErrorMessage(error.message)
    })
  }


  return (
    <>
      <EditSectionTitle
        title={config.categories.title}
        subtitle={config.categories.subtitle}
      />
      <div className="py-2">
        <SoftwareCategories categories={categoryPaths} onClick={onDelete} buttonTitle="delete" />
        <select className="p-2 mt-3 w-full" onChange={onAdd}>
          <option value="none">click to assign categories</option>
          {availableCategoryPaths.map((categoryPath, index) => <option key={index} value={index}>{categoryPath.map(cat => cat.short_name).join(' :: ')}</option>)}
        </select>
      </div>
    </>
  )
}
