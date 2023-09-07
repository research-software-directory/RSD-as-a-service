import Link from 'next/link'

import {ssrProjectsUrl} from '~/utils/postgrestUrl'

type KeywordBoxProps = {
    label: string
}

export default function KeywordBox({label}: KeywordBoxProps) {
    const url = ssrProjectsUrl({keywords: [label]})
    return (
        <div className="bg-secondary text-primary-content p-2 text-center rounded-md">
            <div className="text-lg">
                <Link href={url}>
                    {label}
                </Link>
            </div>
        </div>
    )
}
