// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {faker} from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import images from './images.js';
import fs from 'fs/promises';


function generateMentions(amountExtra = 10) {
	const dois = [
		'10.1007/978-3-030-55874-1_30',
		'10.1016/j.future.2018.08.004',
		'10.1017/9781009085809',
		'10.1017/S0033291718004038',
		'10.1017/S1368980018001258',
		'10.1029/2018MS001600',
		'10.1109/eScience.2016.7870925',
		'10.1145/2996913.2997005',
		'10.1175/BAMS-D-19-0337.1',
		'10.1186/s12966-019-0834-1',
		'10.1515/itit-2019-0040',
		'10.4233/uuid:4bb38399-9267-428f-b10a-80b86e101f23',
		'10.5194/egusphere-egu21-4805',
		'10.5194/ems2022-105',
		'10.5194/esd-12-253-2021',
		'10.5194/gmd-13-4205-2020',
		'10.5281/zenodo.1149011',
		'10.5281/zenodo.4075237',
		'10.5281/zenodo.5748141',
		'10.5334/dsj-2022-010',
	];

	const mentionTypes = [
		'blogPost',
		'book',
		'bookSection',
		'computerProgram',
		'conferencePaper',
		'dataset',
		'interview',
		'highlight',
		'journalArticle',
		'magazineArticle',
		'newspaperArticle',
		'presentation',
		'report',
		'thesis',
		'videoRecording',
		'webpage',
		'workshop',
		'other',
	];

	const result = [];

	// first use up all the DOIs, then generate random mentions without DOI
	for (const doi of dois) {
		result.push({
			doi: doi,
			url: 'https://doi.org/' + doi,
			title: faker.music.songName(),
			authors: faker.name.fullName,
			publisher: faker.company.name(),
			publication_year: faker.mersenne.rand(2026, 2000),
			page: faker.helpers.maybe(() => faker.mersenne.rand(301, 0), 0.1) ?? null,
			image_url: null,
			mention_type: faker.helpers.arrayElement(mentionTypes),
			source: 'faker',
			note: faker.helpers.maybe(() => faker.company.catchPhrase(), 0.3) ?? null
		});
	}

	for (let index = 0; index < amountExtra; index++) {
		result.push({
			doi: null,
			url: faker.internet.url(),
			title: faker.music.songName(),
			authors: faker.name.fullName,
			publisher: faker.company.name(),
			publication_year: faker.mersenne.rand(2026, 2000),
			page: faker.helpers.maybe(() => faker.mersenne.rand(301, 0), 0.1) ?? null,
			image_url: null,
			mention_type: faker.helpers.arrayElement(mentionTypes),
			source: 'faker',
			note: faker.helpers.maybe(() => faker.company.catchPhrase(), 0.3) ?? null
		});
	}

	return result;
}

