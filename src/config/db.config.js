
// const pg = require('pg');
import pg from 'pg';
const conString = "postgres://postgres:kriti123@localhost:5432/practice";

const client = new pg.Client(conString);
client.connect();

export default client;