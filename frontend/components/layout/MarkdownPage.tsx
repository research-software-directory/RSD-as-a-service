import MainContent from './MainContent'
import ReactMarkdownWithSettings from './ReactMarkdownWithSettings'

export default function MarkdownPage({markdown}:{markdown:string}) {
  return (
    <MainContent>
      <ReactMarkdownWithSettings
        className='py-8'
        markdown={markdown}
      />
    </MainContent>
  )
}
