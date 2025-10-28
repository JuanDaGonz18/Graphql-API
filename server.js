import { ApolloServer, gql } from "apollo-server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// --- Configuración DB SQLite ---
let db;
async function initDB() {
  db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database
  });

  // Crear tablas si no existen
  await db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      email TEXT,
      age INTEGER,
      major TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS breeds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      origin TEXT,
      temperament TEXT,
      description TEXT
    );
  `);

  // Datos iniciales si la tabla está vacía
  const { count: sCount } = await db.get("SELECT COUNT(*) as count FROM students");
  if (sCount === 0) {
    await db.run(`
      INSERT INTO students (firstName,lastName,email,age,major)
      VALUES
        ('Ana','Lopez','ana@mail.com',21,'Computer Science'),
        ('Juan','Perez','juan@mail.com',22,'Math'),
        ('Maria','Gomez','maria@mail.com',20,'Engineering');
    `);
  }

  const { count: bCount } = await db.get("SELECT COUNT(*) as count FROM breeds");
  if (bCount === 0) {
    await db.run(`
      INSERT INTO breeds (name,origin,temperament,description)
      VALUES
        ('Siamese','Thailand','Affectionate','Very social cat breed'),
        ('Persian','Iran','Calm','Long-haired, quiet, affectionate'),
        ('Maine Coon','USA','Gentle','Large, friendly, dog-like personality');
    `);
  }
}

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

// --- Resolvers (cómo obtener los datos) ---
const resolvers = {
  Query: {
    students: async () => await db.all("SELECT * FROM students"),
    breed: async (_, { id }) => await db.get("SELECT * FROM breeds WHERE id = ?", [id])
  }
};

// --- Inicializar servidor ---
async function startServer() {
  await initDB();

  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen({ port: 4000 });
  console.log(`🚀 Servidor GraphQL listo en: ${url}`);
}

startServer();
