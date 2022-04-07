
export default function ProjectFunding({grant_id}: { grant_id: string | null }) {
  if (grant_id === null) return null
  return (
    <div>
      <h4 className="text-primary py-4">Funded under</h4>
      <div className="text-sm">Grant ID: {grant_id}</div>
      {/* <i>No links available</i> */}
    </div>
  )
}
