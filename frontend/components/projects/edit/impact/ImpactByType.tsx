import {Session} from '~/auth'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import MentionEditSection from '~/components/mention/MentionEditSection'
import ContentLoader from '~/components/layout/ContentLoader'
import useProjectContext from '../useProjectContext'
import {cfgImpact as config} from './config'
import useImpactForProject from './useImpactForProject'

export default function ImpactByType({session}: { session: Session }) {
  const {project} = useProjectContext()
  const {loading,impactCnt} = useImpactForProject({
    project: project.id,
    token: session.token
  })

  // console.group('ImpactByType')
  // console.log('impactCnt...', impactCnt)
  // console.groupEnd()

  if (loading) {
    return (
      <ContentLoader />
    )
  }

  return (
    <>
      <EditSectionTitle
        title={config.title}
      >
        <h2>{impactCnt ?? 0}</h2>
      </EditSectionTitle>
      <div className="py-4"></div>
      <MentionEditSection />
    </>
  )
}
