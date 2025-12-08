// lib/neo4j.ts
import neo4j, { Driver, Session } from "neo4j-driver";

if (!process.env.NEO4J_URI || !process.env.NEO4J_USERNAME || !process.env.NEO4J_PASSWORD) {
  throw new Error("Neo4j environment variables are missing");
}

const driver: Driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

export const getNeo4jSession = (): Session => driver.session();

export const closeNeo4j = async () => {
  await driver.close();
};
