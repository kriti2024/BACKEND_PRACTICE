
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: "postgres://postgres:kriti123@localhost:5432/practice"
});

client.connect()
    .then(() => console.log("Postgres connected"))
    .catch(err => console.log("Postgres connection error:", err));
export default client;