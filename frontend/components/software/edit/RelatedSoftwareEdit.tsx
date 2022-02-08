import {useContext} from 'react'

import EditSoftwareSection from './EditSoftwareSection'
import editSoftwareContext from './editSoftwareContext'
import EditSectionTitle from './EditSectionTitle'

export default function RelatedSoftwareEdit() {
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)

  return (
    <section className="flex-1">
      <EditSoftwareSection className="pl-8">
        <div className="py-4">
          <EditSectionTitle
            title="Related Software"
          >
          </EditSectionTitle>
        </div>
      </EditSoftwareSection>
    </section>
  )
}
