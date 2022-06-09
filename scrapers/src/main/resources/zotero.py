# SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

"""
https://pyzotero.readthedocs.io/en/latest/#retrieving-version-information

"""

import logging
from dateutil.parser import parse
import requests
from bs4 import BeautifulSoup
from pyzotero import zotero
import os
import jwt
from datetime import datetime, timedelta


def get_project_keys(client):
	collections = client.everything(client.collections_top())
	projects_collection = [c for c in collections if c['data']['name'] == 'Projects'][0]
	projects = client.everything(client.collections_sub(projects_collection['key']))
	return list(map(lambda x: x['key'], projects))


def get_last_version():
	last_version_item = requests.get('{}/mention?select=version&order=version.desc&limit=1'.format(backend_url), headers={'Authorization': 'Bearer ' + jwt_token}).json()
	return 0 if len(last_version_item) == 0 else last_version_item[0]['version']


# DOIs can be either an URL or just the identifier, so make sure its a URL
def doi_to_url(doi):
	if doi[:4] == 'http':
		return doi
	else:
		return 'https://doi.org/' + doi


# URL is constructed from doi (either as doi field or in 'extra'), or else from the 'url' field
def get_url_for_zotero_item(item):
	if 'DOI' in item['data'] and item['data']['DOI']:
		return doi_to_url(item['data']['DOI'])
	else:
		for extra in item['data']['extra'].split('\n'):
			if extra[:3] == 'doi' or extra[:3] == 'DOI':
				return doi_to_url(extra[5:])
		if 'url' in item['data'] and item['data']['url']:
			return item['data']['url']
	return None


def get_blog_fields(zotero_item):
	try:
		data = requests.get(zotero_item['data']['url']).text
		soup = BeautifulSoup(data, 'html.parser')
		authors = soup.find_all('meta', attrs={'name': 'author'})
		author = authors[0].attrs["content"] if len(authors) > 0 else None
		image = soup.find("meta", property="og:image").attrs["content"]
		return author, image
	except:
		return None, None


def get_mentions(since_version=None, keys_data=None):
	by_version = since_version is not None
	by_key = keys_data is not None

	if by_version and by_key:
		raise Exception("Use either 'since_version' or 'keys_data', not both")

	client = zotero.Zotero(zotero_library, 'group', zotero_api_token)

	if by_key:
		keys = ",".join([k["zotero_key"] for k in keys_data])
		items = client.everything(client.items(itemKey=keys))
		print('Found %d items in Zotero library %s based on supplied key(s).' % (len(items),
				   zotero_library))
	else:
		their_last_version = client.last_modified_version()
		our_last_version = get_last_version()
		print(('Database collection \'mention\' is currently at version %d; Zotero library %s is cur' +
				   'rently at version %d.') % (our_last_version, zotero_library, their_last_version))
		if since_version is None:
			since_version = our_last_version
		items = (client.everything(client.items(since=since_version)))

		print('Found %d new or updated items in Zotero library %s since version %d.' % (len(items),
				   zotero_library,
				   since_version))

	items_to_save = []

	project_keys = get_project_keys(client)
	supported_types = ['attachment', 'blogPost', 'book', 'bookSection', 'computerProgram', 'conferencePaper',
					   'document', 'interview', 'journalArticle', 'magazineArticle', 'manuscript', 'newspaperArticle',
					   'note', 'presentation', 'radioBroadcast', 'report', 'thesis', 'videoRecording', 'webpage']

	n_items = len(items)
	for item_index, item in enumerate(items):

		if 'title' not in item['data'] or not item['data']['title']:
			print("{0}/{1}: {2} does not have a title."
						   .format(item_index+1, n_items, item['key']))
			continue
		item_collection_keys = item['data'].get('collections', [])
		if len(set.intersection(set(item_collection_keys), set(project_keys))) == 0:
			print("{0}/{1}: {2} is not part of a project ({3})."
						   .format(item_index + 1, n_items, item['key'], item["data"]["title"]))
			continue

		try:
			item_date = parse(item['data']['date']).isoformat()[:19] + 'Z'
		except:
			print("{0}/{1}: {2} has a date problem ({3})."
						   .format(item_index + 1, n_items, item['key'], item["data"]["title"]))
			continue

		if item["data"]["itemType"] not in supported_types:
			print("{0}/{1}: {2} not a supported type ({3})."
						   .format(item_index + 1, n_items, item['key'], item["data"]["title"]))
			continue

		# item is good as far as we know
		to_save = {
			'version': item['version'],
			'title': item['data'].get('title', ''),
			'type': item['data']['itemType'],
			'zotero_key': item['key'],
			'is_featured': False,
			'date': item_date,
			'scraped_at': str(datetime.now()),
			'author': None,
			'image': None,
			'url': None
		}
		url = get_url_for_zotero_item(item)
		if url:
			to_save['url'] = url

		if item['data']['url'] and '://blog.esciencecenter.nl/' in item['data']['url']:
			(author, image) = get_blog_fields(item)
			if author is None:
				print("{0}/{1}: {2} cannot scrape the author from blog.esciencecenter.nl ({3})."
							.format(item_index + 1, n_items, item['key'], item['data']['url']))
				continue
			if image is None:
				print("{0}/{1}: {2} cannot scrape the image from blog.esciencecenter.nl ({3})."
							.format(item_index + 1, n_items, item['key'], item['data']['url']))
				continue

			to_save['is_featured'] = True
			to_save['author'] = author
			to_save['image'] = image

		print("{0}/{1}: {2} is going to be added to the mentions collection."
					.format(item_index + 1, n_items, item['key']))
		items_to_save.append(to_save)

	if len(items_to_save) > 0:
		print("Items to save: %s" % len(items_to_save))
		resp = requests.post(
			backend_url + '/mention?on_conflict=zotero_key',
			json=items_to_save,
			headers={'Authorization': 'Bearer %s' % jwt_token, 'Prefer': 'resolution=merge-duplicates'}
		)
		resp.raise_for_status()

	if by_key:
		ids_to_update_scraped_at = ",".join([k["id"] for k in keys_data])
		requests.patch(
			backend_url + '/mention?id=in.(' + ids_to_update_scraped_at + ')',
			json={'scraped_at': str(datetime.now())},
			headers={'Authorization': 'Bearer %s' % jwt_token}
		)

if __name__ == "__main__":
	print("Start scraping from Zotero")
	backend_url = os.environ.get('POSTGREST_URL')
	number_mentions_to_scrape = os.environ.get('MAX_REQUESTS_GITHUB', default='6')
	jwt_secret = os.environ.get('PGRST_JWT_SECRET')
	jwt_token = jwt.encode({"role": "rsd_admin", "exp": datetime.now() + timedelta(minutes = 10)}, jwt_secret, algorithm="HS256")
	zotero_library = os.environ.get('ZOTERO_LIBRARY')
	zotero_api_token = os.environ.get('ZOTERO_API_TOKEN')
	get_mentions()
	print("Done scraping from Zotero")
