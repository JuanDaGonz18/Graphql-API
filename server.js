import { ApolloServer, gql } from "apollo-server";
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

// --- Conexión a PostgreSQL (Aiven) ---
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PORT,
  ssl: { rejectUnauthorized: false }
});

// --- Definición del esquema GraphQL ---
const typeDefs = gql`
  type Student {
    id: ID!
    firstName: String
    lastName: String
    email: String
    age: Int
    major: String
  }

  type Breed {
    id: ID!
    name: String
    origin: String
    temperament: String
    description: String
  }

  type Query {
    students: [Student]
    breed(id: ID!): Breed
  }
`;

// --- Resolvers ---
const resolvers = {
  Query: {
    students: async () => {
      const { rows } = await pool.query("SELECT * FROM students");
      return rows;
    },
    breed: async (_, { id }) => {
      const { rows } = await pool.query("SELECT * FROM breeds WHERE id = $1", [id]);
      return rows[0];
    }
  }
};

// --- Inicializar servidor ---
async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen({ port: process.env.PORT || 4000 });
  console.log(`🚀 Servidor GraphQL listo en: ${url}`);
}

startServer();
