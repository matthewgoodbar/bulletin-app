const { Pool, Pool } = require('pg');
const dbLog = requre('debug')('backend:postgres');

const pool = new Pool();

module.exports = {
    query: (text, params, callback) => {
        const start = Date.now();
        return pool.query(text, params, (err, res) => {
            const duration = Date.now() - start;
            dbLog('executed query', { text, duration, rows: res.rowCount });
            callback(err, res);
        });
    },
}