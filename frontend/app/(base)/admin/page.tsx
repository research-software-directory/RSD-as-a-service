import {redirect} from 'next/navigation'

import {defaultAdminPage} from '~/components/admin/AdminNavItems'

/**
 * We redirect to default admin page from here
 * @returns
 */
export default async function AdminRedirectPage() {
  // redirect to default admin page
  return redirect(`/admin/${defaultAdminPage}`)
}
