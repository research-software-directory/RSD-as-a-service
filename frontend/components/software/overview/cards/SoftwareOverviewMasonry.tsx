// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function SoftwareOverviewMasonry({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) {
	return (
		<section
			data-testid="software-overview-masonry"
			className="w-full lg:columns-2 xl:columns-3 gap-8 mt-4"
		>
			{children}
		</section>
	);
}
