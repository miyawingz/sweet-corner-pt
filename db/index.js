const db = require('../config/db.js');
const { Pool } = require('pg');

const pool = new Pool(db);

module.exports = {
    query: (text, values, callback) => {
        return pool.query(text, values, callback)
    }
};