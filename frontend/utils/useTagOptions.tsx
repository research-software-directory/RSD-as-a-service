import {useState,useEffect} from 'react'
import {AutocompleteOption} from '../types/AutocompleteOptions'
import {Tag} from '../types/SoftwareTypes'

const tagOptions = [
  {label: 'Big data'},
  {label: 'GPU'},
  {label: 'High performance computing'},
  {label: 'Image processing'},
  {label: 'Inter-operability & linked data'},
  {label: 'Machine learning'},
  {label: 'Multi-scale & multi model simulations'},
  {label: 'Optimized data handling'},
  {label: 'Real time data analysis'},
  {label: 'Text analysis & natural language processing'},
  {label: 'Visualization'},
  {label: 'Workflow technologies'}
]

export default function useTagOptions(softwareId: string) {
  const [options, setOptions] = useState<AutocompleteOption<Tag>[]>([])

  useEffect(() => {
    const tags = tagOptions.map(item => {
      return {
        key: item.label,
        label: item.label,
        data: {
          software: softwareId,
          tag: item.label
        }
      }
    })
    setOptions(tags)
  }, [softwareId])

  return options
}
