// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react';

import {useSession} from '~/auth';
import logger from '~/utils/logger';
import {paginationUrlParams} from '~/utils/postgrestUrl';
import usePaginationWithSearch from '~/utils/usePaginationWithSearch';
import {extractCountFromHeader} from '~/utils/extractCountFromHeader';
import {
	createJsonHeaders,
	extractReturnMessage,
	getBaseUrl,
} from '~/utils/fetchHelpers';
import useSnackbar from '~/components/snackbar/useSnackbar';

type FetchOrcidIds = {
	page: number;
	rows: number;
	searchFor: string;
	token: string;
};

const orcidCache = new Map<string, ExpandedOrcidResult>();

export async function getOrcidList({
	page,
	rows,
	searchFor,
	token,
}: FetchOrcidIds) {
	try {
		let query = `order=orcid${paginationUrlParams({rows, page})}`;
		if (searchFor) {
			query += `&orcid=ilike.*${searchFor}*`;
		}

		const url = `${getBaseUrl()}/orcid_whitelist?${query}`;
		const resp = await fetch(url, {
			method: 'GET',
			headers: {
				...createJsonHeaders(token),
				// request record count to be returned
				// note: it's returned in the header
				Prefer: 'count=exact',
			},
		});
		if ([200, 206].includes(resp.status)) {
			const orcidList: {orcid: string}[] = await resp.json();
			return {
				count: extractCountFromHeader(resp.headers) ?? 0,
				orcids: orcidList.map(item => item.orcid),
			};
		}
		logger(`getOrcidList: ${resp.status}: ${resp.statusText}`, 'warn');
		return {
			count: 0,
			orcids: [],
		};
	} catch (e: any) {
		logger(`getOrcidList: ${e.message}`, 'error');
		return {
			count: 0,
			orcids: [],
		};
	}
}

export async function createOrcid({
	orcid,
	token,
}: {
	orcid: string;
	token: string;
}) {
	try {
		const resp = await fetch('/api/v1/orcid_whitelist', {
			body: JSON.stringify({
				orcid,
			}),
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

export async function deleteOrcid({
	orcid,
	token,
}: {
	orcid: string;
	token: string;
}) {
	try {
		const resp = await fetch(`/api/v1/orcid_whitelist?orcid=eq.${orcid}`, {
			headers: createJsonHeaders(token),
			method: 'DELETE',
		});
		return extractReturnMessage(resp);
	} catch (e: any) {
		return {
			status: 500,
			message: e.message,
		};
	}
}

export type ExpandedOrcidResult = {
	'orcid-id': string;
	'given-names'?: string;
	'family-names'?: string;
	'other-name'?: string[];
	email?: string[];
	'institution-name'?: string[];
};

export async function fetchNameFromOrcid(orcid: string) {
	try {
		const url = `https://pub.orcid.org/v3.0/expanded-search/?q=orcid:(${orcid})`;
		const resp = await fetch(url, {
			headers: {...createJsonHeaders()},
		});

		if (resp.status === 200) {
			const json = await resp.json();
			const result = json['expanded-result'] ?? null;
			if (result?.length === 1) {
				return result[0] as ExpandedOrcidResult;
			}
		}
		logger(
			`fetchNameFromOrcid: ${resp.status}: ${resp.statusText}`,
			'warn',
		);
		return null;
	} catch (e: any) {
		logger(`fetchNameFromOrcid: ${e.message}`, 'error');
		return null;
	}
}

export async function fetchOrcidPersons(orcids: string[]) {
	try {
		const orcidPersons = new Map<string, ExpandedOrcidResult>();
		if (orcids.length === 0) return undefined;

		// try to get info from orcidCache
		const newOrcids: string[] = [];
		orcids.forEach(orcid => {
			// try cache
			const person = orcidCache.get(orcid);
			if (person) {
				// from cache
				orcidPersons.set(person['orcid-id'], person);
			} else {
				newOrcids.push(orcid);
			}
		});

		// query ORCID api for items not in orcidCache
		if (newOrcids.length > 0) {
			const orcidsJoined = newOrcids.join('+');
			const url = `https://pub.orcid.org/v3.0/expanded-search/?q=orcid:(${orcidsJoined})`;

			const response = await fetch(url, {
				headers: {...createJsonHeaders()},
			});
			if (response.status !== 200) return orcidPersons;

			const json = await response.json();
			if (json['num-found'] > 0) {
				const results: ExpandedOrcidResult[] = json['expanded-result'];
				results.forEach(result => {
					orcidPersons.set(result['orcid-id'], result);
					orcidCache.set(result['orcid-id'], result);
				});
			}
		}
		return orcidPersons;
	} catch (e: any) {
		logger(`fetchOrcidPersons: ${e.message}`, 'error');
		return undefined;
	}
}

export function matchOrcidToPerson(
	orcids: string[],
	personsMap: Map<string, ExpandedOrcidResult> | undefined,
) {
	const persons: ExpandedOrcidResult[] = [];
	// use orcids loop as base
	orcids.forEach(orcid => {
		const found = personsMap?.get(orcid);
		if (found) {
			persons.push(found);
		} else {
			persons.push({
				'orcid-id': orcid,
			});
		}
	});
	// debugger
	return persons;
}

export function useOrcidList() {
	const {token} = useSession();
	const {showErrorMessage} = useSnackbar();
	const {searchFor, page, rows, setCount, setSearchInput} =
		usePaginationWithSearch('Provide valid ORCID');
	const [loading, setLoading] = useState(true);
	const [orcids, setOrcids] = useState<string[]>([]);
	const [persons, setPersons] = useState<ExpandedOrcidResult[]>();

	const loadOrcidList = useCallback(async () => {
		setLoading(true);
		// get list of orcids
		const {orcids, count} = await getOrcidList({
			token,
			searchFor,
			page,
			rows,
		});
		// load person info from orcid
		const orcidPersons = await fetchOrcidPersons(orcids);
		const newPersons = matchOrcidToPerson(orcids, orcidPersons);
		setOrcids(orcids);
		setPersons(newPersons);
		setCount(count);
		setLoading(false);
		// we do not include setCount in order to avoid loop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, rows, searchFor, token]);

	useEffect(() => {
		if (token) {
			loadOrcidList();
		}
		// we do not include setCount in order to avoid loop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, searchFor, page, rows]);

	async function addOrcid(value: string) {
		// add orcid
		const orcid = value ?? searchFor;
		const resp = await createOrcid({
			orcid,
			token,
		});
		if (resp.status === 200) {
			// reset search value
			setSearchInput('');
			// await loadOrcidList()
		} else {
			showErrorMessage(`Failed to add ORCID [${orcid}]. ${resp.message}`);
		}
	}

	async function removeOrcid(orcid: string) {
		const resp = await deleteOrcid({
			orcid,
			token,
		});
		if (resp.status === 200) {
			// reset search value
			if (searchFor !== '') {
				setSearchInput('');
			} else {
				loadOrcidList();
			}
		} else {
			showErrorMessage(`Failed to delete ORCID. ${resp.message}`);
		}
	}

	return {
		loading,
		orcids,
		searchFor,
		persons,
		addOrcid,
		removeOrcid,
		loadOrcidList,
	};
}

export function useOrcidName(orcid: string) {
	const [person, setPerson] = useState<ExpandedOrcidResult>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (orcid) {
			fetchNameFromOrcid(orcid).then(item => {
				if (item) {
					setPerson(item);
				} else {
					setPerson(undefined);
				}
				setLoading(false);
			});
		}
	}, [orcid]);

	return {
		loading,
		...person,
	};
}
