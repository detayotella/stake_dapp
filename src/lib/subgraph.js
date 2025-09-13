// lib/subgraph.js
import { GraphQLClient } from "graphql-request";

// The endpoint from your deployed subgraph
const SUBGRAPH_URL = import.meta.env.VITE_SUBGRAPH_URL;

export const client = new GraphQLClient(SUBGRAPH_URL);
