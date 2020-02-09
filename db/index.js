const db = reqiure('../config/db.js');
const { Pool } = require('pg')

const pool = new Pool(db);

module.exports.db = pool;