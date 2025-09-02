import { Client, cacheExchange, fetchExchange, gql } from 'urql';
import { message, createSigner } from '@permaweb/aoconnect/node'

import fs from "fs"

const wallet = fs.readFileSync('./wallet.json')

const client = new Client({
	url: 'https://arweave.net/graphql',
	exchanges: [cacheExchange, fetchExchange],
});

const QUERY = gql`
	query ($after: String, $value: String!) {
		transactions(first: 1, after: $after, tags: [{ name: "Content-Type", values: [$value] }]) {
			edges {
				cursor
				node {
					id
					block {
						height
						timestamp
					}
					owner {
						address
					}
					tags {
						name
						value
					}
				}
			}
		}
	}
`;


let after = null;


const fetchData = async() => {


		let dataType = 'text/markdown';


		const result = await client.query(QUERY, { after, value: dataType }).toPromise();

		const edges = result.data?.transactions.edges ?? [];

		const serializedEdges = await Promise.all(
			edges.map(async (edge) => {
				after = edge.cursor
				const fetchResult = await fetch(`https://arweave.net/${edge.node.id}`);
				if (!fetchResult.ok) throw new Error(`HTTP error! Status: ${response.status}`);
				const text = await fetchResult.text();
				return {
					id: edge.node.id,
					// extract content type from tags
					contentType: edge.node.tags.find(tag => tag.name === "Content-Type")?.value || "unknown",
					timestamp: edge.node.block.timestamp,
					ownerAddress: edge.node.owner.address,
					tags: edge.node.tags.reduce((acc, tag) => {
						acc[tag.name] = tag.value;
						return acc;
					}, {}),
					text,
				};
			}),
		);

		const tags = [{ name: "Action", value: "index-transaction" }]

		await message({
		  process: "T3ZC9Qix3wYDwLrID5adSOW5AY1lhtJE1sH487C3iFE",
		  signer: createSigner(JSON.parse(wallet)),
		  tags,
		  data: JSON.stringify(serializedEdges[0])
		})

		console.log('another one indexed')
}

setInterval(fetchData, 12000)
