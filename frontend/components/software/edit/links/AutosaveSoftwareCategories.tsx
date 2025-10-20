// SPDX-FileCopyrightText: 2023 - 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Fragment, useMemo, useState} from 'react'
import {useSession} from '~/auth/AuthProvider'
import {CategoryEntry} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import {addCategoryToSoftware, deleteCategoryToSoftware} from '~/components/software/apiSoftware'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {categoryTreeNodesSort} from '~/components/category/useCategoryTree'
import TreeSelect from '~/components/category/TreeSelect'
import CategoryTree from '~/components/category/CategoryTree'
import {ReorderedCategories} from '~/components/category/useReorderedCategories'
import {config} from '~/components/software/edit/links/config'

export type SoftwareCategoriesProps = {
  softwareId: string
  reorderedCategories: ReorderedCategories
  associatedCategoryIds: Set<string>
}

export default function AutosaveSoftwareCategories({softwareId, reorderedCategories, associatedCategoryIds}: Readonly<SoftwareCategoriesProps>) {
  // trick to force rerender
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setAssociatedCategories] = useState<Set<string>>(associatedCategoryIds)
  const {token} = useSession()
  const selectedNodes: TreeNode<CategoryEntry>[] = []

  for (const root of reorderedCategories.all) {
    const rootSelectedSubTree= root.subTreeWhereNodesSatisfyWithoutChildren(value => associatedCategoryIds.has(value.id))
    if (rootSelectedSubTree !== null) {
      selectedNodes.push(rootSelectedSubTree)
    }
  }

  // want to show each highlighted category plus a general section
  const availableCategoriesTree: TreeNode<CategoryEntry>[] = useMemo(() => {
    const generalCategories = new TreeNode<CategoryEntry>(
      {
        id: 'general',
        parent: null,
        community: null,
        organisation: null,
        name: config.categories.title,
        allow_software: false,
        allow_projects: false,
        short_name: '',
        properties: {subtitle: config.categories.subtitle},
        provenance_iri: null,
        status: 'global'
      }
    )
    for (const generalRoot of reorderedCategories.general) {
      generalCategories.addChild(generalRoot)
    }

    // prevent the dropdown from being there if there are no global categories
    const result = generalCategories.childrenCount() > 0
      ?
      [
        ...reorderedCategories.highlighted,
        generalCategories
      ]
      :
      reorderedCategories.highlighted

    categoryTreeNodesSort(result)

    return result
  }, [reorderedCategories])

  function deleteCategoryId(categoryId: string): void {
    deleteCategoryToSoftware(softwareId, categoryId, token)
    associatedCategoryIds.delete(categoryId)
    setAssociatedCategories(new Set(associatedCategoryIds))
  }

  function addOrDeleteCategory(node: TreeNode<CategoryEntry>): void {
    const val = node.getValue()

    const categoryId = val.id
    if (associatedCategoryIds.has(categoryId)) {
      deleteCategoryToSoftware(softwareId, categoryId, token)
      associatedCategoryIds.delete(categoryId)
    } else {
      addCategoryToSoftware(softwareId, categoryId, token)
      associatedCategoryIds.add(categoryId)
    }

    setAssociatedCategories(new Set(associatedCategoryIds))
  }

  function extractSelectedRoots(root: TreeNode<CategoryEntry>): TreeNode<CategoryEntry>[] {
    const result: TreeNode<CategoryEntry>[] = []

    if (root.getValue().properties.is_highlight) {
      for (const selectedRoot of selectedNodes) {
        if (root.getValue().id === selectedRoot.getValue().id) {
          result.push(selectedRoot)
          break
        }
      }
    } else {
      for (const selectedRoot of selectedNodes) {
        if (root.children().some(entry => entry.getValue().id === selectedRoot.getValue().id)) {
          result.push(selectedRoot)
        }
      }
    }

    return result
  }

  // console.group('AutosaveSoftwareCategories')
  // console.log('associatedCategoryIds...',associatedCategoryIds)
  // console.log('availableCategoriesTree...',availableCategoriesTree)
  // console.groupEnd()

  return (
    <>
      {availableCategoriesTree.map(root => {
        const rootValue = root.getValue()
        const children = root.children()
        const selected = extractSelectedRoots(root)

        // console.group('availableCategoriesTree.map')
        // console.log('rootValue...',rootValue)
        // console.log('children...',children)
        // console.log('selected...',selected)
        // console.groupEnd()

        return (
          <Fragment key={rootValue.id}>
            <EditSectionTitle
              title={rootValue.name}
              subtitle={rootValue.properties.subtitle}
              className="font-medium py-4"
            />
            <TreeSelect
              roots={children}
              textExtractor={value => value.name}
              keyExtractor={value => value.id}
              onSelect={node => addOrDeleteCategory(node)}
              isSelected={node => {
                const val = node.getValue()
                return associatedCategoryIds.has(val.id)
              }}
            />

            <div className="mt-6"/>

            <CategoryTree
              showLongNames
              items={selected}
              onRemove={deleteCategoryId}
              selectedList={associatedCategoryIds}
            />

          </Fragment>
        )
      })}
    </>
  )
}
