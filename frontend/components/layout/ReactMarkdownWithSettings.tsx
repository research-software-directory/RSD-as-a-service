import ReactMarkdown from 'react-markdown'

export default function ReactMarkdownWithSettings({markdown, className}:{markdown:string, className?:string}) {
  return (
    <ReactMarkdown
      className={`prose ${className}`}
      linkTarget="_blank"
      skipHtml={true}
    >
      {markdown ?? ''}
    </ReactMarkdown>
  )
}
