// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import OrcidLink from '../layout/OrcidLink';

type PersonalInfoProps = {
	role?: string | null;
	affiliation?: string | null;
	orcid?: string | null;
};

export default function PersonalInfo({
	role,
	affiliation,
	orcid,
}: PersonalInfoProps) {
	if (!(role || affiliation || orcid)) return null;

	return (
		<div>
			{role && <div>{role}</div>}
			{affiliation && <div>{affiliation}</div>}
			{orcid && (
				<div>
					<OrcidLink orcid={orcid} />
				</div>
			)}
		</div>
	);
}
