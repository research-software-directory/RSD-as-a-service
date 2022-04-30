import {createContext, useReducer} from 'react'
import {Action} from './editProjectReducer'

import {EditProjectStep} from './editProjectSteps'
import {editProjectReducer} from './editProjectReducer'

export type ProjectInfo = {
  id: string,
  slug: string,
  title: string
}

export type EditProjectState = {
  step: EditProjectStep | undefined,
  project: ProjectInfo,
  loading: boolean
}

export const initalState:EditProjectState = {
  step: undefined,
  project: {
    id: '',
    slug: '',
    title:''
  },
  loading:true
}

export type EditProjectContextProps = {
  state: EditProjectState,
  dispatch: (action:Action) => void
}


const EditProjectContext = createContext<EditProjectContextProps>({
  state: initalState,
  dispatch: (action)=>{}
})

export function EditProjectProvider(props: any) {
  const [state, dispatch] = useReducer(editProjectReducer, props?.state ?? initalState)

  return (
    <EditProjectContext.Provider value={{
        state,
        dispatch
      }}
      {...props}
    />
  )
}

export default EditProjectContext
