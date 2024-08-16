// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export type Invitation = {
	id: string;
	created_at: string;
	expires_at: string;
	type: 'software' | 'project' | 'organisation';
};
