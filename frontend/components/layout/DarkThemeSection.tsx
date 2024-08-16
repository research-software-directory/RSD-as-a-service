// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import DarkThemeProvider from './DarkThemeProvider';

export default function DarkThemeSection({
	children,
}: {
	children: JSX.Element[] | JSX.Element;
}) {
	return (
		<article className="bg-secondary">
			<DarkThemeProvider>{children}</DarkThemeProvider>
		</article>
	);
}
