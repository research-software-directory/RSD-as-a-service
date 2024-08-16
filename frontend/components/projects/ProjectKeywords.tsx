// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {KeywordForProject} from '~/types/Project';
import {ssrProjectsUrl} from '~/utils/postgrestUrl';
import TagChipFilter from '../layout/TagChipFilter';

export default function ProjectKeywords({
	keywords = [],
}: {
	keywords: KeywordForProject[];
}) {
	function renderTags() {
		if (keywords.length === 0) {
			return <i>Not specified</i>;
		}
		return (
			<div className="flex flex-wrap gap-2 py-1">
				{keywords.map((item, pos) => {
					const url = ssrProjectsUrl({keywords: [item.keyword]});
					return (
						<TagChipFilter
							url={url}
							key={pos}
							label={item.keyword}
						/>
					);
				})}
			</div>
		);
	}

	return (
		<div>
			<div className="text-primary py-4">Keywords</div>
			{renderTags()}
		</div>
	);
}
