import { Client, cacheExchange, fetchExchange, gql } from "urql";

const client = new Client({
  url: "https://arweave.net/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

const QUERY = gql`
  query ($after: String) {
    transactions(
      first: 10
      after: $after
      tags: [{ name: "Content-Type", values: ["image/png"] }]
    ) {
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
    const after = null;

    const result = await client.query(QUERY, { after }).toPromise();

    const edges = result.data?.transactions.edges ?? [];
    const serializedEdges = edges.map((edge) => ({
      id: edge.node.id,
      // timestamp: edge.node.block.timestamp,
      // ownerAddress: edge.node.owner.address,
      // tags: edge.node.tags.reduce((acc, tag) => {
      //   acc[tag.name] = tag.value;
      //   return acc;
      // }, {}),
    }));

	return new Response(JSON.stringify({
	  transactions: serializedEdges,
	  nextCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
	}), {
	  headers: { "Content-Type": "application/json" },
	});
  },
};
