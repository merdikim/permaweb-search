import { useNavigate, useParams } from '@tanstack/react-router'
import useSearch from './hooks.tsx/useSearch'
import search_icon from './assets/search.svg'
import { formatTimeRelative, truncate } from './utils'

const GoogleSearchPage = () => {
  const { query } = useParams({ from: '/$query' })
  const { searchResults, isLoading } = useSearch(query)
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

  console.log(searchResults)

  const LoadingState = () => (
    <div className="max-w-2xl mx-auto px-4">
      {/* Search bar skeleton */}
      <div className="flex items-center mb-8">
        <div className="flex-1 h-12 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* Results count skeleton */}
      <div className="h-4 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>

      {/* Search results skeletons */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="mb-8">
          <div className="h-4 bg-gray-200 rounded w-80 mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mb-2 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          A glimpse of the Permaweb
        </header>

        {/* Search Bar */}
        <div className="flex justify-center mt-6 mb-8">
          <div className="w-full max-w-2xl px-4">
            <div className="relative"></div>
          </div>
        </div>

        {/* Loading Content */}
        <LoadingState />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        A glimpse of the Permaweb
      </header>

      <div className="flex items-center mb-8 max-w-[700px] mx-auto px-4 mt-6">
        <form className="w-full max-w-xl relative mb-8">
          <input
            type="text"
            defaultValue={query}
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
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <nav className="flex space-x-8">
            <a
              href="#"
              className="py-3 border-b-3 border-blue-500 text-blue-600 text-sm font-medium"
            >
              Text
            </a>
            <a
              href="#"
              className="py-3 text-gray-600 text-sm hover:text-gray-800"
            >
              Images
            </a>
            <a
              href="#"
              className="py-3 text-gray-600 text-sm hover:text-gray-800"
            >
              Videos
            </a>
            <a
              href="#"
              className="py-3 text-gray-600 text-sm hover:text-gray-800"
            >
              More
            </a>
            <div className="flex-1"></div>
            <a
              href="#"
              className="py-3 text-gray-600 text-sm hover:text-gray-800"
            >
              Agents
            </a>
          </nav>
        </div>
      </div>

      {/* Results */}
      <main className="max-w-2xl mx-auto px-4 mt-6">
        {searchResults.length > 0 && (
          <div className="text-gray-600 text-sm mb-6">
            About {searchResults.length} results
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-8 min-h-[60vh]">
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((result: any, index: number) => (
                <div key={index} className="group">
                  <div className='mt-3 text-xs font-light flex justify-between'>{formatTimeRelative(result.entry.timestamp)}</div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <div>
                          {/* @ts-ignore*/}
                          <a
                            target="_blank"
                            href={`https://arweave.net/raw/${result.entry.id}`}
                            className="text-blue-600 text-base group-hover:font-semibold transition-all ease-in-out"
                          >{`https://arweave.net/raw/${result.entry.id}`}</a>
                        </div>
                      </div>
                      {/* @ts-ignore*/}
                      <p className="text-gray-600 text-sm leading-5">
                        {result.entry.summary}
                      </p>
                    </div>
                  </div>
                  <div className='mt-3 text-xs font-light flex'>
                    <div className='mr-2'>Owned by : {truncate(result.entry.owner)}</div> |
                    <div className='ml-2'>Safety severity level: <span className={`${result.entry.safety.severity !== 'low' && 'text-yellow-600'} font-semibold`}>{result.entry.safety.severity}</span></div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <i className="mt-40">No result found</i>
          )}
        </div>
      </main>
    </div>
  )
}

export default GoogleSearchPage