async function generateSofware(amount=50) {
	const conceptDois = [
		'10.5281/zenodo.1034002',
		'10.5281/zenodo.1043306',
		'10.5281/zenodo.1043937',
		'10.5281/zenodo.1045122',
		'10.5281/zenodo.1045193',
		'10.5281/zenodo.1051033',
		'10.5281/zenodo.1051039',
		'10.5281/zenodo.1051130',
		'10.5281/zenodo.1064391',
		'10.5281/zenodo.1083950',
		'10.5281/zenodo.1145886',
		'10.5281/zenodo.1149010',
		'10.5281/zenodo.1162057',
		'10.5281/zenodo.1435860',
		'10.5281/zenodo.1436372',
		'10.5281/zenodo.1436464',
		'10.5281/zenodo.1462264',
		'10.5281/zenodo.3234136',
		'10.5281/zenodo.4050179',
		'10.5281/zenodo.47756',
		'10.5281/zenodo.594525',
		'10.5281/zenodo.594559',
		'10.5281/zenodo.594690',
		'10.5281/zenodo.596839',
		'10.5281/zenodo.597226',
		'10.5281/zenodo.597238',
		'10.5281/zenodo.597262',
		'10.5281/zenodo.597793',
		'10.5281/zenodo.597984',
		'10.5281/zenodo.598013',
		'10.5281/zenodo.598204',
		'10.5281/zenodo.60031',
		'10.5281/zenodo.6532349',
		'10.5281/zenodo.832894',
		'10.5281/zenodo.909307',
		'10.5281/zenodo.910447',
		'10.5281/zenodo.910905',
		'10.5281/zenodo.926819',
		'10.5281/zenodo.997272',
		'10.5281/zenodo.997332',
	];

	const brandNames = [];
	for (let index = 0; index < amount; index++) {
		const brandName = faker.helpers.unique(() =>
			('Software: ' + faker.random.words(faker.mersenne.rand(31, 1))).substring(0, 200)
		);
		brandNames.push(brandName);
	}

	const result = [];

	for (let index = 0; index < amount; index++) {
		result.push({
			slug: faker.helpers.slugify(brandNames[index]).toLowerCase().replaceAll(/-{2,}/g, '-').replaceAll(/-+$/g, ''),
			brand_name: brandNames[index],
			concept_doi: index < conceptDois.length ? conceptDois[index] : null,
			description: faker.lorem.paragraphs(4, '\n\n'),
			get_started_url: faker.internet.url(),
			image_id: localImageIds[index%localImageIds.length],
			is_published: !!faker.helpers.maybe(() => true, {probability: 0.8}),
			short_statement: faker.commerce.productDescription()
		});
	}

	return result;
}

function generateTestimonials(ids) {
	const result = [];

	for (const id of ids) {
		// each software will get 0, 1 or 2 testimonials
		const numberOfTestimonials = faker.mersenne.rand(3,0);
		for (let index = 0; index < numberOfTestimonials; index++) {
			result.push({
				software: id,
				message: faker.hacker.phrase(),
				source: faker.name.fullName(),
			});
		}
	}

	return result;
}

function generateRepositoryUrls(ids) {
	const githubUrls = [
		'https://github.com/research-software-directory/RSD-as-a-service',
		'https://github.com/wadpac/GGIR',
		'https://github.com/ESMValGroup/ESMValTool',
		'https://github.com/ESMValGroup/ESMValCore',
		'https://github.com/benvanwerkhoven/kernel_tuner',
		'https://github.com/NLeSC/pattyvis',
	];

	const gitlabUrls = [
		'https://gitlab.com/dwt1/dotfiles',
		'https://gitlab.com/famedly/fluffychat',
		'https://gitlab.com/gitlab-org/gitlab-shell',
		'https://gitlab.com/cerfacs/batman',
		'https://gitlab.com/cyber5k/mistborn',
	];

	const repoUrls = githubUrls.concat(gitlabUrls);

	const result = [];

	for (let index = 0; index < ids.length; index++) {
		if (!!faker.helpers.maybe(() => true, {probability: 0.25})) continue;

		const repoUrl = faker.helpers.arrayElement(repoUrls);
		const codePlatform = repoUrl.startsWith('https://github.com') ? 'github' : 'gitlab';
		result.push({
			software: ids[index],
			url: repoUrl,
			code_platform: codePlatform,
		});
	}

	return result;
}

function generateLincensesForSoftware(ids) {
	const licenses = [
		'Apache-2.0',
		'MIT',
		'GPL-2.0-or-later',
		'LGPL-2.0-or-later',
		'CC-BY-4.0',
		'CC-BY-NC-ND-3.0',
	];

	const result = [];

	for (const id of ids) {
		const nummerOfLicenses = faker.mersenne.rand(3, 0);
		if (nummerOfLicenses === 0) continue;

		const licensesToAdd = faker.helpers.arrayElements(licenses, nummerOfLicenses);
		for (const license of licensesToAdd) {
			result.push({
				software: id,
				license: license,
			});
		}
	}

	return result;
}

