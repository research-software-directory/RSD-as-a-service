import {useRouter} from 'next/router'
import ProtectedContent from '../../auth/ProtectedContent'
import AppHeader from '../../components/layout/AppHeader'
import PageContainer from '../../components/layout/PageContainer'
import AppFooter from '../../components/layout/AppFooter'

import AddSoftwareModal from '../../components/software/add/AddSoftwareModal'

/**
 * Add new software. This page is only showing a modal with 2 fields:
 * title and short_statement. All "action" is stored in AddSoftwareModal
 */
export default function AddSoftware() {
  const router = useRouter()
  return (
    <>
      <AppHeader />
      <ProtectedContent>
        <PageContainer className="flex-1 px-4 py-6 lg:py-12">
          {/*
          This is empty page with add software modal only
          */}
        </PageContainer>
          <AddSoftwareModal
            action="open"
            onCancel={() => {
              // on close we send user back
              // on close is triggered
              router.back()
          }}/>
      </ProtectedContent>
      <AppFooter />
    </>
  )
}
