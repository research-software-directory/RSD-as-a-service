// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

/**
 * ORCID OpenID endpoint
 * It provides frontend with redirect uri for the login button
 */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import logger from '~/utils/logger';
import {RedirectToProps, getRedirectUrl} from '~/auth/api/authHelpers';
import {getAuthEndpoint} from '~/auth/api/authEndpoint';
import {Provider, ApiError} from '.';

type Data = Provider | ApiError;

export async function orcidRedirectProps() {
	try {
		// extract well known url from env
		const wellknownUrl = process.env.ORCID_WELL_KNOWN_URL ?? null;
		if (wellknownUrl) {
			// get (cached) authorisation endpoint from wellknown url
			const authorization_endpoint =
				(await getAuthEndpoint(wellknownUrl, 'orcid')) ?? null;
			if (authorization_endpoint) {
				// construct all props needed for redirectUrl
				const props: RedirectToProps = {
					authorization_endpoint,
					redirect_uri:
						process.env.ORCID_REDIRECT ??
						'https://research-software.nl/auth/login/orcid',
					redirect_couple_uri:
						process.env.ORCID_REDIRECT_COUPLE ?? null,
					client_id:
						process.env.ORCID_CLIENT_ID ??
						'www.research-software.nl',
					scope: process.env.ORCID_SCOPES ?? 'openid',
					response_mode: process.env.ORCID_RESPONSE_MODE ?? 'query',
				};
				return props;
			} else {
				const message = 'authorization_endpoint is missing';
				logger(`orcidRedirectProps: ${message}`, 'error');
				return null;
			}
		} else {
			const message = 'ORCID_WELL_KNOWN_URL is missing';
			logger(`orcidRedirectProps: ${message}`, 'error');
			return null;
		}
	} catch (e: any) {
		logger(`orcidRedirectProps: ${e.message}`, 'error');
		return null;
	}
}

export async function orcidInfo() {
	// extract all props from env and wellknow endpoint
	const redirectProps = await orcidRedirectProps();
	if (redirectProps) {
		// create return url and the name to use in login button
		const redirectUrl = getRedirectUrl(redirectProps);
		// provide redirectUrl and name/label
		return {
			name: 'ORCID',
			redirectUrl,
			html: `
        Sign in with ORCID is supported <strong>only for persons approved by the RSD administrators</strong>.
        Contact us on rsd@esciencecenter.nl if you wish to login with your ORCID.
      `,
		};
	}
	return null;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) {
	try {
		// extract all props from env and wellknow endpoint
		// and create return url and the name to use in login button
		const loginInfo = await orcidInfo();
		if (loginInfo) {
			res.status(200).json(loginInfo);
		} else {
			res.status(400).json({
				status: 400,
				message: 'loginInfo missing',
			});
		}
	} catch (e: any) {
		logger(`api/fe/auth/orcid: ${e?.message}`, 'error');
		res.status(500).json({
			status: 500,
			message: e?.message,
		});
	}
}
