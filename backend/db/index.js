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
        dbLog('Executed query:');
        dbLog({ text, duration, rows: res.rowCount });
        return res;
    },
    async getClient() {
        const client = await pool.connect();
        const query = client.query;
        const release = client.release;
        const timeout = setTimeout(() => {
            dbLog('A client has been checked out for more than 5 seconds.');
            dbLog(`The last executed query on this client was: ${client.lastQuery}`);
        }, 5000);
        client.query = (...args) => {
            client.lastQuery = args;
            return query.apply(client, args);
        };
        client.release = () => {
            clearTimeout(timeout);
            client.query = query;
            client.release = release;
            return release.apply(client);
        };
        return client;
    },
}