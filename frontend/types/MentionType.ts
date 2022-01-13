/**
 * Based on database enum type from
 * database/008-create-mention-table.sql
 */

export const mentionType = {
  attachment: 'Attachment',
  blogPost:'BlogPost',
  book:'Book',
  bookSection:'Book section',
  computerProgram:'Computer program',
  conferencePaper:'Conference paper',
  document:'Document',
  interview:'Interview',
  journalArticle:'Journal article',
  magazineArticle:'Magazine article',
  manuscript:'Manuscript',
  newspaperArticle:'Newspaper article',
  note:'Note',
  presentation:'Presentation',
  radioBroadcast:'Radio broadcast',
  report:'Report',
  thesis:'Thesis',
  videoRecording:'Video recording',
  webpage : 'Webpage',
  // additional type to split coportate blog?
  corporateBlog : 'Corporate blog'
}

export type MentionType = keyof typeof mentionType
