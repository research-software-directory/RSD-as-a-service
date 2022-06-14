export default function GlobalSearchAutocomplete() {
  return <div className="border px-3 py-2 flex relative ml-auto rounded-sm">
    <svg className="absolute right-[10px] top-[10px]" width="22" viewBox="0 0 18 18" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.98438" cy="9.10718" r="8.22705" stroke="currentColor"/>
    </svg>
    <input type="search" className="bg-transparent focus:outline-none"
           placeholder="Search Software" autoComplete="off"/>
  </div>
}
