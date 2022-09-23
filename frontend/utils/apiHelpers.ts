import {NextApiRequest} from 'next/types'

export type Error={
  message: string
}

export function extractParam(req: NextApiRequest, param: string) {
  // load parameter
  const p = req.query[param]
  if (p) {
    // if exists
    if (typeof p === 'string') {
      return p
    } else {
      return p.toString()
    }
  }
  return ''
}
