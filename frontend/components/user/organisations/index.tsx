// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import ContentLoader from '~/components/layout/ContentLoader';
import NoContent from '~/components/layout/NoContent';
import useUserOrganisations from './useUserOrganisations';
import OrganisationListItem from './OrganisationListItem';

export default function UserOrganisations() {
	const {loading, organisations} = useUserOrganisations();

	// console.group('UserOrganisations')
	// console.log('loading...', loading)
	// console.log('organisations...', organisations)
	// console.log('searchFor...', searchFor)
	// console.log('page...', page)
	// console.log('rows...', rows)
	// console.groupEnd()

	// if loading show loader
	if (loading) return <ContentLoader />;

	if (organisations.length === 0) {
		return <NoContent />;
	}

	return (
		<div
			data-testid="organisation-overview-list"
			className="flex-1 my-2 flex flex-col gap-2"
		>
			{organisations.map(item => (
				<OrganisationListItem key={item.slug} organisation={item} />
			))}
		</div>
	);
}
