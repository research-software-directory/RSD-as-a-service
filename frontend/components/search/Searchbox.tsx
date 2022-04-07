import {useState, useEffect, useContext} from 'react'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import {useDebounce} from '../../utils/useDebouce'
import ClearIcon from '@mui/icons-material/Clear'

import SearchContext from './SearchContext'

export default function Searchbox() {
  const {searchInput,setSearchInput,placeholder,setSearchFor} = useContext(SearchContext)
  // const [state,setState]=useState({
  //   value: searchInput,
  //   wait: true
  // })
  // const searchFor=useDebounce(state.value, delay ?? 400)

  // useEffect(()=>{
  //   const {wait,value} = state
  //   if (wait===false && value===searchFor){
  //     setState({
  //       wait:true,
  //       value
  //     })
  //     setSearchFor(searchFor)
  //   }
  // }, [state, searchFor, setSearchFor])

  // useEffect(() => {
  //   debugger
  //   setState({
  //     value: searchInput,
  //     wait: true
  //   })
  // },[searchInput])

  return (
    <Input
      id="search-input"
      autoComplete='off'
      placeholder={placeholder}
      value={searchInput}
      sx={{
        flex:1,
        minWidth: ['inherit', '20.5rem', '19.5rem']
      }}
      onChange={({target})=>{
        setSearchInput(target.value)
      }}
      onKeyPress={(event)=>{
        // pass search value on enter
        if (event.key.toLowerCase()==='enter'){
          setSearchFor(searchInput)
        }
      }}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon
            sx={{cursor: 'pointer'}}
            onClick={() => setSearchFor(searchInput)} />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="start">
          {searchInput ?
            <ClearIcon
              sx={{cursor:'pointer'}}
              onClick={()=>{
                setSearchInput('')
              }}
            />
            :null
          }
        </InputAdornment>
      }
    />
  )
}
