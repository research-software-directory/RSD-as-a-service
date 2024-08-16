// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function ResearchDomainTitle({
	domains = [],
}: {
	domains: string[];
}) {
	const mainDomain: string[] = [];
	domains.forEach(domain => {
		if (
			domain.toUpperCase().startsWith('LS') === true &&
			mainDomain.includes('Life Sciences') === false
		) {
			mainDomain.push('Life Sciences');
		}
		if (
			domain.toUpperCase().startsWith('PE') === true &&
			mainDomain.includes('Physical Sciences and Engineering') === false
		) {
			mainDomain.push('Physical Sciences and Engineering');
		}
		if (
			domain.toUpperCase().startsWith('SH') === true &&
			mainDomain.includes('Social Sciences and Humanities') === false
		) {
			mainDomain.push('Social Sciences and Humanities');
		}
	});

	if (mainDomain.length === 0) return null;

	return (
		<div
			title={mainDomain.join(', ')}
			className="line-clamp-1 text-sm text-base-content-disabled font-medium tracking-widest uppercase mb-2"
		>
			{mainDomain.join(', ')}
		</div>
	);
}