function generateKeywordsForEntity(idsEntity, idsKeyword, nameEntity) {
	const result = [];

	for (const idEntity of idsEntity) {
		const nummerOfKeywords = faker.mersenne.rand(3, 0);
		if (nummerOfKeywords === 0) continue;

		const keywordIdsToAdd = faker.helpers.arrayElements(idsKeyword, nummerOfKeywords);
		for (const keywordId of keywordIdsToAdd) {
			result.push({
				[nameEntity]: idEntity,
				keyword: keywordId,
			});
		}
	}

	return result;
}

function generateMentionsForEntity(idsEntity, idsMention, nameEntity) {
	const result = [];

	for (const idEntity of idsEntity) {
		const nummerOfMentions = faker.mersenne.rand(11, 0);
		if (nummerOfMentions === 0) continue;

		const mentionIdsToAdd = faker.helpers.arrayElements(idsMention, nummerOfMentions);
		for (const mentionId of mentionIdsToAdd) {
			result.push({
				[nameEntity]: idEntity,
				mention: mentionId,
			});
		}
	}

	return result;
}

function generateResearchDomainsForProjects(idsProject, idsResearchDomain) {
	const result = [];

	for (const idProject of idsProject) {
		const nummerOfKeywords = faker.mersenne.rand(3, 0);
		if (nummerOfKeywords === 0) continue;

		const researchDomainIdsToAdd = faker.helpers.arrayElements(idsResearchDomain, nummerOfKeywords);
		for (const researchDomainId of researchDomainIdsToAdd) {
			result.push({
				project: idProject,
				research_domain: researchDomainId,
			});
		}
	}

	return result;
}

function generateSoftwareForSoftware(ids) {
	const result = [];

	for (let index = 0; index < ids.length; index++) {
		const numberOfRelatedSoftware = faker.mersenne.rand(5, 0);
		if (numberOfRelatedSoftware === 0) continue;
 
		const origin = ids[index];
		const idsWithoutOrigin = ids.filter(id => id !== origin);
		const idsRelation = faker.helpers.arrayElements(idsWithoutOrigin, numberOfRelatedSoftware);
		for (const relation of idsRelation) {
			result.push({
				origin: origin,
				relation: relation,
			})
		}
	}

	return result;
}

async function generateProjects(amount=50) {
	const result = [];

	const projectStatuses = ['finished', 'running', 'starting'];

	for (let index = 0; index < amount; index++) {
		const title = faker.helpers.unique(() =>
			('Project: ' + faker.random.words(faker.mersenne.rand(31, 1))).substring(0, 200)
		);

		const status = faker.helpers.arrayElement(projectStatuses);
		let dateEnd, dateStart;
		switch (status) {
			case 'finished':
				dateEnd = faker.date.past(2);
				dateStart = faker.date.past(2, dateEnd);
				break;
			case 'running':
				dateEnd = faker.date.future(2);
				dateStart = faker.date.past(2);
				break;
			case 'starting':
				dateStart = faker.date.future(2);
				dateEnd = faker.date.future(2, dateStart);
				break;
		}

		result.push({
			slug: faker.helpers.slugify(title).toLowerCase().replaceAll(/-{2,}/g, '-').replaceAll(/-+$/g, ''),
			title: title,
			subtitle: faker.commerce.productDescription(),
			date_end: dateEnd,
			date_start: dateStart,
			description: faker.lorem.paragraphs(5, '\n\n'),
			grant_id: faker.helpers.replaceSymbols('******'),
			image_caption: faker.animal.cat(),
			image_contain: !!faker.helpers.maybe(() => true, {probability: 0.5}),
			image_id: localImageIds[index%localImageIds.length],
			is_published: !!faker.helpers.maybe(() => true, {probability: 0.8}),
		});
	}

	return result;
}

