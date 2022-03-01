/**
 * Based on database enum type from
 * database/008-create-mention-table.sql
 */
export const mentionType = {
  attachment:'Attachments',
  blogPost:'Blogposts',
  book:'Books',
  bookSection:'Book section',
  computerProgram:'Computer programs',
  conferencePaper:'Conference papers',
  document:'Documents',
  interview:'Interviews',
  journalArticle:'Journal articles',
  magazineArticle:'Magazine articles',
  manuscript:'Manuscripts',
  newspaperArticle:'Newspaper articles',
  note:'Notes',
  presentation:'Presentations',
  radioBroadcast:'Radio broadcasts',
  report:'Reports',
  thesis:'Thesis',
  videoRecording:'Video recordings',
  webpage : 'Webpages',
  // additional type for featured mentions
  featured : 'Featured mentions'
}

export const mentionTypeSingular = {
  attachment: 'Attachment',
  blogPost: 'Blogpost',
  book: 'Book',
  bookSection: 'Book section',
  computerProgram: 'Computer program',
  conferencePaper: 'Conference paper',
  document: 'Document',
  interview: 'Interview',
  journalArticle: 'Journal article',
  magazineArticle: 'Magazine article',
  manuscript: 'Manuscript',
  newspaperArticle: 'Newspaper article',
  note: 'Note',
  presentation: 'Presentation',
  radioBroadcast: 'Radio broadcast',
  report: 'Report',
  thesis: 'Thesis',
  videoRecording: 'Video recording',
  webpage: 'Webpage',
  // additional type for featured mentions
  // featured: 'Featured mentions'
}

export type MentionEditType = keyof typeof mentionTypeSingular
export type MentionType = keyof typeof mentionType

// as in mention table
export type MentionItem = {
  id: string
  author?: string
  date?: string
  // url to external image
  image?: string
  is_featured: boolean
  title: string
  type?: MentionType
  url?: string
  version?: number
  zotero_key?: string
}

// mention table joined with mention_for_software
export type MentionForSoftware = {
  id: string,
  date: string,
  is_featured: boolean,
  title: string,
  type: MentionType,
  url: string,
  // url to external image
  image: string,
  author: string,
  mention_for_software?: any[]
}
