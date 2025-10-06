import {redirect, RedirectType} from 'next/navigation'

/**
 * Redirect community root page to software tab as default
 * @param param0
 * @returns
 */
export default async function CommunityRedirectPage(
  {params}:Readonly<{params: Promise<{slug:string}>}>
) {
  const {slug} = await params
  // redirect to software tab
  return redirect(`/communities/${slug}/software`,RedirectType.replace)
}
