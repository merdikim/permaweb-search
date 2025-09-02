local json = require('json')
local indexer = "T3ZC9Qix3wYDwLrID5adSOW5AY1lhtJE1sH487C3iFE"

DataTypes = {
    text  = {"text/plain", "text/html", "application/json", "text/csv", "text/markdown", "application/pdf"},
    image = {"image/png", "image/jpeg", "image/gif", "image/svg+xml"},
    video = {"video/mp4", "video/webm", "video/ogg"},
    audio = {"audio/mpeg", "audio/wav", "audio/ogg"},
}

Version = "1.0.0"

local relay_url ="https://my-first-worker.merdikimuha1.workers.dev/"

local last_cursor = nil -- To keep track of the last fetched transaction cursor

Handlers.add("tick", function(msg)
    send({
        target = id,
        ['relay-path'] = relay_url,
        ['relay-body'] = json.encode({cursor = last_cursor}),
        ['relay-method'] = "POST" ,
        resolve = '~relay@1.0/call/~patch@1.0',
        action = 'set-new-transactions'
    })
    print("Request sent to relay for new transactions.")
end)

Handlers.add("set-new-transactions", function(msg)

    assert(msg['relay-path'] == relay_url, "relay path mismatch")
    print("Received new transactions from", msg['relay-path'])

    if msg.body then
        local result = json.decode(msg.body)
        print("last cursor:", last_cursor)
        print("New cursor:", result.next_cursor)
        send({
            target = indexer,
            action = 'index-transaction',
            data = json.encode(result.transactions)
        })
    else
        print("No transactions received.")
    end
end)
