/**
 * Based on database enum type from
 * database/008-create-mention-table.sql
 */

export const mentionType = {
  attachment: 'Attachment',
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

export type MentionType = keyof typeof mentionType
