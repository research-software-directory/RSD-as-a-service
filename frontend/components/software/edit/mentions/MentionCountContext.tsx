import {createContext} from 'react'

export const initialCount = {
  attachment: 0,
  blogPost: 0,
  book: 0,
  bookSection: 0,
  computerProgram: 0,
  conferencePaper: 0,
  document:0,
  interview: 0,
  journalArticle:0,
  magazineArticle:0,
  manuscript:0,
  newspaperArticle:0,
  note:0,
  presentation:0,
  radioBroadcast:0,
  report:0,
  thesis:0,
  videoRecording:0,
  webpage:0,
}

export type MentionCountByType = typeof initialCount

export type MentionCountContextProps = {
  mentionCount: MentionCountByType | undefined,
  setMentionCount: (mentionCount:MentionCountByType)=>void
}

const MentionCountContext = createContext<MentionCountContextProps>({
  mentionCount:initialCount,
  setMentionCount:()=>{}
})

export default MentionCountContext
