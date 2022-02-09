import {useContext} from 'react'

import EditSoftwareSection from './EditSoftwareSection'
import editSoftwareContext from './editSoftwareContext'
import EditSectionTitle from './EditSectionTitle'

export default function SoftwareTestimonials() {
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)

  return (
    <section className="flex-1">
      <EditSoftwareSection>
        <div className="py-4">
          <EditSectionTitle
            title="Testimonials"
          >
          </EditSectionTitle>
        </div>
      </EditSoftwareSection>
    </section>
  )
}
