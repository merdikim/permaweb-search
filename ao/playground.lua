local json = require('json')

URL = "https://arweave.net/graphql?query=query%20%7B%20transactions(first%3A%2010%2C%20tags%3A%20%5B%7Bname%3A%20%22Content-Type%22%2C%20values%3A%20%5B%22text%2Fmarkdown%22%2C%20%22application%2Fpdf%22%5D%7D%5D)%20%7B%20edges%20%7B%20cursor%20node%20%7B%20id%20block%20%7B%20height%20timestamp%20%7D%20owner%20%7B%20address%20%7D%20tags%20%7B%20name%20value%20%7D%20%7D%20%7D%20%7D%20%7D"

Handlers.add('get-products', function(msg)
    print('Getting products...')
    send({
        target = id,
        ['relay-path'] = URL,
        resolve = '~relay@1.0/call/~patch@1.0',
        action = 'set-products'
    })
end)

Handlers.add('set-products', function(msg)
    print(msg)
    if msg.body then
        print('Received products from', msg['relay-path'])
        Products = json.decode(msg.body)
        print('Updated Products:')
        print(Products)
    end
end)
