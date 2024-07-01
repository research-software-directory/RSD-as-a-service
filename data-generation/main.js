// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {faker} from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import {images, organisationLogos, softwareLogos} from './images.js';
import {conceptDois, dois, packageManagerLinks} from './real-data.js';
import fs from 'fs/promises';

const usedLowerCaseStrings = new Set();
function generateUniqueCaseInsensitiveString(randomStringGenerator) {
	for (let attempt = 0; attempt < 10000; attempt++) {
		const nextString = randomStringGenerator();
		if (usedLowerCaseStrings.has(nextString.toLowerCase())) continue;

		usedLowerCaseStrings.add(nextString.toLowerCase());
		return nextString;
	}
	throw 'Tried to generate a unique (ignoring case) string for 10000 times but failed to do so';
}

function generateMentions(amountExtra = 100) {
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
		'poster',
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
			authors: faker.helpers.maybe(() => faker.person.fullName(), 0.8) ?? null,
			publisher: faker.helpers.maybe(() => faker.company.name(), 0.8) ?? null,
			publication_year: faker.number.int({max: 2026, min: 2000}),
			journal: faker.helpers.maybe(() => faker.company.name(), 0.8) ?? null,
			page: faker.helpers.maybe(() => faker.number.int({max: 301, min: 0}), 0.1) ?? null,
			image_url: null,
			mention_type: faker.helpers.arrayElement(mentionTypes),
			source: 'faker',
			version: faker.helpers.maybe(() => faker.system.semver(), 0.8) ?? null,
			note: faker.helpers.maybe(() => faker.company.catchPhrase(), 0.3) ?? null,
		});
	}

	for (let index = 0; index < amountExtra; index++) {
		result.push({
			doi: null,
			url: faker.internet.url(),
			title: faker.music.songName(),
			authors: faker.helpers.maybe(() => faker.person.fullName(), 0.8) ?? null,
			publisher: faker.helpers.maybe(() => faker.company.name(), 0.8) ?? null,
			publication_year: faker.number.int({max: 2026, min: 2000}),
			journal: faker.helpers.maybe(() => faker.company.name(), 0.8) ?? null,
			page: faker.helpers.maybe(() => faker.number.int({max: 301, min: 0}), 0.1) ?? null,
			image_url: null,
			mention_type: faker.helpers.arrayElement(mentionTypes),
			source: 'faker',
			version: faker.helpers.maybe(() => faker.system.semver(), 0.8) ?? null,
			note: faker.helpers.maybe(() => faker.company.catchPhrase(), 0.3) ?? null,
		});
	}

	return result;
}

function generateSoftware(amount = 500) {
	// real software has a real concept DOI
	const amountRealSoftware = Math.min(conceptDois.length, amount);
	const brandNames = [];
	for (let index = 0; index < amountRealSoftware; index++) {
		const maxWords = faker.helpers.maybe(() => 5, {probability: 0.8}) ?? 31;
		const brandName = generateUniqueCaseInsensitiveString(() =>
			('Real software: ' + faker.word.words(faker.number.int({max: maxWords, min: 1}))).substring(0, 200),
		);
		brandNames.push(brandName);
	}

	const amountFakeSoftware = amount - amountRealSoftware;
	for (let index = 0; index < amountFakeSoftware; index++) {
		const maxWords = faker.helpers.maybe(() => 5, {probability: 0.8}) ?? 31;
		const brandName = generateUniqueCaseInsensitiveString(() =>
			('Software: ' + faker.word.words(faker.number.int({max: maxWords, min: 1}))).substring(0, 200),
		);
		brandNames.push(brandName);
	}

	const result = [];

	for (let index = 0; index < amount; index++) {
		result.push({
			slug: faker.helpers
				.slugify(brandNames[index])
				.toLowerCase()
				.replaceAll(/-{2,}/g, '-')
				.replaceAll(/-+$/g, ''), // removes double dashes and trailing dashes
			brand_name: brandNames[index],
			concept_doi: index < conceptDois.length ? conceptDois[index] : null,
			description: faker.lorem.paragraphs(4, '\n\n'),
			get_started_url: faker.internet.url(),
			image_id:
				faker.helpers.maybe(() => localSoftwareLogoIds[index % localSoftwareLogoIds.length], {
					probability: 0.8,
				}) ?? null,
			is_published: !!faker.helpers.maybe(() => true, {probability: 0.8}),
			short_statement: faker.commerce.productDescription(),
			closed_source: !!faker.helpers.maybe(() => true, {
				probability: 0.8,
			}),
		});
	}

	return result;
}

