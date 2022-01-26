import Head from 'next/head'

export default function CitationMeta({title, author, publication_date, concept_doi}: {
  title:string,author:string,publication_date:string|null,concept_doi:string|null
}) {
  // do not render citation meta tags if concept_doi is not present
  if (!concept_doi) return null

  return (
    <Head>
      <meta name="citation_title" content={title} />
      <meta name="citation_author" content={author} />
      <meta name="citation_publication_date" content={publication_date || new Date().toISOString()} />
      <meta name="citation_doi" content={concept_doi} />
    </Head>
  )
}
