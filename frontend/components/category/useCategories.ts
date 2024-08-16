// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';

import {TreeNode} from '~/types/TreeNode';
import {CategoryEntry} from '~/types/Category';
import {loadCategoryRoots} from '~/components/category/apiCategories';
import logger from '~/utils/logger';

export default function useCategories({community}: {community: string | null}) {
	const [roots, setRoots] = useState<TreeNode<CategoryEntry>[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		let abort: boolean = false;
		// only if there is community value
		loadCategoryRoots(community)
			.then(roots => {
				if (abort) return;
				setRoots(roots);
				setError(null);
			})
			.catch(e => {
				logger(`useCategories...${e.message}`, 'error');
				if (abort) return;
				setError(
					"Couldn't load the categories, please try again or contact us",
				);
				setRoots(null);
			})
			.finally(() => {
				if (abort) return;
				setLoading(false);
			});

		return () => {
			abort = true;
		};
	}, [community]);

	function onMutation() {
		if (roots !== null) {
			setRoots([...roots]);
		}
	}

	return {
		loading,
		roots,
		error,
		onMutation,
	};
}
