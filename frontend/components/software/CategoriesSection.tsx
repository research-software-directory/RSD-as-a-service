// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryPath} from '~/types/Category'
import PageContainer from '~/components/layout/PageContainer'
import {useCategoryTree} from '~/components/category/useCategoryTree'
import {CategoryTable} from '~/components//category/CategoryTable'
import CategoryTree from '~/components/category/CategoryTree'

export type CategoriesSectionProps = Readonly<{
  categories: CategoryPath[]
}>
export default function CategoriesSection({categories}: CategoriesSectionProps) {
  const tree = useCategoryTree(categories)

  return tree.map(node => {
    const category = node.getValue()
    const children = node.children()

    return (
      <PageContainer
        key={category.id}
        className="py-12 px-4 lg:grid lg:grid-cols-[1fr_4fr]"
      >
        <h2
          data-testid="software-categories-section-title"
          className="pb-8 pr-4 text-[2rem] text-primary">
          {category.name}
        </h2>
        {/* Display as table and on small screens as bullet point list  */}
        <section className="max-sm:hidden">
          <CategoryTable tree={node} />
        </section>
        <section className="sm:hidden">
          <CategoryTree items={children} showLongNames/>
        </section>
      </PageContainer>
    )
  })
}
