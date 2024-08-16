// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function SoftwareOverviewList({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) {
	return (
		<section
			data-testid="software-overview-list"
			className="flex-1 flex flex-col gap-2 mt-2"
		>
			{children}
		</section>
	);
}
