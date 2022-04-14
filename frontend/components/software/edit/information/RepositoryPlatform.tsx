import {useState, useEffect} from 'react'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'

import {Control, Controller, UseFormSetValue, UseFormWatch} from 'react-hook-form'

import {Option} from '~/components/form/ControlledSelect'
import {CodePlatform, EditSoftwareItem} from '~/types/SoftwareTypes'

type RepositoryPlatformProps = {
  label: string
  options: Option[]
  defaultValue: CodePlatform | null
  control: Control<EditSoftwareItem,any>
  watch: UseFormWatch<EditSoftwareItem>
  setValue: UseFormSetValue<EditSoftwareItem>
  rules?: any
  sx?: any
  errors: any
}

type LocalState = {
  repositoryUrl: string | null
  platform: string | null
  disabled: boolean
  helperText: string
  defaultValue: string | null
}

function SuggestPlatform(repositoryUrl:string|null,hasErrors?:boolean) {
  if (repositoryUrl === null ||
    // needs minimal length here because error flag is provided
    // after the first input is processed while this function
    // triggers earlier
    repositoryUrl.length < 5 ||
    hasErrors) {
    return null
  }
  if (repositoryUrl?.includes('github.')) {
    return 'github'
  }
  if (repositoryUrl?.includes('gitlab.')) {
    return 'gitlab'
  }
  if (repositoryUrl?.includes('bitbucket.')) {
    return 'bitbucket'
  }
  // debugger
  return 'other'
}

export default function RepositoryPlatform(props: RepositoryPlatformProps) {
  const [state, setState] = useState<LocalState>({
    repositoryUrl: '',
    platform: null,
    disabled: true,
    helperText: '',
    defaultValue: null
  })
  const {watch, setValue, errors, label, options, control, rules, defaultValue, sx} = props
  const repositoryUrl = watch('repository_url')
  const repositoryErrors = errors?.repository_url

  useEffect(() => {
    // suggest platform on repository value change
    if (repositoryUrl !== state.repositoryUrl) {
      const platform = SuggestPlatform(
        repositoryUrl,
        typeof repositoryErrors !== 'undefined'
      )
      if (platform === null) {
        setValue('repository_platform',platform)
        setState({
          repositoryUrl,
          platform: null,
          disabled: true,
          helperText: 'Not applicable',
          defaultValue
        })
      } else if (state.defaultValue === null && defaultValue !== null) {
        // we use defaultValue/initalValue loaded from db
        setState({
          repositoryUrl,
          platform: defaultValue,
          disabled: false,
          helperText: defaultValue!==platform ? 'Are you sure?' : '',
          defaultValue
        })
      } else {
        // debugger
        setValue('repository_platform',platform)
        setState({
          repositoryUrl,
          platform: platform,
          disabled: false,
          helperText: defaultValue===platform ? '' : 'Suggestion',
          defaultValue
        })
      }
    }
  }, [
    // trigers
    defaultValue,
    repositoryUrl,
    state.repositoryUrl,
    state.defaultValue,
    setValue,
    repositoryErrors
  ])

  // console.group('RepositoryPlatform')
  // console.log('state...', state)
  // console.log('repositoryUrl...', repositoryUrl)
  // console.log('repositoryErrors...',repositoryErrors)
  // console.groupEnd()

  return (
    <Controller
      name='repository_platform'
      defaultValue={defaultValue}
      rules={rules}
      control={control}
      render={({field}) => {
        const {onChange,value} = field
        // if no url
        return (
          <FormControl variant="standard" sx={sx}>
            <InputLabel id={`select-${label}`}>
              {label}
            </InputLabel>
            <Select
              id={`select-${label}`}
              label={label}
              variant='standard'
              // always use value here to ensure sync with Controller
              value={value ?? ''}
              onChange={({target}: { target: any }) => {
                debugger
                // change value in form
                onChange(target.value)
                // update local state
                const suggestion = SuggestPlatform(repositoryUrl)
                setState({
                  ...state,
                  platform: target.value,
                  helperText: suggestion===target.value ? '' : 'Are you sure?'
                })
              }}
              disabled={state.disabled}
            >
              {options.map(item => {
                return (
                  <MenuItem
                    key={item.value}
                    value={item.value}>
                    {item.label}
                  </MenuItem>
                )
              })}
            </Select>
            <FormHelperText>{state.helperText}</FormHelperText>
          </FormControl>
        )
      }}
    />
  )
}
