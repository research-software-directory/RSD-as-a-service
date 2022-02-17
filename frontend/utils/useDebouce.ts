import {useState,useEffect} from 'react'

export function useDebounce(value:string, delay:number) {
  // state debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      // update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      // clear timeout on value changes or unmount
      return () => {
        clearTimeout(handler)
      }
    },[value, delay])
  return debouncedValue
}

export function useDebounceValid(value: string, errors:any, delay: number = 500) {
  // state debounced value
  const debounced = useDebounce(value, delay)
  const [debouncedValue, setDebouncedValue] = useState<string>()

  useEffect(() => {
    // update debounced value if no errors
    if (!errors){
      // NOTE! only when value and debounced have same value
      // it means that user stopped typing and the final input (value)
      // is valid according to the validation rules provided to react-hook-form
      if (value === debounced) {
        setDebouncedValue(debounced)
      } else {
        setDebouncedValue(undefined)
      }
    } else {
      setDebouncedValue(undefined)
    }
  }, [debounced,value,errors])
  // console.group('useDebounceValid')
  // console.log('delay...', delay)
  // console.log('value...', value)
  // console.log('debouncedValue...', debouncedValue)
  // console.log('errors...', errors)
  // console.groupEnd()
  return debouncedValue
}

export function useDebounceWithAutocomplete(value: string, selected: string|undefined, delay: number = 500) {
  // state debounced value
  const debounced = useDebounce(value, delay)
  const [debouncedValue, setDebouncedValue] = useState<string>()

  useEffect(() => {
    // NOTE! only when value and debounced are same but not selected
    // it means that user stopped typing and the final input (value)
    // is valid according to the validation rules provided to react-hook-form
    if (value === debounced && value!==selected) {
      setDebouncedValue(debounced)
    } else {
      setDebouncedValue(undefined)
    }
  }, [debounced, value, selected])
  // console.group('useDebounceWithAutocomplete')
  // console.log('delay...', delay)
  // console.log('value...', value)
  // console.log('debouncedValue...', debouncedValue)
  // console.log('selected...', selected)
  // console.groupEnd()
  return debouncedValue
}
