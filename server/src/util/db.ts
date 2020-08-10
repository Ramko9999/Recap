import {Pool} from "pg";
import config = require("../config/postgres.json");

const pgconfig = {
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port,
    database: config.database
}

const pool = new Pool(pgconfig);

async function query(str:string, params:string[]){
    return await pool.query(str, params);
}

const db = {
    query: query
}

export default db;


