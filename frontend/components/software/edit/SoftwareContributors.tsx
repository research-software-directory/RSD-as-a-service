import {useContext} from 'react'

import EditSoftwareStickyHeader from './EditSoftwareStickyHeader'
import EditSoftwareSection from './EditSoftwareSection'
import editSoftwareContext from './editSoftwareContext'
import EditSectionTitle from './EditSectionTitle'

export default function SoftwareContributors() {
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)

  function resetForm() {
    console.log('TODO! implement reset')
  }

  return (
    <section className="flex-1">
      <EditSoftwareStickyHeader
        brand_name={pageState?.software?.brand_name ?? ''}
        isCancelDisabled={true}
        isSaveDisabled={true}
        onCancel={resetForm}
      />
      <EditSoftwareSection>
        <div className="py-4">
          <EditSectionTitle
            title="Contributors"
          >
          </EditSectionTitle>
        </div>
      </EditSoftwareSection>
    </section>
  )
}
