import { useNavigate } from '@tanstack/react-router'
import search_icon from './assets/search.svg'
import { quotes } from './utils'

function App() {
  const navigate = useNavigate()

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault()
    const searchInput = document.getElementById('searchBox') as HTMLInputElement

    if (!searchInput.value) {
      return console.log('Please enter a search query')
    }
    navigate({
      to: '/$query',
      params: { query: searchInput.value },
    })
  }

  return (
    <div className="font-google min-h-screen flex flex-col bg-white text-text-gray">
      <main className="flex-1 flex flex-col justify-center items-center px-5 -mt-24">
        <div className="text-6xl md:text-8xl lg:text-9xl font-normal mb-8 bg-gradient-to-r from-cyan-500 from- via-blue-500 to-red-600 bg-clip-text text-transparent tracking-tight animate-fade-in">
          Search
        </div>

        <form className="w-full max-w-xl relative mb-8">
          <input
            type="text"
            id="searchBox"
            className="w-full h-12 pl-5 rounded-full border border-gray-300 text-base outline-none search-shadow hover:search-shadow-hover focus:search-shadow-hover transition-all duration-200"
            placeholder="Search or type a URL"
            autoComplete="off"
          />

          <button
            type="submit"
            onClick={handleSearch}
            className="absolute cursor-pointer right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-google-blue hover:opacity-80 transition-opacity"
          >
            <img src={search_icon} alt="search" />
          </button>
        </form>

        <div className="flex gap-4 mb-8 text-xs md:text-sm text-center px-5 text-gray-400 italic animate-fade-in-slow mt-44">
          " {quotes[Math.floor(Math.random() * quotes.length)]} "
        </div>
      </main>
    </div>
  )
}

export default App
