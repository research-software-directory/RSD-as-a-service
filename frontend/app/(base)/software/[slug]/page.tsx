import {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {headers} from 'next/headers'

import {app} from '~/config/app'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {CategoryPath} from '~/types/Category'
import {getAccountFromToken} from '~/auth/jwtUtils'
import {getCommunitiesOfMaintainer} from '~/auth/permissions/isMaintainerOfCommunity'
import {getMaintainerOrganisations} from '~/auth/permissions/isMaintainerOfOrganisation'
import isMaintainerOfSoftware from '~/auth/permissions/isMaintainerOfSoftware'
import {getDisplayName} from '~/utils/getDisplayName'
import {getImageUrl} from '~/utils/editImage'
import {getMentionsBySoftware} from '~/components/mention/apiEditMentions'
import {getRelatedSoftwareForSoftware} from '~/components/software/edit/related-software/apiRelatedSoftware'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {categoryFilter} from '~/components/category/apiCategories'
import DarkThemeSection from '~/components/layout/DarkThemeSection'
import EditPageButton from '~/components/layout/EditPageButton'
import MentionsSection from '~/components/mention/MentionsSection'
import {getParticipatingOrganisations} from '~/components/organisation/apiEditOrganisation'
import RelatedProjectsSection from '~/components/projects/RelatedProjectsSection'
import AboutSection from '~/components/software/AboutSection'
import {
  getCategoriesForSoftware, getCommunitiesOfSoftware,
  getKeywordsForSoftware, getLicenseForSoftware,
  getRelatedProjectsForSoftware, getReleasesForSoftware,
  getRemoteMarkdown, getSoftwareItem
} from '~/components/software/apiSoftware'
import CategoriesSection from '~/components/software/CategoriesSection'
import CitationSection from '~/components/software/CitationSection'
import CommunitiesSection from '~/components/software/CommunitiesSection'
import ContributorsSection from '~/components/software/ContributorsSection'
import {getRepositoryInfoForSoftware} from '~/components/software/edit/repositories/apiRepositories'
import {getContributorsForSoftware} from '~/components/software/edit/contributors/apiContributors'
import {getReferencePapersForSoftware} from '~/components/software/edit/mentions/reference-papers/apiReferencePapers'
import {getPackageManagersForSoftware} from '~/components/software/edit/package-managers/apiPackageManager'
import {getSoftwareHeritageItems} from '~/components/software/edit/software-heritage/apiSoftwareHeritage'
import {getTestimonialsForSoftware} from '~/components/software/edit/testimonials/apiSoftwareTestimonial'
import GetStartedSection from '~/components/software/GetStartedSection'
import OrganisationsSection from '~/components/software/OrganisationsSection'
import RelatedSoftwareSection from '~/components/software/RelatedSoftwareSection'
import SoftwareHeaderSection from '~/components/software/SoftwareHeaderSection'
import TestimonialSection from '~/components/software/TestimonialsSection'
import {createMetadata} from '~/components/seo/apiMetadata'

/**
 * Next.js app builtin function to dynamically create page metadata
 * @param param0
 * @returns
 */
export async function generateMetadata(
  {params}:Readonly<{params: Promise<{slug: string}>}>
): Promise<Metadata> {
  // read route params and token
  const [{slug},{token},headersList] = await Promise.all([
    params,
    getUserSettings(),
    headers()
  ])
  // find project by slug
  const software = await getSoftwareItem({
    slug: slug,
    token: token
  })

  const contributors = await getContributorsForSoftware({software:software?.id ?? '',token})
  const contact = contributors?.find(item => item.is_contact_person)
  const author = getDisplayName({
    given_names: contact?.given_names,
    family_names: contact?.family_names
  })

  // console.group('SoftwareViewPage.generateMetadata')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('resp...', resp)
  // console.groupEnd()

  // if organisation exists we create metadata
  if (software?.brand_name && software?.description){
    // extract domain to use in url
    const domain = headersList.get('host') || ''
    // build metadata
    const metadata = createMetadata({
      domain,
      page_title: software?.brand_name,
      description: software.description,
      url: `https://${domain}/software/${slug}`,
      // if image present return array with image else []
      image_url: software.image_id ? [
        `https://${domain}${getImageUrl(software.image_id)}`
      ]:[],
      other:{
        citation_title: software?.brand_name,
        citation_author: author ?? 'Author name',
        citation_publication_date: software.created_at,
        citation_doi: software.concept_doi ?? ''
      }
    })
    return metadata
  }

  return {
    title: `Software | ${app.title}`,
    description: 'This software is in Research Software Directory',
  }
}

export default async function SoftwareViewPage({
  params,
}:Readonly<{
  // extract slug from params
  params: Promise<{slug: string}>
}>) {
  // get slug and token
  const [{slug},{token},modules] = await Promise.all([
    params,
    getUserSettings(),
    getActiveModuleNames()
  ])

  // show 404 page if module is not enabled
  if (modules?.includes('software')===false){
    return notFound()
  }

  const software = await getSoftwareItem({slug,token})
  // show 404 page is software item not found
  if (software === undefined){
    return notFound()
  }
  // get user info
  const userInfo = getAccountFromToken(token)

  // download remote markdown
  if (software.description_type === 'link' && software.description_url) {
    const markdown = await getRemoteMarkdown(software.description_url)
    if (typeof markdown === 'string') {
      // NOTE! we always use description on software page view to show markdown
      software.description = markdown
    }
  }

  // fetch all info about software in parallel based on software.id
  const [
    releases,
    keywords,
    categories,
    licenseInfo,
    repositories,
    mentions,
    testimonials,
    contributors,
    relatedSoftware,
    relatedProjects,
    organisations,
    referencePapers,
    packages,
    swhids,
    communities,
    softwareMaintainer,
    orgMaintainer,
    comMaintainer
  ] = await Promise.all([
    // software versions info
    getReleasesForSoftware(software.id,token),
    // keywords
    getKeywordsForSoftware(software.id,token),
    // categories
    getCategoriesForSoftware(software.id, token),
    // licenseInfo
    getLicenseForSoftware(software.id, token),
    // repositoryInfo: url, languages and commits
    getRepositoryInfoForSoftware(software.id, token),
    // mentions
    getMentionsBySoftware({software:software.id,token}),
    // testimonials
    getTestimonialsForSoftware({software:software.id,token}),
    // contributors
    getContributorsForSoftware({software:software.id,token}),
    // relatedTools
    getRelatedSoftwareForSoftware({software: software.id,token}),
    // relatedProjects
    getRelatedProjectsForSoftware({software: software.id, token}),
    // get organisations
    getParticipatingOrganisations({software:software.id,token}),
    // reference papers
    getReferencePapersForSoftware({software:software.id,token}),
    // package managers
    getPackageManagersForSoftware({software:software.id,token}),
    // get software heritage ids
    getSoftwareHeritageItems({software:software.id,token}),
    // communities of software
    getCommunitiesOfSoftware({software:software.id,token}),
    // check if software maintainer
    isMaintainerOfSoftware({slug, account:userInfo?.account, token}),
    // get list of organisations user maintains
    getMaintainerOrganisations({token}),
    // get list of communities user maintains
    getCommunitiesOfMaintainer({token})
  ])
  // rsd_admin is added as maintainer
  const isMaintainer = userInfo?.role==='rsd_admin' ? true : softwareMaintainer

  // split categories into highlighted and filtered
  const highlightedCategories:CategoryPath[] =[]
  const softwareCategories:CategoryPath[] = []
  categories?.forEach(path=>{ // NOSONAR
    const root = path[0]
    // highlighted categories
    if (root?.properties.is_highlight){
      highlightedCategories.push(path)
    } else if (categoryFilter({root,isMaintainer,orgMaintainer,comMaintainer})){
      softwareCategories.push(path)
    }
  })

  // filter releases that have DOI and version
  const citableReleases = releases?.filter(item=>item.doi && item.version)

  // console.group('SoftwareViewPage')
  // console.log('highlightedCategories...', highlightedCategories)
  // console.log('softwareCategories...', softwareCategories)
  // console.log('categories...', categories)
  // console.log('orgMaintainer...', orgMaintainer)
  // console.log('comMaintainer...', comMaintainer)
  // console.log('isMaintainer...', isMaintainer)
  // console.log('swhids...', swhids)
  // console.log('repositories...', repositories)
  // console.log('testimonials...', testimonials)
  // console.log('contributors...', contributors)
  // console.groupEnd()

  return (
    <>
      {/* Edit page button only when maintainer */}
      <EditPageButton
        title="Edit software"
        url={`${slug}/edit/information`}
        isMaintainer={isMaintainer}
        variant="contained"
      />
      <SoftwareHeaderSection
        brand_name={software.brand_name}
        short_statement={software.short_statement ?? ''}
        counts={{
          mention_cnt: mentions.length ?? 0,
          contributor_cnt: contributors?.length ?? 0
        }}
      />
      {/* Get started && activity chart */}
      <GetStartedSection
        get_started_url={software.get_started_url}
        repositories={repositories ?? null}
      />
      <CitationSection
        releases={citableReleases ?? []}
        concept_doi={software.concept_doi}
      />
      {/* Description & sidebar section */}
      <AboutSection
        brand_name={software.brand_name}
        description={software?.description ?? ''}
        description_type={software?.description_type}
        keywords={keywords ?? []}
        categories={softwareCategories}
        licenses={licenseInfo ?? []}
        repositories={repositories}
        image_id={software.image_id}
        packages={packages}
        swhids={swhids}
      />
      {/* Participating organisations */}
      <OrganisationsSection
        organisations={organisations}
      />

      <DarkThemeSection>
        {/* Reference papers */}
        <MentionsSection
          title="Reference papers"
          mentions={referencePapers}
        />
        {/* Mentions */}
        <MentionsSection
          title="Mentions"
          mentions={mentions}
        />
      </DarkThemeSection>

      {/* Testimonials */}
      <TestimonialSection
        testimonials={testimonials}
      />
      {/* Contributors */}
      <ContributorsSection
        contributors={contributors}
      />
      {/* Highlighted categories section */}
      <CategoriesSection
        categories={highlightedCategories}
      />
      {/* Communities */}
      <CommunitiesSection
        communities={communities}
      />
      {/* Related projects (uses project components) */}
      <RelatedProjectsSection
        relatedProjects={relatedProjects}
      />
      {/* Related software */}
      <RelatedSoftwareSection
        relatedSoftware={relatedSoftware}
      />
    </>
  )
}
