import { useState } from 'react'
import { createDataItemSigner, message } from '@permaweb/aoconnect'
import search_icon from './assets/search.svg'
import loader_icon from './assets/loader.svg'
import { process } from './utils'

function App() {
  const [loading, setLoading] = useState(false)

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault()
    const searchInput = (document.getElementById('searchBox') as HTMLInputElement)
  
    const tags = [{ name: 'Action', value: 'Search' }]

    if (!searchInput.value) {
      return console.log('Please enter a search query')
    }
    setLoading(true)
    const messageId = await message({
      process,
      // @ts-expect-error
      signer: createDataItemSigner(window.arweaveWallet),
      tags,
      data: searchInput.value
    })
    setLoading(false)
    console.log('Message ID:', messageId)
    searchInput.value = ''
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
            disabled={loading}
          >
            <img
              src={loading ? loader_icon : search_icon}
              alt="search"
              className={loading ? 'animate-spin' : ''}
            />
          </button>
        </form>

        <div className="flex gap-4 mb-8">
          this page will hold some quotes or something like that
        </div>
      </main>
    </div>
  )
}

export default App
