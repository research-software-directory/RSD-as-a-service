// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

type Data = {
  provider: string,
  env: {
    NEXT_PUBLIC_HELMHOLTZAAI_CLIENT_ID?: string,
    NEXT_PUBLIC_HELMHOLTZAAI_REDIRECT?: string,
    NEXT_PUBLIC_HELMHOLTZAAI_WELL_KNOWN_URL?: string,
    NEXT_PUBLIC_HELMHOLTZAAI_RESPONSE_MODE?: string,
    NEXT_PUBLIC_HELMHOLTZAAI_SCOPES?: string
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({
    provider: 'helmholtzaai',
    env: {
      NEXT_PUBLIC_HELMHOLTZAAI_CLIENT_ID: process.env.NEXT_PUBLIC_HELMHOLTZAAI_CLIENT_ID,
      NEXT_PUBLIC_HELMHOLTZAAI_REDIRECT: process.env.NEXT_PUBLIC_HELMHOLTZAAI_REDIRECT,
      NEXT_PUBLIC_HELMHOLTZAAI_WELL_KNOWN_URL: process.env.NEXT_PUBLIC_HELMHOLTZAAI_WELL_KNOWN_URL,
      NEXT_PUBLIC_HELMHOLTZAAI_RESPONSE_MODE: process.env.NEXT_PUBLIC_HELMHOLTZAAI_RESPONSE_MODE,
      NEXT_PUBLIC_HELMHOLTZAAI_SCOPES: process.env.NEXT_PUBLIC_HELMHOLTZAAI_SCOPES
    }
  })
}