async function generateContributors(ids, amount=100) {
	const result = [];

	for (let index = 0; index < amount; index++) {
		result.push({
			software: faker.helpers.arrayElement(ids),
			is_contact_person: !!faker.helpers.maybe(() => true, {probability: 0.2}),
			email_address: faker.internet.email(),
			family_names: faker.name.lastName(),
			given_names: faker.name.firstName(),
			affiliation: faker.company.name(),
			role: faker.name.jobTitle(),
			orcid: faker.helpers.replaceSymbolWithNumber('####-####-####-####'),
			avatar_id: localImageIds[index%localImageIds.length],
		});
	}

	return result;
}

async function generateTeamMembers(ids, amount=100) {
	const result = await generateContributors(ids, amount);
	result.forEach(contributor => {
		contributor['project'] = contributor['software'];
		delete contributor['software'];
	});
	return result;
}

function generateUrlsForProjects(ids) {
	const result = [];

	for (const id of ids) {
		// each project will get 0, 1 or 2 URLs
		const numberOfUrls = faker.mersenne.rand(3,0);
		for (let index = 0; index < numberOfUrls; index++) {
			result.push({
				project: id,
				title: faker.commerce.product(),
				url: faker.internet.url(),
			});
		}
	}

	return result;
}

async function generateOrganisations(amount=50) {
	const rorIds = [
		'https://ror.org/000k1q888',
		'https://ror.org/006hf6230',
		'https://ror.org/008pnp284',
		'https://ror.org/00f9tz983',
		'https://ror.org/00x7ekv49',
		'https://ror.org/00za53h95',
		'https://ror.org/012p63287',
		'https://ror.org/01460j859',
		'https://ror.org/014w0fd65',
		'https://ror.org/016xsfp80',
		'https://ror.org/018dfmf50',
		'https://ror.org/01bnjb948',
		'https://ror.org/01deh9c76',
		'https://ror.org/01hcx6992',
		'https://ror.org/01k0v6g02',
		'https://ror.org/01ryk1543',
		'https://ror.org/027bh9e22',
		'https://ror.org/02e2c7k09',
		'https://ror.org/02e7b5302',
		'https://ror.org/02en5vm52',
		'https://ror.org/02jx3x895',
		'https://ror.org/02jz4aj89',
		'https://ror.org/02w4jbg70',
		'https://ror.org/030a5r161',
		'https://ror.org/031m0hs53',
		'https://ror.org/041kmwe10',
		'https://ror.org/04bdffz58',
		'https://ror.org/04dkp9463',
		'https://ror.org/04njjy449',
		'https://ror.org/04qw24q55',
		'https://ror.org/04s2z4291',
		'https://ror.org/04x6kq749',
		'https://ror.org/052578691',
		'https://ror.org/054hq4w78',
		'https://ror.org/055d8gs64',
		'https://ror.org/05dfgh554',
		'https://ror.org/05jxfge78',
		'https://ror.org/05kaxyq51',
		'https://ror.org/05v6zeb66',
		'https://ror.org/05xvt9f17',
	];

	const names = [];
	for (let index = 0; index < amount; index++) {
		const name = faker.helpers.unique(() =>
			('Organisation: ' + faker.random.words(faker.mersenne.rand(31, 1))).substring(0, 200)
		);
		names.push(name);
	}

	const result = [];

	for (let index = 0; index < amount; index++) {
		result.push({
			parent: null,
			primary_maintainer: null,
			slug: faker.helpers.slugify(names[index]).toLowerCase().replaceAll(/-{2,}/g, '-').replaceAll(/-+$/g, ''),
			name: names[index],
			ror_id: index < rorIds.length ? rorIds[index] : null,
			website: faker.internet.url(),
			is_tenant: !!faker.helpers.maybe(() => true, {probability: 0.3}),
			logo_id: localImageIds[index%localImageIds.length],
		});
	}

	return result;
}

function generateMetaPages() {
	const result = [];

	const titles = ['Terms of Service', 'Privacy Statement'];
	const slugs = ['terms-of-service', 'privacy-statement'];
	for (let index = 0; index < titles.length; index++) {
		result.push({
			title: titles[index],
			slug: slugs[index],
			description: faker.lorem.paragraphs(10, '\n\n'),
			is_published: true,
			position: index + 1,
		});
	}

	return result;
}

