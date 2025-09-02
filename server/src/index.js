import { Client, cacheExchange, fetchExchange, gql } from 'urql';

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

// Serverless function handler
export default {
	async fetch(request, env, ctx) {
		let after = null;
		let dataType = 'text/markdown';
		if (request.method == 'POST') {
			const body = await request.json();
			dataType = body.data_type || dataType;
			after = body.cursor || null;
		}

		const result = await client.query(QUERY, { after, value: dataType }).toPromise();

		const edges = result.data?.transactions.edges ?? [];

		const serializedEdges = await Promise.all(
			edges.map(async (edge) => {
				const fetchResult = await fetch(`https://arweave.net/${edge.node.id}`);
				if (!fetchResult.ok) throw new Error(`HTTP error! Status: ${response.status}`);
				const text = await fetchResult.text();
				return {
					id: edge.node.id,
					// extract content type from tags
					// contentType: edge.node.tags.find(tag => tag.name === "Content-Type")?.value || "unknown",
					// blockHeight: edge.node.block.height,
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

		return new Response(
			JSON.stringify({
				transactions: serializedEdges,
				next_cursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			},
		);
	},
};
