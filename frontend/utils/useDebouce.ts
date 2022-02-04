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
  const [debouncedValue, setDebouncedValue] = useState(debounced)
  useEffect(() => {
    // update debounced value if no errors
    if (!errors) {
      // debugger
      setDebouncedValue(debounced)
    } else {
      // debugger
      // empty value if has errors
      setDebouncedValue('')
    }
  }, [debounced, errors])
  return debouncedValue
}
