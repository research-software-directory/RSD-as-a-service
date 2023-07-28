import KeywordBox from './KeywordBox'

type KeywordsProps = {
    keywords: string
}

export default function Keywords({ keywords }: KeywordsProps) {
    const keywordArray = JSON.parse(keywords)
    const keywordButtons = keywordArray.map((keyword, index) => {
        return <KeywordBox key={index} label={keyword.value} />
    })
    return (
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-10 md:gap-3 p-5 md:p-10 ">
            {keywordButtons}
        </div>
    )
}