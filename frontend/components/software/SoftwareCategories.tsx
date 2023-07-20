
import CategoryIcon from '@mui/icons-material/Category'
import { CategoriesForSoftware, CategoryID, CategoryPath } from '../../types/SoftwareTypes'
import TagChipFilter from '../layout/TagChipFilter'
import { ssrSoftwareUrl } from '~/utils/postgrestUrl'
import logger from '../../utils/logger'
import React from 'react'

const interleave = <T,>(arr: T[], createElement: (index: number) => T) => arr.reduce((result, element, index, array) => {
  result.push(element);
  if (index < array.length - 1) {
    result.push(createElement(index));
  }
  return result;
}, [] as T[]);


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
