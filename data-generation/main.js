// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {faker} from '@faker-js/faker';
import jwt from 'jsonwebtoken';

function generateMentions(amountExtra = 10) {
	const dois = [
		'10.1017/S0033291718004038',
		'10.1186/s12966-019-0834-1',
		'10.5334/dsj-2022-010',
		'10.1175/BAMS-D-19-0337.1',
		'10.5194/egusphere-egu21-4805',
		'10.5194/esd-12-253-2021',
		'10.5194/gmd-13-4205-2020',
		'10.1145/2996913.2997005',
		'10.1016/j.future.2018.08.004',
		'10.1515/itit-2019-0040',
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
		});
	}

	return result;
}

function generateSofware(amount=50) {
	const result = [];

	for (let index = 0; index < amount; index++) {
		const brandName = faker.helpers.unique(() =>
			'software: ' + faker.hacker.adjective() + ' ' + faker.hacker.noun() + ' ' + faker.helpers.replaceSymbolWithNumber('####')
		);
		result.push({
			slug: faker.helpers.slugify(brandName),
			brand_name: brandName,
			concept_doi: faker.helpers.replaceSymbols('10.*****/*****'),
			description: faker.lorem.paragraphs(4, '\n\n'),
			get_started_url: faker.internet.url(),
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
		'https://gitlab.com/inkscape/inkscape',
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
		const nummerOfMentions = faker.mersenne.rand(4, 0);
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

function generateProjects(amount=50) {
	const result = [];

	for (let index = 0; index < amount; index++) {
		const title = faker.helpers.unique(() =>
			'project: ' + faker.hacker.adjective() + ' ' + faker.hacker.noun()  + ' ' + faker.helpers.replaceSymbolWithNumber('####')
		);
		result.push({
			slug: faker.helpers.slugify(title),
			title: title,
			subtitle: faker.commerce.productDescription(),
			date_end: faker.date.future(2),
			date_start: faker.date.past(2),
			description: faker.lorem.paragraphs(5, '\n\n'),
			grant_id: faker.helpers.replaceSymbols('******'),
			image_caption: faker.animal.cat(),
			image_contain: !!faker.helpers.maybe(() => true, {probability: 0.5}),
			is_published: !!faker.helpers.maybe(() => true, {probability: 0.8}),
		});
	}

	return result;
}

async function generateContributors(ids, amount=100) {
	const base64Images = await downloadImagesAsBase64(faker.image.avatar, amount);

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
			avatar_data: base64Images[index],
			avatar_mime_type: 'image/jpeg',
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

async function generateImagesForProjects(ids) {
	const base64Images = await downloadImagesAsBase64(faker.image.cats, ids.length);

	const result = [];

	for (let index = 0; index < ids.length; index++) {
		if (base64Images[index] === null) continue;
		result.push({
			project: ids[index],
			data: base64Images[index],
			mime_type: 'image/jpeg',
		});
	}

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

function generateOrganisations(amount=50) {
	const result = [];

	for (let index = 0; index < amount; index++) {
		const name = faker.helpers.unique(() =>
			faker.company.name()
		);
		result.push({
			parent: null,
			primary_maintainer: null,
			slug: faker.helpers.slugify(name).toLowerCase().replaceAll(/-{2,}/g, '-'),
			name: name,
			ror_id: faker.helpers.replaceSymbols('https://ror.org/********'),
			website: faker.internet.url(),
			is_tenant: !!faker.helpers.maybe(() => true, {probability: 0.3}),
		});
	}

	return result;
}

async function generateLogosForOrganisations(ids) {
	const base64Images = await downloadImagesAsBase64(faker.image.business, ids.length);

	const result = [];

	for (let index = 0; index < ids.length; index++) {
		if (base64Images[index] === null) continue;
		result.push({
			organisation: ids[index],
			data: base64Images[index],
			mime_type: 'image/jpeg',
		});
	}

	return result;
}

function generateMetaPages() {
	const result = [];

	const titles = ['Terms of Service', 'Privacy Statement'];
	const slugs = ['tos', 'privacy'];
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
const headers = {'Content-Type': 'application/json', 'Authorization': 'bearer ' + token, 'Prefer': 'return=representation'}
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

async function downloadImagesAsBase64(urlGenerator, amount) {
	const imagePromises = [];
	const timeOuts = [];
	for (let index = 0; index < amount; index++) {
		const url = urlGenerator();
		imagePromises.push(
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
	return await Promise.all(imagePromises);
}

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
const softwarePromise = postToBackend('/software', generateSofware())
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
const projectPromise = postToBackend('/project', generateProjects())
	.then(resp => resp.json())
	.then(async pjArray => {
		idsProjects = pjArray.map(sw => sw['id']);
		postToBackend('/team_member', await generateTeamMembers(idsProjects));
		postToBackend('/image_for_project', await generateImagesForProjects(idsProjects));
		postToBackend('/url_for_project', generateUrlsForProjects(idsProjects));
		postToBackend('/keyword_for_project', generateKeywordsForEntity(idsProjects, idsKeywords, 'project'));
		postToBackend('/output_for_project', generateMentionsForEntity(idsProjects, idsMentions, 'project'));
		postToBackend('/impact_for_project', generateMentionsForEntity(idsProjects, idsMentions, 'project'));
		postToBackend('/research_domain_for_project', generateResearchDomainsForProjects(idsProjects, idsResearchDomains));
		postToBackend('/project_for_project', generateSoftwareForSoftware(idsProjects));
	});
const organisationPromise = postToBackend('/organisation', generateOrganisations())
	.then(resp => resp.json())
	.then(async orgArray => {
		idsOrganisations = orgArray.map(org => org['id']);
		postToBackend('/logo_for_organisation', await generateLogosForOrganisations(idsOrganisations));
	});
await postToBackend('/meta_pages', generateMetaPages()).then(() => console.log('meta pages done'));

await Promise.all([softwarePromise, projectPromise, organisationPromise]).then(() => console.log('sw, pg, org done'));

await postToBackend('/software_for_project', generateRelationsForDifferingEntities(idsSoftware, idsProjects, 'software', 'project')).then(() => console.log('sw-pj done'));
await postToBackend('/software_for_organisation', generateRelationsForDifferingEntities(idsSoftware, idsOrganisations, 'software', 'organisation')).then(() => console.log('sw-org done'));
await postToBackend('/project_for_organisation', generateProjectForOrganisation(idsProjects, idsOrganisations)).then(() => console.log('pj-org done'));

console.log('Done');
// This is unfortunately needed, because when using docker-compose, the node process might hang for a long time
process.exit(0);
