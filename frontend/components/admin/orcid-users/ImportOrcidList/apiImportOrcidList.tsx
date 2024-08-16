// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react';

import {useSession} from '~/auth';
import {isOrcid} from '~/utils/getORCID';
import {
	createJsonHeaders,
	extractReturnMessage,
	getBaseUrl,
} from '~/utils/fetchHelpers';
import logger from '~/utils/logger';
import {ExpandedOrcidResult, fetchOrcidPersons} from '../apiOrcidUsers';

export type OrcidSearchResult = {
	orcid: string;
	status: 'invalid' | 'valid' | 'alreadyImported' | 'orcidNotFound';
	include: boolean;
	data?: ExpandedOrcidResult;
};

export type OrcidBulkImportReport = Map<string, OrcidSearchResult> | null;

export function useValidateOrcidList() {
	const {token} = useSession();
	const [validating, setValidating] = useState(false);

	async function validateInput(value: string) {
		setValidating(true);
		const orcidList = value.split(/\r\n|\n|\r/);
		const searchResults = await validateOrcidList(orcidList, token);
		setValidating(false);
		return searchResults;
	}

	return {
		validateInput,
		validating,
	};
}

export async function findOrdicInRSD({
	orcidList,
	token,
}: {
	orcidList: string[];
	token: string;
}) {
	try {
		// if no list we return []
		if (orcidList?.length === 0) return [];
		// build query string
		const query = `orcid=in.("${orcidList.join('","')}")`;
		const url = `${getBaseUrl()}/orcid_whitelist?${query}`;
		const resp = await fetch(url, {
			method: 'GET',
			headers: {
				...createJsonHeaders(token),
			},
		});
		if ([200, 206].includes(resp.status)) {
			const orcidList: {orcid: string}[] = await resp.json();
			return orcidList.map(item => item.orcid);
		}
		if (resp.status === 416) {
			// nothing found returns 416
			return [];
		}
		logger(`findOrdicInRSD: ${resp.status}: ${resp.statusText}`, 'warn');
		return [];
	} catch (e: any) {
		logger(`findOrdicInRSD: ${e.message}`, 'error');
		return [];
	}
}

export async function validateOrcidList(orcidList: string[], token: string) {
	// here we put validation results for each orcid from orcidList
	const searchResultPerOrcid: OrcidBulkImportReport = new Map();
	// use only valid ORCID by syntax
	const validOrcidList = orcidList.filter(orcid => isOrcid(orcid));
	// make requests to RSD and ORCID api's
	const [orcidInRsd, orcidPersons] = await Promise.all([
		findOrdicInRSD({orcidList: validOrcidList, token}),
		fetchOrcidPersons(validOrcidList),
	]);
	// validate orcid on input pattern (regex)
	orcidList.forEach(orcid => {
		// if ORCID syntax valid (regex)
		if (validOrcidList.includes(orcid) === true) {
			// get ORCID data for this id
			const respOCRID = orcidPersons?.get(orcid);
			// if already IN RSD
			if (orcidInRsd.includes(orcid) === true) {
				// found in RSD
				searchResultPerOrcid.set(orcid, {
					orcid,
					status: 'alreadyImported',
					include: false,
					data: respOCRID,
				});
			} else {
				// NOT in RSD
				// but status could be orcidNotFound in ORCID api
				// we should allow this ORCID to be included but not by default
				searchResultPerOrcid.set(orcid, {
					orcid,
					status: respOCRID ? 'valid' : 'orcidNotFound',
					include: respOCRID ? true : false,
					data: respOCRID,
				});
			}
		} else {
			// NOT valid ORCID id syntax
			searchResultPerOrcid.set(orcid, {
				orcid,
				status: 'invalid',
				include: false,
			});
		}
	});

	// return result
	return searchResultPerOrcid;
}

export type RsdOrcid = {
	orcid: string;
};

export async function importOrcidList({
	orcidList,
	token,
}: {
	orcidList: RsdOrcid[];
	token: string;
}) {
	try {
		const resp = await fetch('/api/v1/orcid_whitelist', {
			body: JSON.stringify(orcidList),
			headers: createJsonHeaders(token),
			method: 'POST',
		});

		return extractReturnMessage(resp);
	} catch (e: any) {
		return {
			status: 500,
			message: e.message,
		};
	}
}
