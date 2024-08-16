// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryEntry} from '~/types/Category';
import {TreeNode} from '~/types/TreeNode';
import {calcTreeLevelDepth} from '~/utils/categories';

export type CategoryTableProps = Readonly<{
	tree: TreeNode<CategoryEntry>;
}>;
export const CategoryTable = ({tree}: CategoryTableProps) => {
	const category = tree.getValue();

	const children = tree.children();
	const levelLables = category.properties.tree_level_labels;
	const depth = calcTreeLevelDepth(tree);
	return (
		<div className={`grid grid-cols-${depth} border-y-2`}>
			{levelLables && (
				<div
					className={`grid grid-cols-subgrid col-span-${depth} border-b-2`}
				>
					{levelLables.map(label => (
						<div className="px-3 py-2" key={label}>
							<b>{label}</b>
						</div>
					))}
				</div>
			)}
			<Block tree={children} depth={depth} />
		</div>
	);
};

type BlockProps = Readonly<{
	tree: TreeNode<CategoryEntry>[];
	depth: number;
}>;
const Block = ({tree, depth}: BlockProps) => {
	const depth2 = depth - 1;
	return tree.map((node, index) => {
		const category = node.getValue();

		const children = node.children();
		const border = index != tree.length - 1 ? 'border-b-2' : '';
		return (
			<div
				key={category.id}
				className={`grid grid-cols-subgrid col-span-${depth} ${border}`}
			>
				<div className="px-3 py-2">{category.name}</div>
				{depth2 > 0 && (
					<div
						className={`grid grid-cols-subgrid col-span-${depth2}`}
					>
						<Block tree={children} depth={depth2} />
					</div>
				)}
			</div>
		);
	});
};

/*
We use dynamic class names here to build the table view ([not recommend](https://tailwindcss.com/docs/content-configuration#dynamic-class-names)
 by Tailwind). We also do not want to use [Safelisting Classes](https://tailwindcss.com/docs/content-configuration#safelisting-classes)
because this approach is more difficult to maintain. Instead we use the following workaround to include the used CSS classes.
Add more depth if necessary.
*/
const workaround =
	'grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5' +
	'col-span-1 col-span-2 col-span-3 col-span-4 col-span-5';
