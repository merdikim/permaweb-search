import { createDataItemSigner, message, result } from '@permaweb/aoconnect'
import { useQuery } from '@tanstack/react-query'
import { process } from '@/utils'

const useSearch = (query: string) => {
  const tags = [{ name: 'Action', value: 'search' }]

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['fetch-data', query],
    queryFn: async () => {
      console.log(query)
      const messageId = await message({
        process,
        // @ts-ignore
        signer: createDataItemSigner(globalThis.arweaveWallet),
        tags,
        data: query,
      })

      const { Messages } = await result({
        message: messageId,
        process,
      })

      console.log(Messages[0].Data)

      return JSON.parse(Messages[0].Data)
    },
  })
  return { searchResults, isLoading }
}

export default useSearch
