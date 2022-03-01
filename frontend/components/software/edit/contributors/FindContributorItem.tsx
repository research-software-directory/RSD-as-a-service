import {AutocompleteOption} from '../../../../types/AutocompleteOptions'
import {SearchContributor} from '../../../../types/Contributor'

export default function FindContributorItem({option}: { option: AutocompleteOption<SearchContributor> }) {

  function renderSecondRow() {
    if (option.data?.affiliation && option.data?.orcid) {
      return (
        <div className="grid grid-cols-[4fr,3fr] gap-2">
          <div>{option.data?.affiliation}</div>
          <div className="pl-4 text-right">{option.data?.orcid}</div>
        </div>
      )
    }
    if (option.data?.affiliation) {
      return (
        <div className="flex-1">
          {option.data?.affiliation}
        </div>
      )
    }
    if (option.data?.orcid) {
      return (
        <div className="flex-1 text-right">
          {option.data?.orcid}
        </div>
      )
    }
  }

  return (
    <article className="flex-1">
      <div className="grid grid-cols-[3fr,1fr] gap-2">
        <div className="flex items-center">
          <strong><span className="flex-1">{option.label}</span></strong>
        </div>
        <span className="text-right">{option.data?.source}</span>
      </div>
      <div className="py-1 text-[0.75rem]">
        {renderSecondRow()}
      </div>
    </article>
  )
}
