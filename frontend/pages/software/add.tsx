import ProtectedContent from '../../auth/ProtectedContent'
import AppHeader from '../../components/layout/AppHeader'
import PageContainer from '../../components/layout/PageContainer'
import AppFooter from '../../components/layout/AppFooter'

// import AddSoftwareModal from '../../components/software/add/AddSoftwareModal'
import AddSoftwareCard from '../../components/software/add/AddSoftwareCard'

/**
 * Add new software. This page is only showing a modal with 2 fields:
 * title and short_statement. All "action" is stored in AddSoftwareModal
 */
export default function AddSoftware() {
  return (
    <>
      <AppHeader />
      <ProtectedContent>
        <PageContainer className="flex-1 px-4 py-6 lg:py-12">
          <AddSoftwareCard />
        </PageContainer>
      </ProtectedContent>
      <AppFooter />
    </>
  )
}
