// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Avatar from '@mui/material/Avatar';

import {getImageUrl} from '~/utils/editImage';
import {getDisplayInitials, getDisplayName} from '~/utils/getDisplayName';
import {RsdContributor} from '~/components/admin/rsd-contributors/useContributors';
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded';
import OrcidLink from '~/components/layout/OrcidLink';

/**
 * Add new string value to a list of UNIQUE string values.
 * New value will be trimmed and transformed to locale-lower-case before comparison.
 * It ignores null and undefined values.
 * @param list
 * @param value
 * @returns
 */
function addToList(list: string[], value?: string | null) {
	// if no value to add we return
	if (!value) return list;

	// try to find trimmed and lowercased value
	const found = list.find(
		item =>
			item.trim().toLocaleLowerCase() ===
			value.trim().toLocaleLowerCase(),
	);

	if (found) {
		// already present in the list
		return list;
	} else {
		// new item to add to the list
		list.push(value);
		return list;
	}
}

function aggregateProfiles(profiles: RsdContributor[] | null) {
	const name: string[] = [],
		affiliation: string[] = [],
		role: string[] = [],
		email: string[] = [];
	let logo: string | null = null,
		orcid: string | null = null,
		initials: string | null = null;

	// const name:string =
	profiles?.forEach(item => {
		// name
		const displayName = getDisplayName(item);
		// validate display name
		addToList(name, displayName);
		// initals - to be used if no image present
		if (initials === null) initials = getDisplayInitials(item);
		// orcid - should be only 1 orcid
		if (item.orcid && orcid === null) orcid = item.orcid;
		// logo - use first image found
		if (logo === null && item?.avatar_id) logo = item.avatar_id;
		// affiliation
		addToList(affiliation, item.affiliation);
		// roles
		addToList(role, item.role);
		// emails - we force all emails to lower case
		addToList(email, item?.email_address?.toLocaleLowerCase());
	});

	return {
		name,
		initials,
		logo,
		affiliation,
		role,
		email,
		orcid,
	};
}

export default function ProfileMetadata({
	profiles,
}: {
	profiles: RsdContributor[] | null;
}) {
	const {name, logo, initials, orcid} = aggregateProfiles(profiles);
	return (
		<section className="grid md:grid-cols-[1fr,3fr] xl:grid-cols-[1fr,5fr] gap-4 mt-8">
			<BaseSurfaceRounded className="flex justify-center p-4 overflow-hidden relative">
				<Avatar
					alt={name[0] ?? ''}
					src={getImageUrl(logo ?? null) ?? ''}
					sx={{
						width: '10rem',
						height: '10rem',
						fontSize: '3.25rem',
					}}
				>
					{initials}
				</Avatar>
			</BaseSurfaceRounded>
			<BaseSurfaceRounded className="p-4">
				{/* Just name and ORCID in the first version 2023-11-27 */}
				<h1
					title={name[0]}
					className="text-2xl font-medium line-clamp-1"
				>
					{name[0] ?? ''}
				</h1>
				<p className="py-2">
					<OrcidLink orcid={orcid} />
				</p>
			</BaseSurfaceRounded>
		</section>
	);
}
