// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: EUPL-1.2

import CategoryIcon from '@mui/icons-material/Category'
import { CategoriesForSoftware, CategoryEntry, CategoryID, CategoryPath } from '../../types/SoftwareTypes'
import TagChipFilter from '../layout/TagChipFilter'
import { ssrSoftwareUrl } from '~/utils/postgrestUrl'
import logger from '../../utils/logger'
import React from 'react'
import { Chip } from '@mui/material'

const interleave = <T,>(arr: T[], createElement: (index: number) => T) => arr.reduce((result, element, index, array) => {
  result.push(element);
  if (index < array.length - 1) {
    result.push(createElement(index));
  }
  return result;
}, [] as T[]);


type CategoryTreeLevel = {
  cat: CategoryEntry
  children: CategoryTreeLevel[]
}

function CategoryTree({ categories }: { categories: CategoryPath[] }) {

  const tree: CategoryTreeLevel[] = []
  for (const path of categories) {
    let cursor = tree
    for (const item of path) {
      const found = cursor.find(el => el.cat.id == item.id)
      if (!found) {
        const sub: CategoryTreeLevel = { cat: item, children: [] }
        cursor.push(sub)
        cursor = sub.children
      } else {
        cursor = found.children
      }
    }
  }

  const TreeLevel = ({ items, indent = false }: { items: CategoryTreeLevel[], indent?: boolean }) => {
    return <ul className={"list-disc list-inside -indent-4" + (indent ? ' pl-7' : ' pl-4')}>
      {items.map((item, index) => (
        <li key={index}>
          {item.cat.short_name}
          {item.children.length > 0 && <TreeLevel items={item.children} indent />}
        </li>
      ))}
    </ul>
  }

  return <TreeLevel items={tree} />

}

export type SelectedCategory = {
  index: number
  id: CategoryID
}

type SoftwareCategoriesProps = {
  categories: CategoryPath[]
} & (
    // need both params together or else none
    {
      onClick: (props: SelectedCategory) => void
      buttonTitle: string
    } | {
      onClick?: never
      buttonTitle?: never
    })

export function SoftwareCategories({ categories, buttonTitle, onClick }: SoftwareCategoriesProps) {
  if (categories.length === 0) {
    return (
      <i>No categories</i>
    )
  }

  // TODO: useCallback or move out of component
  const onClickHandler = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    console.log(event)
    const categoryIdx = parseInt(event.currentTarget.dataset.idx ?? '')
    if (isNaN(categoryIdx)) return
    const path = categories[categoryIdx]
    const categoryId = path[path.length - 1].id
    console.log('click', { id: categoryId, index: categoryIdx })
    onClick?.({ id: categoryId, index: categoryIdx })
  }

  return <div className="py-1">
    {categories.map((path, index) => {
      const chunks = path.map((category) => (
        <span key={category.id} className="group">
          {category.short_name}
          {/* FIXME: This is a tooltip. Needs beautification */}
          {!onClick && <span className="absolute hidden group-hover:flex px-2 py-2 bg-white border ">{category.name}</span>}
        </span>
      ))

      return (
        <div key={index} className={"clear-both mb-2" + (onClick ? " hover:bg-neutral-100" : "")}>
          <span className='px-2 py-1 bg-neutral-100 inline-block'>
            {interleave(chunks, (index) => <span key={index} className="px-2">::</span>)}
          </span>

          {onClick && <span className="ml-2 float-right" onClick={onClickHandler} data-idx={index}>{buttonTitle}</span>}
        </div>
      )
    })}
    <div className='clear-both'></div>

    <div className='mt-5 italic'>other variant using TagChipFilter:</div>
    {categories.map((path, index) => {
      const text = path.map((category) => category.short_name).join(' :: ')
      return (
        <div className='my-1'>
          <TagChipFilter url="" key={index} label={text} title={text} />
        </div>
      )
    })}

    <div className='mt-5 italic'>other variant using Chip:</div>
    {categories.map((path, index) => {
      const text = path.map((category) => category.short_name).join(' :: ')
      return (
        <div className='my-1'>
          <Chip key={index} label={text} title={text} onDelete={onClick && (() => onClick({ id: path[path.length - 1].id, index }))} />
        </div>
      )
    })}
    <div className='mt-5 italic'>other variant using a tree:</div>
    <CategoryTree categories={categories} />
  </div>
}

// FIXME: I think AboutSection should define headers instead of here
// FIXME: and a separate header component should be created and use for all blocks in AboutSection
export function SoftwareCategoriesWithHeadline({ categories }: { categories: CategoriesForSoftware }) {
  return (
    <>
      <div className="pt-8 pb-2">
        <CategoryIcon color="primary" />
        <span className="text-primary pl-2">Categories</span>
      </div>
      <SoftwareCategories categories={categories} />
    </>
  )
}