function generateTestimonials(ids) {
	const result = [];

	for (const id of ids) {
		// each software will get 0, 1 or 2 testimonials
		const numberOfTestimonials = faker.number.int({max: 3, min: 0});
		for (let index = 0; index < numberOfTestimonials; index++) {
			result.push({
				software: id,
				message: faker.hacker.phrase(),
				source: faker.person.fullName(),
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

function generatePackageManagers(softwareIds) {
	const result = [];

	for (let index = 0; index < softwareIds.length; index++) {
		// first assign each package manager entry to one software, then randomly assing package manager entries to the remaining ids
		const packageManagerLink =
			index < packageManagerLinks.length
				? packageManagerLinks[index]
				: faker.helpers.arrayElement(packageManagerLinks);

		result.push({
			software: softwareIds[index],
			url: packageManagerLink.url,
			package_manager: packageManagerLink.type,
		});
	}

	return result;
}

function generateLincensesForSoftware(ids) {
	const licenses = [
		{
			license: 'Apache-2.0',
			name: 'Apache License 2.0',
			reference: 'https://spdx.org/licenses/Apache-2.0.html',
		},
		{
			license: 'MIT',
			name: 'MIT License',
			reference: 'https://spdx.org/licenses/MIT.html',
		},
		{
			license: 'GPL-2.0-or-later',
			name: 'GNU General Public License v2.0 or later',
			reference: 'https://spdx.org/licenses/GPL-2.0-or-later.html',
		},
		{
			license: 'LGPL-2.0-or-later',
			name: 'GNU Library General Public License v2 or later',
			reference: 'https://spdx.org/licenses/LGPL-2.0-or-later.html',
		},
		{
			license: 'CC-BY-4.0',
			name: 'Creative Commons Attribution 4.0 International',
			reference: 'https://spdx.org/licenses/CC-BY-4.0.html',
		},
		{
			license: 'CC-BY-NC-ND-3.0',
			name: 'Creative Commons Attribution Non Commercial No Derivatives 3.0 Unported',
			reference: 'https://spdx.org/licenses/CC-BY-NC-ND-3.0.html',
		},
	];

	const result = [];

	for (const id of ids) {
		const nummerOfLicenses = faker.number.int({max: 3, min: 0});
		if (nummerOfLicenses === 0) continue;

		const licensesToAdd = faker.helpers.arrayElements(licenses, nummerOfLicenses);
		for (const item of licensesToAdd) {
			result.push({
				software: id,
				license: item.license,
				name: item.name,
				reference: item.reference,
			});
		}
	}

	return result;
}

function generateKeywordsForEntity(idsEntity, idsKeyword, nameEntity) {
	const result = [];

	for (const idEntity of idsEntity) {
		const nummerOfKeywords = faker.number.int({max: 3, min: 0});
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

async function generateCategories(idsCommunities, maxDepth = 3) {
	const communityPromises = [];
	for (const commId of idsCommunities) {
		communityPromises.push(generateAndSaveCategoriesForCommunity(commId, maxDepth));
	}
	communityPromises.push(generateAndSaveCategoriesForCommunity(null, maxDepth));

	return await Promise.all(communityPromises);
}

async function generateAndSaveCategoriesForCommunity(idCommunity, maxDepth) {
	return new Promise(async res => {
		let parentIds = [null];
		for (let level = 1; level <= maxDepth; level++) {
			const newParentIds = [];
			for (const parent of parentIds) {
				let toGenerateCount = faker.number.int(4);
				if (idCommunity === null && level === 1) {
					toGenerateCount += 1;
				}
				for (let i = 0; i < toGenerateCount; i++) {
					const name = `Parent ${parent}, level ${level}, item ${i + 1}`;
					const shortName = `Level ${level}, item ${i + 1}`;
					const body = {
						community: idCommunity,
						parent: parent,
						short_name: shortName,
						name: name,
					};
					await postToBackend('/category', body)
						.then(resp => resp.json())
						.then(json => json[0].id)
						.then(id => newParentIds.push(id));
				}
			}
			parentIds = newParentIds;
		}
		res();
	});
}

function generateMentionsForEntity(idsEntity, idsMention, nameEntity) {
	const result = [];

	for (const idEntity of idsEntity) {
		const nummerOfMentions = faker.number.int({max: 11, min: 0});
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
		const nummerOfKeywords = faker.number.int({max: 3, min: 0});
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
		const numberOfRelatedSoftware = faker.number.int({max: 5, min: 0});
		if (numberOfRelatedSoftware === 0) continue;

		const origin = ids[index];
		const idsWithoutOrigin = ids.filter(id => id !== origin);
		const idsRelation = faker.helpers.arrayElements(idsWithoutOrigin, numberOfRelatedSoftware);
		for (const relation of idsRelation) {
			result.push({
				origin: origin,
				relation: relation,
			});
		}
	}

	return result;
}

function generateSoftwareHighlights(ids) {
	const result = [];
	for (let index = 0; index < ids.length; index++) {
		const isHighlight = !!faker.helpers.maybe(() => true, {
			probability: 0.3,
		});
		if (isHighlight === true) result.push({software: ids[index]});
	}
	return result;
}

function generateProjects(amount = 500) {
	const result = [];

	const projectStatuses = ['finished', 'running', 'starting'];

	for (let index = 0; index < amount; index++) {
		const maxWords = faker.helpers.maybe(() => 5, {probability: 0.8}) ?? 31;
		const title = generateUniqueCaseInsensitiveString(() =>
			('Project: ' + faker.word.words(faker.number.int({max: maxWords, min: 1}))).substring(0, 200),
		);

		const status = faker.helpers.arrayElement(projectStatuses);
		let dateEnd, dateStart;
		switch (status) {
			case 'finished':
				dateEnd = faker.date.past({years: 2});
				dateStart = faker.date.past({years: 2, refDate: dateEnd});
				break;
			case 'running':
				dateEnd = faker.date.future({years: 2});
				dateStart = faker.date.past({years: 2});
				break;
			case 'starting':
				dateStart = faker.date.future({years: 2});
				dateEnd = faker.date.future({years: 2, refDate: dateStart});
				break;
		}

		result.push({
			slug: faker.helpers.slugify(title).toLowerCase().replaceAll(/-{2,}/g, '-').replaceAll(/-+$/g, ''), // removes double dashes and trailing dashes
			title: title,
			subtitle:
				faker.helpers.maybe(() => faker.commerce.productDescription(), {
					probability: 0.9,
				}) ?? null,
			date_end: faker.helpers.maybe(() => dateEnd, {probability: 0.9}) ?? null,
			date_start: faker.helpers.maybe(() => dateStart, {probability: 0.9}) ?? null,
			description: faker.lorem.paragraphs(5, '\n\n'),
			grant_id: faker.helpers.maybe(() => faker.helpers.replaceSymbols('******'), {probability: 0.8}) ?? null,
			image_caption: faker.animal.cat(),
			image_contain: !!faker.helpers.maybe(() => true, {
				probability: 0.5,
			}),
			image_id:
				faker.helpers.maybe(() => localImageIds[index % localImageIds.length], {probability: 0.8}) ?? null,
			is_published: !!faker.helpers.maybe(() => true, {probability: 0.8}),
		});
	}

	return result;
}

function generateOrcids(amount = 50) {
	const orcids = new Set();

	while (orcids.size < amount) {
		orcids.add(faker.helpers.replaceSymbolWithNumber('0000-000#-####-####'));
	}

	return [...orcids];
}

function generatePeopleWithOrcids(orcids, imageIds) {
	const result = [];

	for (const orcid of orcids) {
		result.push({
			email_address: faker.internet.email(),
			family_names: faker.person.lastName(),
			given_names: faker.person.firstName(),
			orcid: orcid,
			avatar_id: faker.helpers.arrayElement(imageIds),
		});
	}

	return result;
}

async function generateContributors(softwareIds, peopleWithOrcids, minPerSoftware = 0, maxPerSoftware = 15) {
	const result = [];

	for (const softwareId of softwareIds) {
		const amount = faker.number.int({
			max: maxPerSoftware,
			min: minPerSoftware,
		});
		const amountWithOrcid = faker.number.int({max: amount, min: 0});
		const amountWithoutOrcid = amount - amountWithOrcid;

		for (let i = 0; i < amountWithoutOrcid; i++) {
			result.push({
				software: softwareId,
				is_contact_person: !!faker.helpers.maybe(() => true, {
					probability: 0.2,
				}),
				email_address: faker.internet.email(),
				family_names: faker.person.lastName(),
				given_names: faker.person.firstName(),
				affiliation: faker.company.name(),
				role: faker.person.jobTitle(),
				orcid: null,
				avatar_id:
					faker.helpers.maybe(() => faker.helpers.arrayElement(localImageIds), {probability: 0.8}) ?? null,
			});
		}

		const randomPeopleWithOrcdid = faker.helpers.arrayElements(peopleWithOrcids, amountWithOrcid);

		for (const personWithOrcid of randomPeopleWithOrcdid) {
			result.push({
				...personWithOrcid,
				software: softwareId,
				is_contact_person: !!faker.helpers.maybe(() => true, {
					probability: 0.2,
				}),
				affiliation: faker.company.name(),
				role: faker.person.jobTitle(),
			});
		}
	}

	return result;
}

async function generateTeamMembers(projectIds, peopleWithOrcids, minPerProject = 0, maxPerProject = 15) {
	const result = await generateContributors(projectIds, peopleWithOrcids, minPerProject, maxPerProject);
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
		const numberOfUrls = faker.number.int({max: 3, min: 0});
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

function generateOrganisations(amount = 500) {
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
		const maxWords = faker.helpers.maybe(() => 5, {probability: 0.8}) ?? 31;
		const name = generateUniqueCaseInsensitiveString(() =>
			('Organisation: ' + faker.word.words(faker.number.int({max: maxWords, min: 1}))).substring(0, 200),
		);
		names.push(name);
	}

	const result = [];

	for (let index = 0; index < amount; index++) {
		result.push({
			parent: null,
			primary_maintainer: null,
			slug: faker.helpers.slugify(names[index]).toLowerCase().replaceAll(/-{2,}/g, '-').replaceAll(/-+$/g, ''), // removes double dashes and trailing dashes
			name: names[index],
			short_description:
				faker.helpers.maybe(() => faker.commerce.productDescription(), {
					probability: 0.8,
				}) ?? null,
			ror_id: index < rorIds.length ? rorIds[index] : null,
			website: faker.internet.url(),
			is_tenant: !!faker.helpers.maybe(() => true, {probability: 0.05}),
			country:
				faker.helpers.maybe(() => faker.location.country(), {
					probability: 0.8,
				}) ?? null,
			logo_id:
				faker.helpers.maybe(() => localOrganisationLogoIds[index % localOrganisationLogoIds.length], {
					probability: 0.8,
				}) ?? null,
		});
	}

	return result;
}

function generateCommunities(amount = 50) {
	const result = [];

	for (let index = 0; index < amount; index++) {
		const maxWords = faker.helpers.maybe(() => 5, {probability: 0.8}) ?? 31;
		const name = generateUniqueCaseInsensitiveString(() =>
			('Community: ' + faker.word.words(faker.number.int({max: maxWords, min: 1}))).substring(0, 200),
		);

		result.push({
			slug: faker.helpers.slugify(name).toLowerCase().replaceAll(/-{2,}/g, '-').replaceAll(/-+$/g, ''), // removes double dashes and trailing dashes
			name: name,
			short_description: faker.helpers.maybe(() => faker.lorem.paragraphs(1, '\n\n'), {probability: 0.8}) ?? null,
			description: faker.helpers.maybe(() => faker.lorem.paragraphs(1, '\n\n'), {probability: 0.8}) ?? null,
			logo_id:
				faker.helpers.maybe(() => localOrganisationLogoIds[index % localImageIds.length], {probability: 0.8}) ??
				null,
		});
	}

	return result;
}

function generateMetaPages() {
	const result = [];

	const titles = ['About', 'Terms of Service', 'Privacy Statement'];
	const slugs = ['about', 'terms-of-service', 'privacy-statement'];
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

function generateNews() {
	const entries = [
		{
			title: 'RSD released',
			slug: 'rsd-released',
		},
		{
			title: 'Some Big News',
			slug: 'some-big-news',
		},
		{
			title: 'You wont believe this!',
			slug: 'you-wont-believe-this',
		},
		{
			title: "The perfect software doesn't exi-",
			slug: 'the-prefect-software-doesnt-exi',
		},
		{
			title: "10 clickbait headlines you didn't know about!",
			slug: '10-clickbait-headlines',
		},
		{
			title: 'You will never use a dependency anymore after you know this...',
			slug: 'never-dependency',
		},
		{
			title: 'Sunsetting the RSD',
			slug: 'sunsetting-the-rsd',
		},
		{
			title: 'The last package you will ever need',
			slug: 'last-package',
		},
		{
			title: 'How to make your project a big success',
			slug: 'project-success',
		},
		{
			title: 'The 5 best dependencies you never heard about',
			slug: '5-best-dependencies',
		},
		{
			title: 'Rewriting the RSD in CrabLang',
			slug: 'rewrite-rsd-crablang',
		},
		{
			title: 'The RSD joins forces with Big Company (tm)',
			slug: 'rsd-joins-big-company',
		},
		{
			title: "3 features you didn't know about",
			slug: '3-features',
		},
		{
			title: 'Interview with RSD founders',
			slug: 'interview-rsd-founders',
		},
	];

	const result = [];
	for (const newsItem of entries) {
		result.push({
			slug: newsItem.slug,
			is_published: !!faker.helpers.maybe(() => true, {probability: 0.8}),
			publication_date: faker.date.anytime(),
			title: newsItem.title,
			author: faker.person.fullName(),
			summary: faker.lorem.paragraph(),
			description: faker.lorem.paragraphs(faker.number.int({max: 20, min: 3}), '\n\n'),
		});
	}

	return result;
}

function generateImagesForNews(newsIds, imageIds) {
	const result = [];

	for (const id of newsIds) {
		if (faker.datatype.boolean(0.2)) {
			continue;
		}

		result.push({
			news: id,
			image_id: faker.helpers.arrayElement(imageIds),
		});
	}

	return result;
}

function generateRelationsForDifferingEntities(
	idsOrigin,
	idsRelation,
	nameOrigin,
	nameRelation,
	maxRelationsPerOrigin = 11,
) {
	const result = [];

	for (const idOrigin of idsOrigin) {
		const numberOfIdsRelation = faker.number.int({
			max: maxRelationsPerOrigin,
			min: 0,
		});
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

function generateSoftwareForCommunity(idsSoftware, idsCommunities) {
	const result = generateRelationsForDifferingEntities(idsCommunities, idsSoftware, 'community', 'software');

	const statuses = [
		{weight: 1, value: 'pending'},
		{weight: 8, value: 'approved'},
		{weight: 1, value: 'rejected'},
	];
	result.forEach(entry => {
		entry['status'] = faker.helpers.weightedArrayElement(statuses);
	});

	return result;
}

function createJWT() {
	const secret = process.env.PGRST_JWT_SECRET;
	return jwt.sign({role: 'rsd_admin'}, secret, {expiresIn: '2m'});
}

const token = createJWT();
const headers = {
	'Content-Type': 'application/json',
	Authorization: 'bearer ' + token,
	Prefer: 'return=representation,resolution=ignore-duplicates',
};
const backendUrl = process.env.POSTGREST_URL || 'http://localhost/api/v1';

async function postToBackend(endpoint, body) {
	const response = await fetch(backendUrl + endpoint, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: headers,
	});
	if (!response.ok) {
		console.warn(
			'Warning: post request to ' +
				endpoint +
				' had status code ' +
				response.status +
				' and body ' +
				(await response.text()),
		);
	}
	return response;
}

async function getFromBackend(endpoint) {
	const response = await fetch(backendUrl + endpoint, {headers: headers});
	if (!response.ok) {
		console.warn(
			'Warning: post request to ' +
				endpoint +
				' had status code ' +
				response.status +
				' and body ' +
				(await response.text()),
		);
	}
	return response;
}

// returns the IDs of the images after they have been posted to the database
async function getLocalImageIds(fileNames) {
	const imageAsBase64Promises = [];
	for (let index = 0; index < fileNames.length; index++) {
		const fileName = fileNames[index];
		imageAsBase64Promises[index] = fs.readFile(fileName, {encoding: 'base64'}).then(base64 => {
			return {
				data: base64,
				mime_type: mimeTypeFromFileName(fileName),
			};
		});
	}
	const imagesAsBase64 = await Promise.all(imageAsBase64Promises);

	const resp = await postToBackend('/image?select=id', imagesAsBase64);
	const idsAsObjects = await resp.json();
	const ids = idsAsObjects.map(idAsObject => idAsObject.id);
	return ids;
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
					.then(resp => {
						clearTimeout(timeOuts[index]);
						return resp.arrayBuffer();
					})
					.then(ab => Buffer.from(ab))
					.then(bf => bf.toString('base64')),
				new Promise((res, rej) => (timeOuts[index] = setTimeout(res, 3000))).then(() => {
					console.warn('Timeout for ' + url + ', skipping');
					return null;
				}),
			]),
		);
	}
	const imagesAsBase64 = await Promise.all(imageAsBase64Promises);

	const imagesWithoutNulls = imagesAsBase64
		.filter(img => img !== null)
		.map(base64 => {
			return {data: base64, mime_type: 'image/jpeg'};
		});

	const resp = await postToBackend('/image?select=id', imagesWithoutNulls);
	const idsAsObjects = await resp.json();
	const ids = idsAsObjects.map(idAsObject => idAsObject.id);
	return ids;
}

async function postAccountsToBackend(amount = 100) {
	const accounts = [];
	for (let i = 0; i < amount; i++) {
		accounts.push({
			public_orcid_profile: !!faker.helpers.maybe(() => true, {
				probability: 0.8,
			}),
			agree_terms: !!faker.helpers.maybe(() => true, {probability: 0.8}),
			notice_privacy_statement: !!faker.helpers.maybe(() => true, {
				probability: 0.8,
			}),
		});
	}

	return postToBackend('/account', accounts);
}

// Generate one login_for_account per given account
function generateLoginForAccount(accountIds, orcids) {
	const homeOrganisations = [null];
	for (let i = 0; i < 10; i++) {
		homeOrganisations.push('Organisation for ' + faker.word.noun());
	}
	const providers = ['ipd1', 'idp2', 'idp3', 'ip4'];

	let orcidsAdded = 0;
	const login_for_accounts = [];
	accountIds.forEach(accountId => {
		let firstName = faker.person.firstName();
		let givenName = faker.person.lastName();

		if (orcidsAdded < orcids.length) {
			const orcid = orcids[orcidsAdded];
			orcidsAdded += 1;
			login_for_accounts.push({
				account: accountId,
				name: firstName + ' ' + givenName,
				email: faker.internet.email({
					firstName: firstName,
					lastName: givenName,
				}),
				sub: orcid,
				provider: 'orcid',
				home_organisation: faker.helpers.arrayElement(homeOrganisations),
				last_login_date:
					faker.helpers.maybe(() => faker.date.past({years: 3}), {
						probability: 0.8,
					}) ?? null,
			});
		} else {
			login_for_accounts.push({
				account: accountId,
				name: firstName + ' ' + givenName,
				email: faker.internet.email({
					firstName: firstName,
					lastName: givenName,
				}),
				sub: faker.string.alphanumeric(30),
				provider: faker.helpers.arrayElement(providers),
				home_organisation: faker.helpers.arrayElement(homeOrganisations),
				last_login_date:
					faker.helpers.maybe(() => faker.date.past({years: 3}), {
						probability: 0.8,
					}) ?? null,
			});
		}
	});
	return login_for_accounts;
}

// start of running code, main
const orcids = generateOrcids();
const localImageIds = await getLocalImageIds(images);
const peopleWithOrcid = generatePeopleWithOrcids(orcids, localImageIds);

await postAccountsToBackend(100)
	.then(() => getFromBackend('/account'))
	.then(res => res.json())
	.then(jsonAccounts => jsonAccounts.map(a => a.id))
	.then(async accountIds => postToBackend('/login_for_account', generateLoginForAccount(accountIds, orcids)))
	.then(() => console.log('accounts, login_for_accounts done'));

const localOrganisationLogoIds = await getLocalImageIds(organisationLogos);
const localSoftwareLogoIds = await getLocalImageIds(softwareLogos);

let idsMentions, idsKeywords, idsResearchDomains;
const mentionsPromise = postToBackend('/mention', generateMentions())
	.then(() => getFromBackend('/mention?select=id'))
	.then(res => res.json())
	.then(jsonMentions => (idsMentions = jsonMentions.map(element => element.id)));
const keywordPromise = getFromBackend('/keyword?select=id')
	.then(res => res.json())
	.then(jsonKeywords => (idsKeywords = jsonKeywords.map(element => element.id)));
const researchDomainsPromise = getFromBackend('/research_domain?select=id')
	.then(res => res.json())
	.then(jsonResearchDomains => (idsResearchDomains = jsonResearchDomains.map(element => element.id)));

await Promise.all([mentionsPromise, keywordPromise, researchDomainsPromise]).then(() =>
	console.log('mentions, keywords, research domains done'),
);

let idsSoftware, idsFakeSoftware, idsRealSoftware, idsProjects, idsOrganisations, idsCommunities;
const softwarePromise = postToBackend('/software', generateSoftware())
	.then(resp => resp.json())
	.then(async swArray => {
		idsSoftware = swArray.map(sw => sw['id']);
		idsFakeSoftware = swArray.filter(sw => sw['brand_name'].startsWith('Software')).map(sw => sw['id']);
		idsRealSoftware = swArray.filter(sw => sw['brand_name'].startsWith('Real software')).map(sw => sw['id']);
		postToBackend('/contributor', await generateContributors(idsSoftware, peopleWithOrcid));
		postToBackend('/testimonial', generateTestimonials(idsSoftware));
		postToBackend('/repository_url', generateRepositoryUrls(idsSoftware));
		postToBackend('/package_manager', generatePackageManagers(idsRealSoftware));
		postToBackend('/license_for_software', generateLincensesForSoftware(idsSoftware));
		postToBackend('/keyword_for_software', generateKeywordsForEntity(idsSoftware, idsKeywords, 'software'));
		postToBackend('/mention_for_software', generateMentionsForEntity(idsSoftware, idsMentions, 'software'));
		postToBackend('/software_for_software', generateSoftwareForSoftware(idsSoftware));
		postToBackend('/software_highlight', generateSoftwareHighlights(idsSoftware.slice(0, 10)));
	});
const projectPromise = postToBackend('/project', generateProjects())
	.then(resp => resp.json())
	.then(async pjArray => {
		idsProjects = pjArray.map(sw => sw['id']);
		postToBackend('/team_member', await generateTeamMembers(idsProjects, peopleWithOrcid));
		postToBackend('/url_for_project', generateUrlsForProjects(idsProjects));
		postToBackend('/keyword_for_project', generateKeywordsForEntity(idsProjects, idsKeywords, 'project'));
		postToBackend('/output_for_project', generateMentionsForEntity(idsProjects, idsMentions, 'project'));
		postToBackend('/impact_for_project', generateMentionsForEntity(idsProjects, idsMentions, 'project'));
		postToBackend(
			'/research_domain_for_project',
			generateResearchDomainsForProjects(idsProjects, idsResearchDomains),
		);
		postToBackend('/project_for_project', generateSoftwareForSoftware(idsProjects));
	});
const organisationPromise = postToBackend('/organisation', generateOrganisations())
	.then(resp => resp.json())
	.then(async orgArray => {
		idsOrganisations = orgArray.map(org => org['id']);
	});

const communityPromise = postToBackend('/community', generateCommunities())
	.then(resp => resp.json())
	.then(async commArray => {
		idsCommunities = commArray.map(comm => comm['id']);
		postToBackend('/keyword_for_community', generateKeywordsForEntity(idsCommunities, idsKeywords, 'community'));
		generateCategories(idsCommunities);
	});

await postToBackend('/meta_pages', generateMetaPages()).then(() => console.log('meta pages done'));
await postToBackend('/news?select=id', generateNews())
	.then(() => getFromBackend('/news'))
	.then(res => res.json())
	.then(jsonNewsIds => jsonNewsIds.map(news => news.id))
	.then(newsIds => postToBackend('/image_for_news', generateImagesForNews(newsIds, localImageIds)))
	.then(() => console.log('news done'));

await Promise.all([softwarePromise, projectPromise, organisationPromise, communityPromise]).then(() =>
	console.log('sw, pj, org, comm done'),
);

await postToBackend(
	'/software_for_project',
	generateRelationsForDifferingEntities(idsSoftware, idsProjects, 'software', 'project'),
).then(() => console.log('sw-pj done'));
await postToBackend(
	'/software_for_organisation',
	generateRelationsForDifferingEntities(idsSoftware, idsOrganisations, 'software', 'organisation'),
).then(() => console.log('sw-org done'));
await postToBackend('/project_for_organisation', generateProjectForOrganisation(idsProjects, idsOrganisations)).then(
	() => console.log('pj-org done'),
);
await postToBackend('/software_for_community', generateSoftwareForCommunity(idsSoftware, idsCommunities)).then(() =>
	console.log('sw-comm done'),
);
await postToBackend(
	'/release',
	idsSoftware.map(id => ({software: id})),
)
	.then(() =>
		postToBackend(
			'/release_version',
			generateRelationsForDifferingEntities(idsFakeSoftware, idsMentions, 'release_id', 'mention_id', 100),
		),
	)
	.then(() => console.log('releases done'));

console.log('Done');
// This is unfortunately needed, because when using docker compose, the node process might hang for a long time
process.exit(0);
