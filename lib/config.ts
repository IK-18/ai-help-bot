export const config = {
	baseUrl: process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000",
	groqApiKey: process.env.GROQ_KEY || "",
	graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT || "",
};