function generateRelationsForDifferingEntities(idsOrigin, idsRelation, nameOrigin, nameRelation) {
	const result = [];

	for (const idOrigin of idsOrigin) {
		const numberOfIdsRelation = faker.mersenne.rand(5,0);
		const relationsToAdd = faker.helpers.arrayElements(idsRelation, numberOfIdsRelation);
		for (const idRelation of relationsToAdd) {
			result.push({
				[nameOrigin]: idOrigin,
				[nameRelation]: idRelation,
			});
		}
	}

	return result;
}

function generateProjectForOrganisation(idsProjects, idsOrganisations) {
	const result = generateRelationsForDifferingEntities(idsProjects, idsOrganisations, 'project', 'organisation');

	const roles = ['funding', 'hosting', 'participating'];
	result.forEach(entry => {
		entry['role'] = faker.helpers.arrayElement(roles);
	});

	return result;
}

function createJWT() {
	const secret = process.env.PGRST_JWT_SECRET;
	return jwt.sign({ 'role': 'rsd_admin' }, secret, {expiresIn: '2m'});
}

const token = createJWT();
const headers = {
		'Content-Type': 'application/json',
		'Authorization': 'bearer ' + token,
		'Prefer': 'return=representation,resolution=ignore-duplicates'
	}
const backendUrl = process.env.POSTGREST_URL || 'http://localhost/api/v1';

async function postToBackend(endpoint, body) {
	const response = await fetch(backendUrl + endpoint, {method: 'POST', body: JSON.stringify(body), headers: headers});
	if(!response.ok) {
		console.warn('Warning: post request to ' + endpoint + ' had status code ' + response.status + ' and body ' + await response.text());
	}
	return response;
}

async function getFromBackend(endpoint) {
	const response = await fetch(backendUrl + endpoint, {headers: headers});
	if(!response.ok) {
		console.warn('Warning: post request to ' + endpoint + ' had status code ' + response.status + ' and body ' + await response.text());
	}
	return response;
}

// returns the IDs of the images after they have been posted to the database
async function getLocalImageIds(fileNames) {
	const imageAsBase64Promises = [];
	for (let index = 0; index < fileNames.length; index++) {
		const fileName = fileNames[index];
		imageAsBase64Promises[index] = fs.readFile(fileName, {encoding: 'base64'})
			.then(base64 => {return {data: base64, mime_type: mimeTypeFromFileName(fileName)}});
	}
	const imagesAsBase64 = await Promise.all(imageAsBase64Promises);

	const resp = await postToBackend('/image?select=id', imagesAsBase64);
	const idsAsObjects = await resp.json();
	const ids = idsAsObjects.map(idAsObject => idAsObject.id);
	return ids
}

function mimeTypeFromFileName(fileName) {
	if (fileName.endsWith('.png')) {
		return 'image/png';
	} else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
		return 'image/jpg';
	} else if (fileName.endsWith('.svg')) {
		return 'image/svg+xml';
	} else return null;
}

// returns the IDs of the images after they have been posted to the database
async function downloadAndGetImages(urlGenerator, amount) {
	const imageAsBase64Promises = [];
	const timeOuts = [];
	for (let index = 0; index < amount; index++) {
		const url = urlGenerator();
		imageAsBase64Promises.push(
			Promise.race([
				fetch(url)
					.then(resp => {clearTimeout(timeOuts[index]); return resp.arrayBuffer()})
					.then(ab => Buffer.from(ab))
					.then(bf => bf.toString('base64')),
				new Promise((res, rej) => timeOuts[index] = setTimeout(res, 3000))
					.then(() => {console.warn('Timeout for ' + url + ', skipping'); return null;})
			])
		);
	}
	const imagesAsBase64 = await Promise.all(imageAsBase64Promises);

	const imagesWithoutNulls = imagesAsBase64
		.filter(img => img !== null)
		.map(base64 => {return {data: base64, mime_type: 'image/jpeg'}});

	const resp = await postToBackend('/image?select=id', imagesWithoutNulls);
	const idsAsObjects = await resp.json();
	const ids = idsAsObjects.map(idAsObject => idAsObject.id);
	return ids
}

