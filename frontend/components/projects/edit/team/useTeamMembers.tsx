// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';

import {useSession} from '~/auth';
import {TeamMember} from '~/types/Project';
import {getTeamForProject} from '~/utils/getProjects';
import useProjectContext from '../useProjectContext';

export default function useTeamMembers({slug}: {slug: string}) {
	const {token} = useSession();
	const {project} = useProjectContext();
	const [members, setMembers] = useState<TeamMember[]>([]);
	const [loadedSlug, setLoadedSlug] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let abort = false;
		async function getMembers() {
			setLoading(true);
			const members = await getTeamForProject({
				project: project.id,
				token,
			});
			// debugger
			setMembers(members);
			setLoadedSlug(slug);
			setLoading(false);
		}
		if (slug && token && project.id && slug !== loadedSlug) {
			getMembers();
		}
		return () => {
			abort = true;
		};
	}, [slug, loadedSlug, token, project.id, setLoading]);

	return {
		token,
		loading,
		members,
		project,
		setMembers,
	};
}
