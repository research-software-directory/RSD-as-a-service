// SPDX-FileCopyrightText: 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryTreeLevel} from '~/types/Category'
import {calcTreeLevelDepth} from '~/utils/categories'

export type CategoryTableProps = Readonly<{
   treeLevel: CategoryTreeLevel
}>
export const CategoryTable = ({treeLevel}: CategoryTableProps) => {
  const levelLables = treeLevel.category.properties.tree_level_labels
  const depth = calcTreeLevelDepth(treeLevel)
  return (
    <div className={`grid grid-cols-${depth} border-y-2`}>
      {levelLables &&
        <div className={`grid grid-cols-subgrid col-span-${depth} border-b-2`}>
          {levelLables.map(label =>
            <div className="px-3 py-2" key={label}><b>{label}</b></div>
          )}
        </div>
      }
      <Block categories={treeLevel.children} depth={depth} />
    </div>
  )
}

type BlockProps = Readonly<{
  categories:CategoryTreeLevel[]
  depth: number
}>
const Block = ({categories, depth}: BlockProps) => {
  const depth2 = depth - 1
  return categories.map((cat, index) => {
    const border = (index != categories.length-1) ? 'border-b-2' : ''
    return <div key={cat.category.id} className={`grid grid-cols-subgrid col-span-${depth} ${border}`}>
      <div className="px-3 py-2">
        {cat.category.name}
      </div>
      {depth2 > 0 &&
        <div className={`grid grid-cols-subgrid col-span-${depth2}`}>
          <Block categories={cat.children} depth={depth2} />
        </div>
      }
    </div>
  })
}

/*
We use dynamic class names here to build the table view ([not recommend](https://tailwindcss.com/docs/content-configuration#dynamic-class-names)
 by Tailwind). We also do not want to use [Safelisting Classes](https://tailwindcss.com/docs/content-configuration#safelisting-classes)
because this approach is more difficult to maintain. Instead we use the following workaround to include the used CSS classes.
Add more depth if necessary.
*/
const workaround =
  'grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5' +
  'col-span-1 col-span-2 col-span-3 col-span-4 col-span-5'