const localImageIds = await getLocalImageIds(images);

let idsMentions, idsKeywords, idsResearchDomains;
const mentionsPromise = postToBackend('/mention', generateMentions())
	.then(() => getFromBackend('/mention?select=id'))
	.then(res => res.json())
	.then(jsonMentions => idsMentions = jsonMentions.map(element => element.id));
const keywordPromise = getFromBackend('/keyword?select=id')
	.then(res => res.json())
	.then(jsonKeywords => idsKeywords = jsonKeywords.map(element => element.id));
const researchDomainsPromise = await getFromBackend('/research_domain?select=id')
	.then(res => res.json())
	.then(jsonResearchDomains => idsResearchDomains = jsonResearchDomains.map(element => element.id));

await Promise.all([mentionsPromise, keywordPromise, researchDomainsPromise])
	.then(() => console.log('mentions, keywords, research domains done'));

let idsSoftware, idsProjects, idsOrganisations;
const softwarePromise = postToBackend('/software', await generateSofware())
	.then(resp => resp.json())
	.then(async swArray => {
		idsSoftware = swArray.map(sw => sw['id']);
		postToBackend('/contributor', await generateContributors(idsSoftware));
		postToBackend('/testimonial', generateTestimonials(idsSoftware));
		postToBackend('/repository_url', generateRepositoryUrls(idsSoftware));
		postToBackend('/license_for_software', generateLincensesForSoftware(idsSoftware));
		postToBackend('/keyword_for_software', generateKeywordsForEntity(idsSoftware, idsKeywords, 'software'));
		postToBackend('/mention_for_software', generateMentionsForEntity(idsSoftware, idsMentions, 'software'));
		postToBackend('/software_for_software', generateSoftwareForSoftware(idsSoftware));
	});
const projectPromise = postToBackend('/project', await generateProjects())
	.then(resp => resp.json())
	.then(async pjArray => {
		idsProjects = pjArray.map(sw => sw['id']);
		postToBackend('/team_member', await generateTeamMembers(idsProjects));
		postToBackend('/url_for_project', generateUrlsForProjects(idsProjects));
		postToBackend('/keyword_for_project', generateKeywordsForEntity(idsProjects, idsKeywords, 'project'));
		postToBackend('/output_for_project', generateMentionsForEntity(idsProjects, idsMentions, 'project'));
		postToBackend('/impact_for_project', generateMentionsForEntity(idsProjects, idsMentions, 'project'));
		postToBackend('/research_domain_for_project', generateResearchDomainsForProjects(idsProjects, idsResearchDomains));
		postToBackend('/project_for_project', generateSoftwareForSoftware(idsProjects));
	});
const organisationPromise = postToBackend('/organisation', await generateOrganisations())
	.then(resp => resp.json())
	.then(async orgArray => {
		idsOrganisations = orgArray.map(org => org['id']);
	});
await postToBackend('/meta_pages', generateMetaPages()).then(() => console.log('meta pages done'));

await Promise.all([softwarePromise, projectPromise, organisationPromise]).then(() => console.log('sw, pg, org done'));

await postToBackend('/software_for_project', generateRelationsForDifferingEntities(idsSoftware, idsProjects, 'software', 'project')).then(() => console.log('sw-pj done'));
await postToBackend('/software_for_organisation', generateRelationsForDifferingEntities(idsSoftware, idsOrganisations, 'software', 'organisation')).then(() => console.log('sw-org done'));
await postToBackend('/project_for_organisation', generateProjectForOrganisation(idsProjects, idsOrganisations)).then(() => console.log('pj-org done'));

console.log('Done');
// This is unfortunately needed, because when using docker-compose, the node process might hang for a long time
process.exit(0);
