const { Pool } = require('pg');
const dbLog = require('debug')('backend:postgres');

const pool = new Pool();

// module.exports = {
//     query: (text, params, callback) => {
//         const start = Date.now();
//         return pool.query(text, params, (err, res) => {
//             const duration = Date.now() - start;
//             dbLog('executed query', { text, duration, rows: res.rowCount });
//             callback(err, res);
//         });
//     },
// }

module.exports = {
    async query(text, params) {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        dbLog('executed query');
        dbLog({ text, duration, rows: res.rowCount });
        return res;
    },
}