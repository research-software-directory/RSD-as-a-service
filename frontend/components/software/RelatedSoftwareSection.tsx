// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import useMediaQuery from '@mui/material/useMediaQuery';

import PageContainer from '../layout/PageContainer';
import SoftwareGrid, {SoftwareGridType} from '../user/software/SoftwareGrid';

export default function RelatedSoftwareSection({
	relatedSoftware = [],
}: {
	relatedSoftware: SoftwareGridType[];
}) {
	// use media query hook for small screen logic
	const smallScreen = useMediaQuery('(max-width:600px)');
	// adjust grid min width for mobile
	const minWidth = smallScreen ? '18rem' : '26rem';
	// do not render if no data
	if (relatedSoftware?.length === 0) return null;

	return (
		<PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
			<h2
				data-testid="software-contributors-section-title"
				className="pb-8 text-[2rem] text-primary"
			>
				Related software
			</h2>
			<SoftwareGrid
				className="gap-[0.125rem]"
				software={relatedSoftware}
				grid={{
					height: '17rem',
					minWidth,
					maxWidth: '1fr',
				}}
			/>
		</PageContainer>
	);
}
