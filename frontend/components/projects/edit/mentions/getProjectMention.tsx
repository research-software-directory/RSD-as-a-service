// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getMentionsForProject} from '~/utils/getProjects';
import {getCitationsByProject} from '~/components/projects/edit/mentions/citations/apiCitationsByProject';

export async function getProjectMention(project: string, token: string) {
	try {
		const [output, impact, citation] = await Promise.all([
			getMentionsForProject({
				project,
				table: 'output_for_project',
				token,
			}),
			getMentionsForProject({
				project,
				table: 'impact_for_project',
				token,
			}),
			getCitationsByProject({
				project,
				token,
			}),
		]);
		// debugger
		return {
			output,
			impact,
			citation,
		};
	} catch (e: any) {
		return {
			output: [],
			citation: [],
			impact: [],
		};
	}
}
