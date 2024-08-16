// SPDX-FileCopyrightText: 2023 - 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useMemo, useState} from 'react';
import {CategoryEntry, CategoryPath} from '~/types/Category';
import {
	categoryEntriesToRoots,
	loadCategoryRoots,
} from '~/components/category/apiCategories';
import {TreeNode} from '~/types/TreeNode';

const compareCategoryEntry = (p1: CategoryEntry, p2: CategoryEntry) =>
	p1.name.localeCompare(p2.name);
const compareCategoryTreeNode = (
	p1: TreeNode<CategoryEntry>,
	p2: TreeNode<CategoryEntry>,
) => compareCategoryEntry(p1.getValue(), p2.getValue());

export const categoryTreeNodesSort = (trees: TreeNode<CategoryEntry>[]) => {
	trees.sort(compareCategoryTreeNode);
	for (const root of trees) {
		root.sortRecursively(compareCategoryEntry);
	}
};

export const genCategoryTreeNodes = (
	categories: CategoryPath[],
): TreeNode<CategoryEntry>[] => {
	const allEntries: CategoryEntry[] = [];
	for (const path of categories) {
		for (const entry of path) {
			allEntries.push(entry);
		}
	}

	const result = categoryEntriesToRoots(allEntries);

	categoryTreeNodesSort(result);

	return result;
};

export const useCategoryTree = (
	categories: CategoryPath[],
): TreeNode<CategoryEntry>[] => {
	return useMemo(() => genCategoryTreeNodes(categories), [categories]);
};

export type ReorderedCategories = {
	paths: CategoryPath[];
	all: TreeNode<CategoryEntry>[];
	highlighted: TreeNode<CategoryEntry>[];
	general: TreeNode<CategoryEntry>[];
};

export function reorderCategories(
	categoryRoots: TreeNode<CategoryEntry>[],
): ReorderedCategories {
	const all: TreeNode<CategoryEntry>[] = categoryRoots;
	const highlighted: TreeNode<CategoryEntry>[] = [];
	const general: TreeNode<CategoryEntry>[] = [];

	for (const root of all) {
		if (root.getValue().properties.is_highlight) {
			highlighted.push(root);
		} else {
			general.push(root);
		}
	}

	const paths = rootsToPaths(all);

	return {
		paths,
		all,
		highlighted,
		general,
	};
}

function rootsToPaths(roots: TreeNode<CategoryEntry>[]): CategoryPath[] {
	const result: CategoryPath[] = [];

	const treeNodeStack: TreeNode<CategoryEntry>[] = [];
	const resultStack: CategoryPath[] = [];
	for (const root of roots) {
		treeNodeStack.push(root);
		resultStack.push([root.getValue()]);
	}

	while (treeNodeStack.length > 0) {
		const node = treeNodeStack.pop()!;
		const path = resultStack.pop()!;
		if (node.childrenCount() === 0) {
			result.push(path);
			continue;
		}

		for (const child of node.children()) {
			treeNodeStack.push(child);
			resultStack.push([...path, child.getValue()]);
		}
	}

	return result;
}

export function useReorderedCategories(
	community: string | null,
): ReorderedCategories {
	const [reorderedCategories, setReorderedCategories] =
		useState<ReorderedCategories>({
			paths: [],
			all: [],
			highlighted: [],
			general: [],
		});

	useEffect(() => {
		loadCategoryRoots(community).then(roots =>
			setReorderedCategories(reorderCategories(roots)),
		);
	}, [community]);

	return reorderedCategories;
}

export function calcTreeLevelDepth(tree: TreeNode<CategoryEntry>): number {
	function walk(tree: TreeNode<CategoryEntry>, depth: number): number {
		return Math.max(
			depth,
			...tree.children().map(sub => walk(sub, depth + 1)),
		);
	}

	return walk(tree, 0);
}
