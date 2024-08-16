// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryPath} from '~/types/Category';
import PageContainer from '../layout/PageContainer';
import {useCategoryTree} from '~/utils/categories';
import {CategoryTable} from '~/components//category/CategoryTable';
import {CategoryTreeLevel} from '~/components/category/CategoryTree';

export type CategoriesSectionProps = Readonly<{
	categories: CategoryPath[];
}>;
export default function CategoriesSection({
	categories,
}: CategoriesSectionProps) {
	const tree = useCategoryTree(categories);

	return tree.map(node => {
		const category = node.getValue();

		const children = node.children();

		return (
			<PageContainer
				className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]"
				key={category.id}
			>
				<h2
					data-testid="software-categories-section-title"
					className="pb-8 text-[2rem] text-primary"
				>
					{category.name}
				</h2>
				{/* Display as table and on small screens as bullet point list  */}
				<section className="max-sm:hidden">
					<CategoryTable tree={node} />
				</section>
				<section className="sm:hidden">
					<CategoryTreeLevel items={children} showLongNames />
				</section>
			</PageContainer>
		);
	});
}
