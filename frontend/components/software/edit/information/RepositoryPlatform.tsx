import {useState, useEffect} from 'react'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'

import {Controller} from 'react-hook-form'

import {Option} from '~/components/form/ControlledSelect'

type RepositoryPlatformProps = {
  name: string
  label: string
  options: Option[]
  defaultValue: string | null
  control: any
  rules: any
  sx?: any
  watch: any
}

type LocalState = {
  repositoryUrl: string | null
  platform: string | null
  disabled: boolean
  helperText: string
  defaultValue: string | null
}

function SuggestPlatform(repositoryUrl:string) {
  if (repositoryUrl === '') {
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
  const {watch, name, label, options, control, rules, defaultValue, sx} = props
  const repositoryUrl = watch('repository_url')

  useEffect(() => {
    // suggest platform on repository value change
    if (repositoryUrl !== state.repositoryUrl) {
      const platform = SuggestPlatform(repositoryUrl)
      if (platform === null) {
        setState({
          repositoryUrl,
          platform: null,
          disabled: true,
          helperText: 'Missing',
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
      } else{
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
    state.defaultValue
  ])

  // console.group('RepositoryPlatform')
  // console.log('state...', state)
  // console.log('repositoryUrl...', repositoryUrl)
  // console.groupEnd()

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      control={control}
      render={({field}) => {
        const {onChange} = field
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
              value={state.platform ?? ''}
              onChange={({target}: { target: any }) => {
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
