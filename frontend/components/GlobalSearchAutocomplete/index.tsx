const data = [
  'Asparagus',
  'Beetroot',
  'Broccoli',
  'Cabbage',
  'Carrot',
  'Cauliflower',
  'Celery',
  'Corn',
  'Eggplant',
  'Lettuce',
  'Mushroom',
  'Onion',
  'Parsnip',
  'Pea',
  'Potato',
  'Pumpkin',
  'Radish',
  'Spinach',
  'Tomato',
  'Turnip',
]
export default function GlobalSearchAutocomplete() {
  return (
    <div className="z-10 border px-3 py-2 flex relative ml-auto rounded-sm">
      <svg className="absolute right-[10px] top-[10px]" width="22" viewBox="0 0 18 18" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <circle cx="8.98438" cy="9.10718" r="8.22705" stroke="currentColor"/>
      </svg>
      <input type="search" className="bg-transparent focus:outline-none"
             placeholder="Search or jump to" autoComplete="off"/>
      <div className="shadow-xl absolute top-[60px] w-full bg-white text-black py-2">
        {[0, 1, 2, 3].map(item =>
          <div key={item} className="flex gap-2 hover:bg-[#09A1E3] p-2 cursor-pointer transition">
            <svg className="" width="22" viewBox="0 0 18 18" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.98438" cy="9.10718" r="8.22705" stroke="currentColor"/>
            </svg>
            hello</div>)
        }
      </div>
    </div>
  )
}
