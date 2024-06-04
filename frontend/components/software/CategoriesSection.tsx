// SPDX-FileCopyrightText: 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryPath} from '~/types/Category'
import PageContainer from '../layout/PageContainer'
import {useCategoryTree} from '~/utils/categories'
import {CategoryTreeLevel} from '../category/CategoryTree'

export type CategoriesSectionProps = {
  categories: CategoryPath[]
}
export default function CategoriesSection({categories}: CategoriesSectionProps) {
  const tree = useCategoryTree(categories)

  return tree.map((level, index) => (
    <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]" key={level.category.id}>
      <h2
        data-testid="software-categories-section-title"
        className="pb-8 text-[2rem] text-primary">
        {level.category.name}
      </h2>
      <section>
        <CategoryTreeLevel items={level.children} showLongNames/>
      </section>
    </PageContainer>
  ))

}
