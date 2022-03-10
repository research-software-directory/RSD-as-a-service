// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

type Data = {
  provider: string,
  env: {
    NEXT_PUBLIC_SURFCONEXT_CLIENT_ID?: string,
    NEXT_PUBLIC_SURFCONEXT_REDIRECT?: string,
    NEXT_PUBLIC_SURFCONEXT_WELL_KNOWN_URL?: string
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({
    provider: 'surfconext',
    env: {
      NEXT_PUBLIC_SURFCONEXT_CLIENT_ID: process.env.NEXT_PUBLIC_SURFCONEXT_CLIENT_ID,
      NEXT_PUBLIC_SURFCONEXT_REDIRECT: process.env.NEXT_PUBLIC_SURFCONEXT_REDIRECT,
      NEXT_PUBLIC_SURFCONEXT_WELL_KNOWN_URL: process.env.NEXT_PUBLIC_SURFCONEXT_WELL_KNOWN_URL
    }
  })
}
