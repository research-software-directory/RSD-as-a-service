# SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

import json
import xml.etree.ElementTree as Tree
import os
from datetime import datetime, timedelta
import requests
from requests.exceptions import HTTPError
import time
import jwt


# Still need to enrich and correct the metadata. Currently serving Zenodo's metadata as-is.
def list_records(dois):
	oaipmh_elem = _build_oaipmh_elem()

	# get the conceptdois from /api/software
	backend_url = os.environ.get('POSTGREST_URL')
	response = requests.get(backend_url + '/software?select=concept_doi')

	if dois is None:
		softwares = response.json()
	else:
		softwares = [software for software in response.json() if software["concept_doi"] in dois]

	headers = {
		'Authorization': 'Bearer ' + os.environ.get('ZENODO_ACCESS_TOKEN')
	}

	n_softwares = len(softwares)

	for i_software, software in enumerate(softwares):

		if software["concept_doi"] is None:
			print(" %d/%d: concept_doi is None" % (i_software + 1, n_softwares))
			continue

		try:
			redirect_url = _get_redirect(software)
			identifier = _get_zenodo_identifier(redirect_url, headers)
			url = 'https://zenodo.org/oai2d?verb=GetRecord&identifier=oai:zenodo.org:' + identifier + \
				'&metadataPrefix=datacite4'
			record_elem = _get_datacite(url, headers)
			oaipmh_elem.find('{http://www.openarchives.org/OAI/2.0/}ListRecords') \
				.append(record_elem)

			print(
				" %d/%d: retrieved datacite4 metadata for %s" % (i_software + 1, n_softwares, software["concept_doi"])
			)

		except requests.exceptions.RequestException as e:
			print(
				" %d/%d: There was an error while retrieving OAI-PMH metadata for https://doi.org/%s. %s" %
				(i_software + 1, n_softwares, software["concept_doi"], str(e))
			)
			continue

	document = Tree.ElementTree(oaipmh_elem)
	xml_str = Tree.tostring(document.getroot(), encoding='UTF-8', method='xml', xml_declaration=True).decode("utf8")
	data_dict = {"data": xml_str}

	jwt_secret = os.environ.get('PGRST_JWT_SECRET')
	jwt_token = jwt.encode({"role": "rsd_admin", "exp": datetime.now() + timedelta(minutes = 1)}, jwt_secret, algorithm="HS256")
	patch_response = requests.patch('{}/oaipmh?id=is.true'.format(backend_url), json.dumps(data_dict), headers={'Authorization': 'Bearer ' + jwt_token})
	if patch_response.status_code != 204:
		print(patch_response.text)
	patch_response.raise_for_status()


def _build_oaipmh_elem():
	root_elem = Tree.Element('{http://www.openarchives.org/OAI/2.0/}OAI-PMH')

	response_date_elem = Tree.Element('{http://www.openarchives.org/OAI/2.0/}responseDate')
	response_date_elem.text = datetime.utcnow().replace(microsecond=0).isoformat() + 'Z'
	root_elem.append(response_date_elem)

	request_elem = Tree.Element('{http://www.openarchives.org/OAI/2.0/}request')
	request_elem.set('verb', 'ListRecords')
	request_elem.set('metadataPrefix', 'datacite4')
	request_elem.text = 'https://zenodo.org/oai2d'
	root_elem.append(request_elem)

	listrecords_elem = Tree.Element('{http://www.openarchives.org/OAI/2.0/}ListRecords')
	root_elem.append(listrecords_elem)
	return root_elem


def _get_redirect(software):
	response = requests.head('https://doi.org/{conceptdoi}'.format(conceptdoi=software["concept_doi"]))
	if response.status_code == 302:
		return response.next.url
	elif response.status_code == 429:
		print("HttpError 429 while trying to redirect from doi.org.")
		response.raise_for_status()
	else:
		raise HTTPError(
			"Expected a redirect from doi.org to zenodo.org, got {0} instead."
			.format(response.status_code)
		)


def _get_zenodo_identifier(redirect_url, headers):
	response = requests.head(redirect_url, headers=headers)

	if response.status_code == 302:
		return response.next.url.split('/')[-1:][0]
	elif response.status_code == 429:
		print("HttpError 429 while trying to retrieve a record from zenodo.org.")
		epoch_rate_limit_reset = int(response.headers.get("X-RateLimit-Reset"))
		epoch_now = time.time()
		sleep_time = max(0, epoch_rate_limit_reset - epoch_now)
		print("Sleeping until: {} ({} seconds)".format(epoch_rate_limit_reset, sleep_time))
		time.sleep(sleep_time)
		return _get_zenodo_identifier(redirect_url, headers)
	else:
		raise HTTPError(
			"Expected a redirect from a conceptdoi to a versioned doi, got {0} instead."
			.format(response.status_code)
		)


def _get_datacite(url, headers):
	response = requests.get(url, headers=headers)

	if response.status_code != requests.codes.ok:
		print("Error while trying to retrieve datacite metadata from zenodo.org.")
		response.raise_for_status()

	# future work: correct/expand the datacite4 representation with other data from the RSDjson
	return Tree.fromstring(response.text) \
		.find("{http://www.openarchives.org/OAI/2.0/}GetRecord") \
		.find("{http://www.openarchives.org/OAI/2.0/}record")


if __name__ == "__main__":
	if bool(os.environ.get('ENABLE_OAIPMH_SCRAPER')):
		list_records(None)
	else:
		print("The oaipmh scraper is disabled, aborting")
