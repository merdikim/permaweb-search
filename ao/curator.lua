--local json = require('json')
ApusAI = require('@apus/ai')

ApusAI_Debug = true

DataType = {
    TEXT = "text",
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
    MARKDOWN = "markdown"
}

Version = "1.0.0"

local relay_url ="https://my-first-worker.merdikimuha1.workers.dev/"

local dataset = {}

Handlers.add("tick", function(msg)
--    send({target = id, ['relay-path'] = relay_url, resolve = '~relay@1.0/call/~patch@1.0', action = 'set-new-transactions'})
   print("Request sent to relay for new transactions.")
   ApusAI.infer("What is an AI agent?")
end)

Handlers.add("set-new-transactions", function(msg)

    assert(msg['relay-path'] == relay_url, "relay path mismatch")
    print("Received new transactions from", msg['relay-path'])

    if msg.body then
        local result = require('json').decode(msg.body)
        for index, data in ipairs(result.transactions) do
            table.insert(dataset, data)
        end
    else
        print("No transactions received.")
    end
    print(dataset)
end)
